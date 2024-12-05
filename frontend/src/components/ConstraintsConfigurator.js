// components/ConstraintsConfigurator.js
import React, { useEffect, useState } from 'react';
import { Edit2, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const EditConstraintPopup = ({ constraint, onClose, availableVariables }) => {
  const [editedText, setEditedText] = useState("");
  
  const appendToText = (value) => {
    setEditedText(prev => prev + ' ' + value);
  };

  const logicalOperators = ['∧', '∨', '¬', '(', ')', '→'];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-6 z-50 max-w-2xl w-full mx-4"
      >
          <h2 className="text-xl font-semibold mb-6 text-start">Edit Constraint</h2>

          <h3 className="text-sm font-medium text-gray-700 mb-2 text-start">Your constraint</h3>
       <p className="text-gray-600 text-start mb-3">
       {constraint.expression}
       </p>

      
        
        {/* Variables Section */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2 text-start">Available Variables</h3>
          <div className="flex flex-wrap gap-2">
            {availableVariables?.map((variable) => (
              <button
                key={variable}
                onClick={() => appendToText(variable)}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
              >
                {variable}
              </button>
            ))}
          </div>
        </div>

        {/* Logical Operators Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2 text-start">Logical Operators</h3>
          <div className="flex flex-wrap gap-2">
            {logicalOperators.map((op) => (
              <button
                key={op}
                onClick={() => appendToText(op)}
                className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded hover:bg-purple-100"
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        {/* Text Field */}
        <div className="relative">
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full p-3 border rounded-lg pr-24"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90">
            <Sparkles className="w-4 h-4" />
            Generate
          </button>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ConstraintsConfigurator = ({ constraints, availableVariables }) => {
  const [editableConstraints, setEditableConstraints] = useState(constraints || []);
  const [editingConstraint, setEditingConstraint] = useState(null);
  
  const englishConstraints = editableConstraints.filter(c => c.is_english);
  const logicalConstraints = editableConstraints.filter(c => !c.is_english);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Constraints</h2>
      
      {/* Logical Constraints Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-start text-gray-700 mb-3">Logical Expressions</h3>
        <div className="space-y-3">
          {logicalConstraints.length > 0 ? (
            logicalConstraints.map((constraint, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2 font-mono text-sm text-gray-600">
                  {constraint.expression.split('->').map((part, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <ArrowRight className="w-4 h-4 text-blue-500" />}
                      <span className="bg-gray-200 px-2 py-1 rounded">{part.trim()}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic text-start">No logical constraints found.</p>
          )}
        </div>
      </div>

      {/* English Constraints Section */}
      <div>
        <h3 className="text-sm font-semibold text-start text-gray-700 mb-3">Natural Language Constraints</h3>
        <div className="space-y-3">
          {englishConstraints.length > 0 ? (
            englishConstraints.map((constraint, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
                <span className="text-gray-700">{constraint.expression}</span>
                <button
                  className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                  onClick={() => setEditingConstraint(constraint)}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No natural language constraints found.</p>
          )}
        </div>
      </div>

      {/* Edit Popup */}
      {editingConstraint && (
        <EditConstraintPopup
          constraint={editingConstraint}
          onClose={() => setEditingConstraint(null)}
          availableVariables={availableVariables}
        />
      )}
    </div>
  );
};

export default ConstraintsConfigurator;