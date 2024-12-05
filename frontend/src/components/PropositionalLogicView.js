// // // components/PropositionalLogicView.jsx
// // import { motion } from "framer-motion";
// // import { ArrowRight, Binary, Calculator, Check, GitFork } from "lucide-react";
// // import { useEffect } from "react";

// // const PropositionalLogicView = ({ PropositionalFormulas }) => {
// //   const getLogicFormula = (feature, props) => {
// //     const formulas = [];
// //     if (!props.parent) formulas.push(`Root: ${feature}`);

// //     props.children.forEach((child) => {
// //       if (featureModel[child].mandatory) {
// //         formulas.push(`${feature} → ${child}`);
// //       } else {
// //         formulas.push(`${feature} ↔ (${child} ∨ ¬${child})`);
// //       }
// //     });

// //     if (props.group_type === "xor" && props.children.length > 0) {
// //       formulas.push(
// //         `(${props.children
// //           .map(
// //             (child) =>
// //               `(${child} ∧ ¬${props.children
// //                 .filter((c) => c !== child)
// //                 .join(" ∧ ¬")})`
// //           )
// //           .join(" ∨ ")})`
// //       );
// //     }

// //     if (props.group_type === "or" && props.children.length > 0) {
// //       formulas.push(`(${props.children.join(" ∨ ")})`);
// //     }

// //     return formulas;
// //   };
  

// //   const groupedFormulas = {
// //     root: [],
// //     mandatory: [],
// //     optional: [],
// //     xor: [],
// //     or: [],
// //   };

// //   Object.entries(featureModel).forEach(([feature, props]) => {
// //     const formulas = getLogicFormula(feature, props);
// //     formulas.forEach((formula) => {
// //       if (formula.startsWith("Root:")) groupedFormulas.root.push(formula);
// //       else if (formula.includes("→")) groupedFormulas.mandatory.push(formula);
// //       else if (formula.includes("↔")) groupedFormulas.optional.push(formula);
// //       else if (formula.includes("XOR")) groupedFormulas.xor.push(formula);
// //       else if (formula.includes("OR")) groupedFormulas.or.push(formula);
// //     });
// //   });

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       className="bg-white rounded-xl shadow-lg p-6 space-y-6"
// //     >
// //       {Object.entries(groupedFormulas).map(
// //         ([group, formulas]) =>
// //           formulas.length > 0 && (
// //             <div key={group} className="space-y-2">
// //               <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
// //                 {group === "root" && (
// //                   <GitFork className="w-5 h-5 text-blue-600" />
// //                 )}
// //                 {group === "mandatory" && (
// //                   <Check className="w-5 h-5 text-green-600" />
// //                 )}
// //                 {group === "optional" && (
// //                   <ArrowRight className="w-5 h-5 text-yellow-600" />
// //                 )}
// //                 {group === "xor" && (
// //                   <Binary className="w-5 h-5 text-purple-600" />
// //                 )}
// //                 {group === "or" && (
// //                   <Calculator className="w-5 h-5 text-red-600" />
// //                 )}
// //                 {group.charAt(0).toUpperCase() + group.slice(1)} Relations
// //               </h3>
// //               <div className="space-y-1 ml-7">
// //                 {formulas.map((formula, idx) => (
// //                   <motion.div
// //                     key={idx}
// //                     initial={{ opacity: 0, x: -20 }}
// //                     animate={{ opacity: 1, x: 0 }}
// //                     transition={{ delay: idx * 0.1 }}
// //                     className="bg-gray-50 p-2 rounded"
// //                   >
// //                     <code className="text-sm">{formula}</code>
// //                   </motion.div>
// //                 ))}
// //               </div>
// //             </div>
// //           )
// //       )}
// //     </motion.div>
// //   );
// // };

// // export default PropositionalLogicView;
// // components/PropositionalLogicView.jsx
// import { motion } from "framer-motion";
// import { ArrowRight, Binary, Calculator, Check, GitFork } from "lucide-react";
// import { useEffect, useState } from "react";

// const PropositionalLogicView = () => {
//   const [propositionalFormulas, setPropositionalFormulas] = useState([]);

//   useEffect(() => {
//     const fetchPropositionalFormulas = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/propositional_logic");
//         const data = await response.json();
//         setPropositionalFormulas(data.propositional_logic);
//       } catch (error) {
//         console.error("Error fetching propositional formulas:", error);
//       }
//     };

//     fetchPropositionalFormulas();
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-xl shadow-lg p-6 space-y-6"
//     >
//       {propositionalFormulas.length > 0 ? (
//         propositionalFormulas.map((formula, idx) => (
//           <motion.div
//             key={idx}
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: idx * 0.1 }}
//             className="bg-gray-50 p-2 rounded"
//           >
//             <code className="text-sm">{formula[0]}</code>
//           </motion.div>
//         ))
//       ) : (
//         <p>Loading propositional formulas...</p>
//       )}
//     </motion.div>
//   );
// };

// export default PropositionalLogicView;

import { motion } from "framer-motion";
import { ArrowRight, Binary, Calculator, Check, GitFork } from "lucide-react";
import { useState, useEffect } from "react";

const PropositionalLogicView = () => {
  const [propositionalFormulas, setPropositionalFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        const response = await fetch("http://localhost:8000/propositional_logic");
        const data = await response.json();
        setPropositionalFormulas(data.propositional_logic);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFormulas();
  }, []);

  // Group formulas by constraint type
  const groupedFormulas = propositionalFormulas.reduce((acc, [formula, type]) => {
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(formula);
    return acc;
  }, {});

  // Icon mapping
  const getIcon = (type) => {
    const icons = {
      "(Root)": <GitFork className="w-5 h-5 text-blue-600" />,
      "(Parent To Child Mandatory)": <Check className="w-5 h-5 text-green-600" />,
      "(Child to Parent constraint)": <ArrowRight className="w-5 h-5 text-yellow-600" />,
      "(Atmost One Xor constraint)": <Binary className="w-5 h-5 text-purple-600" />,
      "(Atleast One constraint in OR)": <Calculator className="w-5 h-5 text-red-600" />
    };
    return icons[type] || <ArrowRight className="w-5 h-5 text-gray-600" />;
  };

  if (loading) return <p>Loading propositional formulas...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 space-y-6"
    >
      {Object.entries(groupedFormulas).length > 0 ? (
        Object.entries(groupedFormulas).map(([type, formulas], groupIdx) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIdx * 0.2 }}
            className="space-y-2"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {getIcon(type)}
              {type.replace(/[()]/g, '')}
            </h3>
            <div className="gap-3 grid grid-cols-3 ml-7">
              {formulas.map((formula, idx) => (
                <motion.div
                  key={`${type}-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-50 p-2 rounded-xl "
                >
                  <code className="text-sm">{formula}</code>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))
      ) : (
        <p>No formulas found</p>
      )}
    </motion.div>
  );
};

export default PropositionalLogicView;