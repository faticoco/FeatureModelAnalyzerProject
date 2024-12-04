// components/Sidebar.jsx
import { motion } from "framer-motion";
import { Layout, Binary, GitBranch, Settings, Workflow } from "lucide-react";

const SidebarItem = ({ icon: Icon, label, id, selectedTab, setSelectedTab }) => (
  <motion.button
    whileHover={{ x: 4 }}
    onClick={() => setSelectedTab(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      selectedTab === id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </motion.button>
);

const Sidebar = ({ selectedTab, setSelectedTab }) => (
  <motion.div
    initial={{ x: -250 }}
    animate={{ x: 0 }}
    className="w-64 bg-white h-screen shadow-lg fixed"
  >
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Analysis Dashboard</h2>
      <nav className="space-y-2">
        <SidebarItem icon={Layout} label="Overview" id="overview" selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <SidebarItem icon={Binary} label="Logic View" id="logic" selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <SidebarItem icon={GitBranch} label="Feature Tree" id="tree" selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <SidebarItem icon={Settings} label="Configuration" id="config" selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <SidebarItem icon={Workflow} label="Visual Model" id="visual" selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </nav>
    </div>
  </motion.div>
);

export default Sidebar;
