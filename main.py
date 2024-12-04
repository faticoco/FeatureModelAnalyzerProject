from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import xml.etree.ElementTree as ET
from typing import List, Dict, Set, Tuple, Optional
import threading
import uvicorn
from collections import deque
from pysat.solvers import Solver
from itertools import combinations

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FeatureNode:
    def __init__(self, name, mandatory=False):
        self.name = name
        self.mandatory = mandatory
        self.children = []
        self.group_type = None

class FeatureSelection(BaseModel):
    selected_features: List[str]

class ParsedModel:
    def __init__(self):
        self.feature_model = {}
        self.constraints = []
        self.clauses = []
        self.feature_map = {}
        self.reverse_map = {}
        self.english_statements = []

class ValidationResult:
    def __init__(self, valid: bool, message: str, details: List[str]):
        self.valid = valid
        self.message = message
        self.details = details

# Global model storage with thread safety
class ModelStorage:
    def __init__(self):
        self._storage = {}
        self._lock = threading.Lock()
    
    def store_model(self, session_id: str, model: ParsedModel):
        with self._lock:
            self._storage[session_id] = model
    
    def get_model(self, session_id: str) -> Optional[ParsedModel]:
        with self._lock:
            return self._storage.get(session_id)
    
    def clear_model(self, session_id: str):
        with self._lock:
            if session_id in self._storage:
                del self._storage[session_id]

model_storage = ModelStorage()

def parse_boolean_expression(expr: str) -> List[List[int]]:
    """Convert boolean expression to CNF clauses"""
    # Basic implementation for common operators
    if '->' in expr:
        antecedent, consequent = expr.split('->')
        antecedent = antecedent.strip()
        consequent = consequent.strip()
        return [[-1 if '!' in antecedent else 1, 
                1 if '!' in consequent else -1]]
    elif '&' in expr:
        terms = expr.split('&')
        return [[1 if '!' not in term else -1] for term in terms]
    elif '|' in expr:
        terms = expr.split('|')
        return [[-1 if '!' in term else 1 for term in terms]]
    return [[1 if '!' not in expr else -1]]

def validate_configuration(
    selected_features: Set[str],
    model: ParsedModel
) -> ValidationResult:
    validation_errors = []
    
    # Check if any features are selected
    if not selected_features:
        return ValidationResult(
            False,
            "Invalid configuration",
            ["No features selected. Please select at least the mandatory features."]
        )
    
    # Check mandatory features
    for feature, props in model.feature_model.items():
        if props['mandatory']:
            if feature not in selected_features:
                validation_errors.append(
                    f"Mandatory feature '{feature}' must be selected"
                )
        if props['parent'] in selected_features and props['mandatory']:
            if feature not in selected_features:
                validation_errors.append(
                    f"Mandatory feature '{feature}' must be selected when parent '{props['parent']}' is selected"
                )
    
    # Check XOR groups
    for feature, props in model.feature_model.items():
        if props['group_type'] == 'xor' and feature in selected_features:
            selected_children = [child for child in props['children'] 
                               if child in selected_features]
            if len(selected_children) != 1:
                validation_errors.append(
                    f"Exactly one feature must be selected from XOR group under '{feature}'"
                )
    
    # Check OR groups
    for feature, props in model.feature_model.items():
        if props['group_type'] == 'or' and feature in selected_features:
            selected_children = [child for child in props['children'] 
                               if child in selected_features]
            if not selected_children:
                validation_errors.append(
                    f"At least one feature must be selected from OR group under '{feature}'"
                )
    
    # Check cross-tree constraints
    for constraint in model.constraints:
        if not constraint['is_english']:
            # Convert boolean expression to clauses and check satisfaction
            clauses = parse_boolean_expression(constraint['expression'])
            # Add validation logic here based on the clauses
            # This is a simplified check - you might want to implement more robust constraint checking
            if not check_constraint_satisfaction(clauses, selected_features, model.feature_map):
                validation_errors.append(
                    f"Cross-tree constraint violated: {constraint['expression']}"
                )
    
    if validation_errors:
        return ValidationResult(False, "Invalid configuration", validation_errors)
    
    return ValidationResult(True, "Valid configuration", [])

