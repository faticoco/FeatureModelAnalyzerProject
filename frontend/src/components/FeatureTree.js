// components/FeatureTree.jsx
import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";

const FeatureTree = ({ 
  featureName, 
  featureModel, 
  selectedFeatures, 
  handleFeatureSelect, 
  isFeatureDisabled,
  level = 0  // Add level prop to track indentation
}) => {
  const feature = featureModel[featureName];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <div className="flex items-center py-2">
        {/* Indentation and vertical lines */}
        <div className="flex" style={{ marginLeft: `${level * 24}px` }}>
          {level > 0 && (
            <div className="absolute left-0 top-0 bottom-0 border-l-2 border-gray-200" 
                 style={{ left: `${(level * 24) - 12}px` }} />
          )}
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedFeatures.has(featureName)}
              onChange={() => handleFeatureSelect(featureName)}
              disabled={isFeatureDisabled(featureName)}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
            
            {/* Feature name */}
            <span className={`
              ${feature.mandatory ? "font-medium" : "text-gray-600"}
              ${isFeatureDisabled(featureName) ? "text-gray-400" : ""}
              min-w-[120px]
            `}>
              {featureName}
            </span>

            {/* Feature tags */}
            <div className="flex gap-2">
              {feature.mandatory && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  Mandatory
                </span>
              )}
              {feature.group_type && (
                <span className={`
                  text-xs px-2 py-0.5 rounded flex items-center gap-1
                  ${feature.group_type === 'xor' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-indigo-100 text-indigo-700'
                  }
                `}>
                  <GitBranch className="w-3 h-3" />
                  {feature.group_type.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Children */}
      {feature.children && feature.children.length > 0 && (
        <div>
          {feature.children.map((childName) => (
            <FeatureTree
              key={childName}
              featureName={childName}
              featureModel={featureModel}
              selectedFeatures={selectedFeatures}
              handleFeatureSelect={handleFeatureSelect}
              isFeatureDisabled={isFeatureDisabled}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FeatureTree;