import { AnimatePresence, motion } from "framer-motion";
import { FileUp, GitBranch, Workflow, AlertTriangle } from "lucide-react";
import ConfigurationStatus from "./ConfigurationStatus";
import FeatureModelFlow from "./FeatureModelFlow";
import FeatureTree from "./FeatureTree";
import PropositionalLogicView from "./PropositionalLogicView";
import Sidebar from "./Sidebar";
import StatsOverview from "./StatOverview";

const Dashboard = ({
  selectedTab,
  setSelectedTab,
  handleFileUpload,
  featureModel,
  mwp,
  wp,
  selectedFeatures,
  setShowDashboard,
  handleFeatureSelect,
  isFeatureDisabled,
  isValid,
  validationDetails,
  uploadedFileName, 
  setUploadedFileName
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
          <div className='flex items-center gap-3'>
            <p>  <span className="font-semibold">Current File:</span>
               {" "+ uploadedFileName}</p>
            <motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {window.location.reload()}}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-all"
            >
              <FileUp className="w-4 h-4" />
              <span>Upload New</span>
            </motion.label>
          </div>
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
              <StatsOverview featureModel={featureModel} mwp={mwp} wp={wp} />}
            {selectedTab === "logic" && 
              <PropositionalLogicView featureModel={featureModel} />}
            {selectedTab === "tree" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <GitBranch className="w-6 h-6 text-blue-600" />
                  Feature Tree
                </h2>
                {featureModel && (
                 <>
                 {
                  mwp.length < 1 && (
                    <div className="mb-4 p-4 bg-red-50 border flex items-start flex-col gap-3 max-w-max border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 ">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h4 className="font-medium text-red-800">Important Note</h4>
                        </div>
                        <div>
                          <p className="text-red-600">This feature model appears to be invalid, so this configuration maker will not work as expected.</p>
                        </div>
                    
                    </div>
                  )
                 }
                   <FeatureTree 
                     featureName={Object.keys(featureModel)[0]}
                     featureModel={featureModel}
                     selectedFeatures={selectedFeatures}
                     handleFeatureSelect={handleFeatureSelect}
                     isFeatureDisabled={isFeatureDisabled}
                   />
                   <ConfigurationStatus isValid={ mwp.length < 1? false: isValid} validationDetails={validationDetails} />
                 </>
                )}
              </div>
            )}
            
            {selectedTab === "visual" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Workflow className="w-6 h-6 text-blue-600" />
                  Visual Model
                </h2>
                {featureModel && (
                  <FeatureModelFlow featureModel={featureModel} />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </div>
);

export default Dashboard;