def check_constraint_satisfaction(clauses: List[List[int]], selected_features: Set[str], feature_map: Dict[str, int]) -> bool:
    # Simple constraint satisfaction check
    reverse_map = {v: k for k, v in feature_map.items()}
    
    for clause in clauses:
        clause_satisfied = False
        for literal in clause:
            feature_name = reverse_map[abs(literal)]
            is_selected = feature_name in selected_features
            if (literal > 0 and is_selected) or (literal < 0 and not is_selected):
                clause_satisfied = True
                break
        if not clause_satisfied:
            return False
    return True

def parse_feature_xml(xml_content: str) -> ParsedModel:
    parsed_model = ParsedModel()
    root = ET.fromstring(xml_content)
    
    def parse_feature(element, parent_name=None):
        name = element.attrib['name']
        mandatory = element.attrib.get('mandatory', 'false').lower() == 'true'
        
        parsed_model.feature_model[name] = {
            'mandatory': mandatory,
            'parent': parent_name,
            'children': [],
            'group_type': None
        }
        
        if parent_name:
            parsed_model.feature_model[parent_name]['children'].append(name)
        
        # Handle groups
        for group in element.findall('group'):
            group_type = group.attrib.get('type', '')
            parsed_model.feature_model[name]['group_type'] = group_type
            for child in group.findall('feature'):
                parse_feature(child, name)
        
        # Handle direct feature children
        for child in element.findall('feature'):
            if child not in element.findall('group/feature'):
                parse_feature(child, name)
    
    # Parse constraints
    for constraint in root.findall('.//constraint'):
        bool_expr = constraint.find('booleanExpression')
        eng_stmt = constraint.find('englishStatement')
        
        if bool_expr is not None:
            parsed_model.constraints.append({
                'expression': bool_expr.text,
                'is_english': False
            })
        elif eng_stmt is not None:
            parsed_model.constraints.append({
                'expression': eng_stmt.text,
                'is_english': True
            })
    
    # Start parsing from root
    root_feature = root.find('feature')
    parse_feature(root_feature)
    
    # Generate clauses and feature mapping
    parsed_model.clauses, parsed_model.feature_map, parsed_model.reverse_map,parsed_model.english_statements = \
        translate_to_logic(parsed_model.feature_model)
    
    return parsed_model

def get_available_features(parsed_model: ParsedModel) -> List[str]:
    return list(parsed_model.feature_model.keys())

def translate_to_logic(
    feature_model: Dict
) -> Tuple[List[List[int]], Dict[str, int], Dict[int, str]]:
    clauses = []
    feature_map = {name: idx + 1 for idx, name in enumerate(feature_model.keys())}
    reverse_map = {idx: name for name, idx in feature_map.items()}
    english_statements = []
    
    # Root is always true
    root_name = next(iter(feature_model.keys()))
    clauses.append([feature_map[root_name]])
    english_statements.append(root_name)
    
    for feature_name, feature in feature_model.items():
        feature_id = feature_map[feature_name]
        
        if feature['parent']:
            parent_id = feature_map[feature['parent']]

            
            # Mandatory features
            if feature['mandatory']:
                clauses.append([-parent_id, feature_id])  # parent → child
                clauses.append([-feature_id, parent_id])  # child → parent
                english_statements.append(f"{feature['parent']} → {feature_name}")
                english_statements.append(f"{feature_name} → {feature['parent']}")
            # Optional features
            else:
                clauses.append([-feature_id, parent_id])  # child → parent
                english_statements.append(f"{feature_name} → {feature['parent']}")
            
            # XOR groups
            if feature['group_type'] == 'xor' and feature['children']:
                children_ids = [feature_map[child] for child in feature['children']]
                
                # At least one
                clauses.append(children_ids)
                children_names = [f"{child}" for child in feature['children']]
                english_statements.append(f"{feature_name} → ({' ∨ '.join(children_names)})")
                
                # At most one
                statment = f"{feature_name} → ( "
                
                #now loop over children and do like this(child1 and not child2) or (not child1 and child2)
                for i in range(len(children_names)):
                    not_statment = f""
                    for j in range(len(children_names)):
                        if i != j:
                            if j == len(children_names) - 1 or (j == len(children_names) - 2 and j+1==i):
                                not_statment += f"¬{children_names[j]}"
                            else:
                                not_statment += f"¬{children_names[j]} ^ "
                    if i == len(children_names) - 1:
                        statment += f"({children_names[i]} ^ {not_statment})"
                    else:
                        statment += f"({children_names[i]} ^ {not_statment}) v "
                english_statements.append(statment)            

                for i in range(len(children_ids)):
                    for j in range(i + 1, len(children_ids)):
                        clauses.append([-children_ids[i], -children_ids[j]])
                    
            # OR groups
            elif feature['group_type'] == 'v' and feature['children']:
                children_ids = [feature_map[child] for child in feature['children']]
                clauses.append(children_ids)  # At least one
                
    
    return clauses, feature_map, reverse_map,english_statements

