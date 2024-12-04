// components/ErrorPopup.js
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorPopup = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="fixed inset-0 bg-black opacity-50"></div>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-6 z-50 max-w-sm w-full mx-4"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">Error</h3>
          <p className="mt-1.5 text-gray-600 text-sm">{message}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Ok
        </button>
      </div>
    </motion.div>
  </div>
);

export default ErrorPopup;