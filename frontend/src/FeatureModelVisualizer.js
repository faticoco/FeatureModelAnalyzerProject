// FeatureModelVisualizer.jsx
import { useState } from "react";
import { AlertTriangle, CheckCircle, Upload, XCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import LandingScreen from "./components/LandingScreen";
import Dashboard from "./components/Dashboard";
import { useErrorPopup } from './utils/errorUtil';

const FeatureModelVisualizer = () => {
  const { showErrorPopup, ErrorPopupComponent } = useErrorPopup();

  // State Management
  const [featureModel, setFeatureModel] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState(new Set());
  const [mwp, setMwp] = useState([]);
  const [wp, setWp] = useState([]);
  const [error, setError] = useState(null);
  const [validationDetails, setValidationDetails] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // File Upload Handler
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      showErrorPopup('An unexpected error occurred.');
      return;
    }
  
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Upload failed");
  
      const data = await response.json();
      setFeatureModel(data.feature_model);
      setMwp(data.mwp);
      setWp(data.wp);
      console.log(data.wp);
      // Initialize selectedFeatures with MWP instead of empty set
      setSelectedFeatures(new Set(data.mwp));
      setError(null);
      setValidationDetails([]);
      setIsValid(true);
      setShowDashboard(false);
  
      // Verify the initial MWP configuration
      await verifyConfiguration(new Set(data.mwp));
    } catch (err) {
      setError("Error uploading file: " + err.message);
      showErrorPopup('An unexpected error occurred.');
      setFeatureModel(null);
      setMwp(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Configuration Verification
  const verifyConfiguration = async (features) => {
    try {
      const response = await fetch("http://localhost:8000/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected_features: Array.from(features) }),
      });

      const data = await response.json();
      setIsValid(data.valid);
      setValidationDetails(data.details || []);
      setError(data.valid ? null : data.message);
    } catch (err) {
      setError("Error verifying configuration");
      setIsValid(false);
    }
  };

  // Feature Selection Handler
  const handleFeatureSelect = async (featureName) => {
    const newSelected = new Set(selectedFeatures);

    if (newSelected.has(featureName)) {
      newSelected.delete(featureName);
      if (featureModel[featureName]?.children) {
        featureModel[featureName].children.forEach((child) => {
          newSelected.delete(child);
        });
      }
    } else {
      newSelected.add(featureName);
      const parent = featureModel[featureName]?.parent;
      if (parent && featureModel[parent]?.group_type === "xor") {
        featureModel[parent].children.forEach((sibling) => {
          if (sibling !== featureName) newSelected.delete(sibling);
        });
      }
      if (parent && featureModel[parent]?.mandatory) {
        newSelected.add(parent);
      }
    }

    setSelectedFeatures(newSelected);
    await verifyConfiguration(newSelected);
  };

  // Feature Disabled Check
  const isFeatureDisabled = (featureName) => {
    const feature = featureModel[featureName];
    if (!feature) return false;

    const parent = feature.parent;
    if (parent) {
      if (!selectedFeatures.has(parent)) return true;
      if (featureModel[parent]?.group_type === "xor") {
        return featureModel[parent].children.some(
          (sibling) => sibling !== featureName && selectedFeatures.has(sibling)
        );
      }
    }
    return false;
  };

  // Error Display Component
  const ErrorDisplay = ({error}) => {
    if (!error) return null;
    
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <div>
            <h4 className="font-medium text-red-800">Error</h4>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  };

  // Loading Overlay
  const LoadingOverlay = () => {
    if (!isLoading) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Processing...</p>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <>
          {ErrorPopupComponent}

      <LoadingOverlay />
      <AnimatePresence mode="wait">
        {!showDashboard ? (
          <LandingScreen
            handleFileUpload={handleFileUpload}
            featureModel={featureModel}
            setShowDashboard={setShowDashboard}
          />
        ) : (
          <Dashboard
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            handleFileUpload={handleFileUpload}
            featureModel={featureModel}
            mwp={mwp}
            wp={wp}
            selectedFeatures={selectedFeatures}
            handleFeatureSelect={handleFeatureSelect}
            isFeatureDisabled={isFeatureDisabled}
            isValid={isValid}
            validationDetails={validationDetails}
            error={error}
          />
        )}
      </AnimatePresence>
      <ErrorDisplay />
    </>
  );
};

export default FeatureModelVisualizer;