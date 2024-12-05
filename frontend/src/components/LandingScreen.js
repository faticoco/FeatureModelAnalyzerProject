// components/LandingScreen.jsx
import { motion } from "framer-motion";
import { ArrowRight, Binary, Upload, CheckCircle, File } from "lucide-react";
import icon from "../assets/icon.png";

const LandingScreen = ({
  handleFileUpload,
  featureModel,
  setShowDashboard,
  uploadedFileName
}) => {

  const getFileName = () => {
    if (!featureModel) return null;
    const input = document.querySelector('input[type="file"]');
    return input?.files?.[0]?.name;
  };

  const fileName = getFileName();

  return (
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
        {!uploadedFileName ? (
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <label className="relative block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`
              group border-4 border-dashed rounded-xl p-8 bg-white/50 backdrop-blur-sm transition-all cursor-pointer
              ${featureModel
                  ? 'border-green-300 hover:border-green-400'
                  : 'border-blue-300 hover:border-indigo-600'}
            `}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                {!featureModel ? (
                  <>
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
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        File Uploaded Successfully
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <File className="w-4 h-4" />
                        <span className="font-medium">{fileName}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".xml"
              />
            </motion.div>
          </label>
        </motion.div>) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                File Uploaded Successfully
              </h3>
              <div className="flex items-center justify-center gap-2 text-green-600">
                <File className="w-4 h-4" />
                <span className="font-medium">{uploadedFileName}</span>
              </div>
            </div>
          </motion.div>
        )}

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
  )
}

export default LandingScreen;