def find_mwp(working_products: List[List[str]]) -> List[List[str]]:
    if not working_products:
        return []
        
    # Find minimum length
    min_length = min(len(product) for product in working_products)
    
    # Return all products with minimum length
    return [product for product in working_products if len(product) == min_length]


def find_wp(parsed_model: ParsedModel) -> List[List[str]]:
    working_products = []
    
    def get_mandatory_features() -> Set[str]:
        mandatory = set()
        for feature, props in parsed_model.feature_model.items():
            if props.get('mandatory', False):
                mandatory.add(feature)
                # Add all mandatory parents
                current = feature
                while current in parsed_model.feature_model:
                    parent = next((f for f, p in parsed_model.feature_model.items() 
                                 if current in p.get('children', [])), None)
                    if parent:
                        mandatory.add(parent)
                        current = parent
                    else:
                        break
        return mandatory

    def get_optional_features(mandatory: Set[str]) -> List[str]:
        return [f for f in parsed_model.feature_model.keys() 
                if f not in mandatory]

    def handle_group_constraints(feature_set: Set[str]) -> bool:
        for feature, props in parsed_model.feature_model.items():
            if feature not in feature_set:
                continue
            children = props.get('children', [])
            if not children:
                continue
            
            selected_children = [c for c in children if c in feature_set]
            
            if props.get('relation') == 'XOR' and len(selected_children) > 1:
                return False
            if props.get('relation') == 'OR' and selected_children and not any(c in feature_set for c in children):
                return False
        return True

    # Start with mandatory features
    mandatory_features = get_mandatory_features()
    optional_features = get_optional_features(mandatory_features)
    base_config = list(mandatory_features)

    # Validate base configuration
    if validate_configuration(set(base_config), parsed_model).valid:
        working_products.append(base_config)

    # Try adding optional features incrementally
    for r in range(1, len(optional_features) + 1):
        for opt_combo in combinations(optional_features, r):
            candidate = base_config + list(opt_combo)
            if handle_group_constraints(set(candidate)):
                if validate_configuration(set(candidate), parsed_model).valid:
                    working_products.append(candidate)

    return working_products    
    
