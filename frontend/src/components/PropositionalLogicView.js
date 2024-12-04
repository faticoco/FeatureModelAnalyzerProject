// components/PropositionalLogicView.jsx
import { motion } from "framer-motion";
import { ArrowRight, Binary, Calculator, Check, GitFork } from "lucide-react";

const PropositionalLogicView = ({ featureModel }) => {
  const getLogicFormula = (feature, props) => {
    const formulas = [];
    if (!props.parent) formulas.push(`Root: ${feature}`);

    props.children.forEach((child) => {
      if (featureModel[child].mandatory) {
        formulas.push(`${feature} → ${child}`);
      } else {
        formulas.push(`${feature} ↔ (${child} ∨ ¬${child})`);
      }
    });

    if (props.group_type === "xor" && props.children.length > 0) {
      formulas.push(
        `(${props.children
          .map(
            (child) =>
              `(${child} ∧ ¬${props.children
                .filter((c) => c !== child)
                .join(" ∧ ¬")})`
          )
          .join(" ∨ ")})`
      );
    }

    if (props.group_type === "or" && props.children.length > 0) {
      formulas.push(`(${props.children.join(" ∨ ")})`);
    }

    return formulas;
  };

  const groupedFormulas = {
    root: [],
    mandatory: [],
    optional: [],
    xor: [],
    or: [],
  };

  Object.entries(featureModel).forEach(([feature, props]) => {
    const formulas = getLogicFormula(feature, props);
    formulas.forEach((formula) => {
      if (formula.startsWith("Root:")) groupedFormulas.root.push(formula);
      else if (formula.includes("→")) groupedFormulas.mandatory.push(formula);
      else if (formula.includes("↔")) groupedFormulas.optional.push(formula);
      else if (formula.includes("XOR")) groupedFormulas.xor.push(formula);
      else if (formula.includes("OR")) groupedFormulas.or.push(formula);
    });
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 space-y-6"
    >
      {Object.entries(groupedFormulas).map(
        ([group, formulas]) =>
          formulas.length > 0 && (
            <div key={group} className="space-y-2">
              <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
                {group === "root" && (
                  <GitFork className="w-5 h-5 text-blue-600" />
                )}
                {group === "mandatory" && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
                {group === "optional" && (
                  <ArrowRight className="w-5 h-5 text-yellow-600" />
                )}
                {group === "xor" && (
                  <Binary className="w-5 h-5 text-purple-600" />
                )}
                {group === "or" && (
                  <Calculator className="w-5 h-5 text-red-600" />
                )}
                {group.charAt(0).toUpperCase() + group.slice(1)} Relations
              </h3>
              <div className="space-y-1 ml-7">
                {formulas.map((formula, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gray-50 p-2 rounded"
                  >
                    <code className="text-sm">{formula}</code>
                  </motion.div>
                ))}
              </div>
            </div>
          )
      )}
    </motion.div>
  );
};

export default PropositionalLogicView;
