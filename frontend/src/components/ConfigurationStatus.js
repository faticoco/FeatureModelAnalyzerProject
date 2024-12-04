// components/ConfigurationStatus.jsx
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Settings, XCircle } from "lucide-react";

const ConfigurationStatus = ({ isValid, validationDetails }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Settings className="w-6 h-6 text-blue-600" />
      Configuration Status
    </h2>

    {/* Status Indicator */}
    <div className="mb-6">
      {isValid ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 bg-green-50 text-green-700 px-4 py-3 rounded-lg border border-green-200"
        >
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">Valid Configuration</span>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-200"
        >
          <XCircle className="w-6 h-6" />
          <span className="font-medium">Invalid Configuration</span>
        </motion.div>
      )}
    </div>

    {/* Validation Details */}
    <AnimatePresence>
      {!isValid && validationDetails && validationDetails.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Configuration Issues:
          </h3>
          {validationDetails.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2 bg-red-50 p-3 rounded-lg border border-red-200"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-700 text-sm">{detail}</p>
                {detail.includes("XOR") && (
                  <p className="text-red-600 text-xs mt-1 italic">
                    XOR groups require exactly one feature to be selected
                  </p>
                )}
                {detail.includes("Mandatory") && (
                  <p className="text-red-600 text-xs mt-1 italic">
                    Mandatory features must be selected when their parent is
                    selected
                  </p>
                )}
                {detail.includes("OR") && (
                  <p className="text-red-600 text-xs mt-1 italic">
                    OR groups require at least one feature to be selected
                  </p>
                )}
              </div>
            </motion.div>
          ))}

          {/* Additional Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200"
          >
            <h4 className="text-sm font-semibold text-blue-700 mb-2">
              Configuration Rules:
            </h4>
            <ul className="text-sm text-blue-600 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>XOR groups: Select exactly one feature</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>OR groups: Select at least one feature</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Mandatory features: Must be selected with parent</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default ConfigurationStatus;