@app.get("/mwp")
async def get_mwp():
    try:
        session_id = "default_session"  # In production, get this from request
        parsed_model = model_storage.get_model(session_id)
        
        if not parsed_model:
            raise HTTPException(
                status_code=400, 
                detail="No feature model uploaded. Please upload a model first."
            )
        
        wp = find_wp(parsed_model)
        mwp = find_mwp(wp)
        
        return {
            "working_products": wp,
            "mwp": mwp
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.get("/wp")
async def get_wp():
    try:
        session_id = "default_session"  # In production, get this from request
        parsed_model = model_storage.get_model(session_id)
        
        if not parsed_model:
            raise HTTPException(
                status_code=400, 
                detail="No feature model uploaded. Please upload a model first."
            )
        
        wp = find_wp(parsed_model)
        mwp = find_mwp(wp)
        
        return {
            "working_products": wp,
            "mwp": mwp
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        parsed_model = parse_feature_xml(content.decode())
        wp = find_wp(parsed_model)
        mwp = find_mwp(wp)
        # print("MWP: ", mwp)
        
        # Store the model with a session ID
        session_id = "default_session"  # In production, generate unique session IDs
        model_storage.store_model(session_id, parsed_model)
        
        return {
            "feature_model": parsed_model.feature_model,
            "constraints": parsed_model.constraints,
            "mwp": mwp
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/avaliable_variables")
async def get_avaliable_variables():
    try:
        session_id = "default_session"  # In production, get this from request
        parsed_model = model_storage.get_model(session_id)
        
        if not parsed_model:
            raise HTTPException(
                status_code=400, 
                detail="No feature model uploaded. Please upload a model first."
            )
        
        return get_available_features(parsed_model)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
def propositional_logic_to_english(clauses: List[List[int]], reverse_map: Dict[int, str]) -> List[str]:
    def literal_to_english(literal: int) -> str:
        feature_name = reverse_map[abs(literal)]
        if literal > 0:
            return feature_name
        else:
            return f"not {feature_name}"
    
    english_statements = []
    for clause in clauses:
        if len(clause) == 1:
            # Single literal clause
            english_statements.append(literal_to_english(clause[0]))
        else:
            # Multiple literals in a clause
            literals = [literal_to_english(lit) for lit in clause]
            english_statements.append(" or ".join(literals))
    
    return english_statements

def to_propositional_logic(model:ParsedModel) -> List[str]:
        """Convert the feature model to propositional logic formulas."""
        formulas = []
        
        # Add root formula
        root = next(f for f in model.features.values() if f.parent is None)
        formulas.append(root.name)  # Root must be selected
        
        for feature in model.features.values():
            if feature.parent:
                # Mandatory features
                if feature.mandatory:
                    formulas.append(f"({feature.parent} → {feature.name})")
                    formulas.append(f"({feature.name} → {feature.parent})")
                else:  # Optional features
                    formulas.append(f"({feature.name} → {feature.parent})")
                
            # Handle groups
            if feature.group_features:
                group_names = [f.name for f in feature.group_features]
                
                if feature.group_type == 'xor':
                    # At least one must be selected
                    formulas.append(f"({feature.name} → ({' ∨ '.join(group_names)}))")
                    # Only one can be selected
                    for i, name1 in enumerate(group_names):
                        for name2 in group_names[i+1:]:
                            formulas.append(f"(¬{name1} ∨ ¬{name2})")
                            
                elif feature.group_type == 'or':
                    # At least one must be selected if parent is selected
                    formulas.append(f"({feature.name} → ({' ∨ '.join(group_names)}))")
        
        return formulas

@app.get("/propositional_logic")
async def get_propositional_logic():
    try:
        session_id = "default_session"  # In production, get this from request
        parsed_model = model_storage.get_model(session_id)
        
        if not parsed_model:
            raise HTTPException(
                status_code=400, 
                detail="No feature model uploaded. Please upload a model first."
            )
        
        english_statements = parsed_model.english_statements
        return {"propositional_logic": english_statements}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
@app.post("/verify")
async def verify_configuration(selection: FeatureSelection):
    try:
        session_id = "default_session"  # In production, get this from request
        parsed_model = model_storage.get_model(session_id)
        
        if not parsed_model:
            raise HTTPException(
                status_code=400, 
                detail="No feature model uploaded. Please upload a model first."
            )
        
        selected_features = set(selection.selected_features)
        result = validate_configuration(selected_features, parsed_model)
        
        return {
            "valid": result.valid,
            "message": result.message,
            "details": result.details
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)