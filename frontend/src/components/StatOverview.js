// components/StatsOverview.jsx
import { motion } from "framer-motion";
import { Box, Check, Hash, CheckCircle } from "lucide-react";
import StatCard from "./StatCard";

const StatsOverview = ({ featureModel, mwp }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={Box}
        label="Total Features"
        value={Object.keys(featureModel || {}).length}
        color="blue"
      />
      <StatCard
        icon={Check}
        label="Mandatory Features"
        value={Object.values(featureModel || {}).filter(f => f.mandatory).length}
        color="green"
      />
      <StatCard
        icon={Hash}
        label="Constraints"
        value={featureModel?.constraints?.length || 0}
        color="purple"
      />
    </div>

    {mwp && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Box className="w-6 h-6 text-blue-600" />
          Minimum Working Product
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mwp.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )}
  </div>
);

export default StatsOverview;