// components/Dashboard.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, GitBranch, Workflow } from "lucide-react";
import Sidebar from "./Sidebar";
import StatsOverview from "./StatOverview";
import PropositionalLogicView from "./PropositionalLogicView";
import FeatureTree from "./FeatureTree";
import ConfigurationStatus from "./ConfigurationStatus";
import FeatureModelFlow from "./FeatureModelFlow";

const Dashboard = ({ 
  selectedTab, 
  setSelectedTab, 
  handleFileUpload, 
  featureModel,
  mwp,
  selectedFeatures,
  handleFeatureSelect,
  isFeatureDisabled,
  isValid,
  validationDetails 
}) => (
  <div className="min-h-screen bg-gray-50">
    <div className="flex">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      
      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
          </h1>
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-all"
          >
            <FileUp className="w-4 h-4" />
            <span>Upload New</span>
            <input type="file" onChange={handleFileUpload} className="hidden" accept=".xml" />
          </motion.label>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {selectedTab === "overview" && 
              <StatsOverview featureModel={featureModel} mwp={mwp} />}
            {selectedTab === "logic" && 
              <PropositionalLogicView featureModel={featureModel} />}
            {selectedTab === "tree" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <GitBranch className="w-6 h-6 text-blue-600" />
                  Feature Tree
                </h2>
                {featureModel && (
                  <FeatureTree 
                    featureName={Object.keys(featureModel)[0]}
                    featureModel={featureModel}
                    selectedFeatures={selectedFeatures}
                    handleFeatureSelect={handleFeatureSelect}
                    isFeatureDisabled={isFeatureDisabled}
                  />
                )}
              </div>
            )}
            {selectedTab === "config" && 
              <ConfigurationStatus isValid={isValid} validationDetails={validationDetails} />}
            {selectedTab === "visual" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Workflow className="w-6 h-6 text-blue-600" />
                  Visual Model
                </h2>
                {featureModel && <FeatureModelFlow featureModel={featureModel} />}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </div>
);

export default Dashboard;