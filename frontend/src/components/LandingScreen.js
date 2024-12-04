// components/LandingScreen.jsx
import { motion } from "framer-motion";
import { ArrowRight, Binary, Upload } from "lucide-react";
import icon from "../assets/icon.png";
const LandingScreen = ({
  handleFileUpload,
  featureModel,
  setShowDashboard,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4"
  >
    {/* Main Content Container */}
    <div className="max-w-4xl w-full mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-6">
          <motion.img
            src={icon}
            alt="Feature Model Icon"
            className="w-32 h-32"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          />
        </div>
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-6">
          Feature Model Analyzer
        </h1>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
          Upload your feature model and analyze it with our powerful
          visualization tools
        </p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        <label className="relative block">
          <motion.div
            whileHover={{ scale: 1.02, borderColor: "#4F46E5" }}
            className="group border-4 border-dashed border-blue-300 rounded-xl p-8 bg-white/50 backdrop-blur-sm transition-all cursor-pointer hover:border-indigo-600 hover:bg-white/80"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-indigo-100"
              >
                <Upload className="w-8 h-8 text-blue-600 group-hover:text-indigo-600" />
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Drop your XML file here
                </h3>
                <p className="text-gray-500 mb-4">
                  or click to browse from your computer
                </p>
                <span className="text-sm text-gray-400">
                  Supports Feature Model XML files
                </span>
              </div>
            </div>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".xml"
            />
          </motion.div>
        </label>
      </motion.div>

      {/* Extract Button */}
      {featureModel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDashboard(true)}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center gap-3 mx-auto font-medium shadow-lg hover:shadow-xl"
          >
            <Binary className="w-5 h-5" />
            Extract Feature Model
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      )}

      {/* Footer Info */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-gray-500 mt-12 text-sm"
      >
        Analyze, visualize, and validate your feature models with ease
      </motion.p>
    </div>
  </motion.div>
);

export default LandingScreen;
