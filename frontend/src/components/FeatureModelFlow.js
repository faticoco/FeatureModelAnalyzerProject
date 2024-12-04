import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  Position,
  Handle
} from "reactflow";
import "reactflow/dist/style.css";

const FeatureModelFlow = ({ featureModel }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const createFlowElements = () => {
    const flowNodes = [];
    const flowEdges = [];
    const VERTICAL_SPACING = 120;
    const HORIZONTAL_SPACING = 160;

    // Build level map
    const levelMap = new Map();
    Object.entries(featureModel).forEach(([name, feature]) => {
      const level = getLevel(name, featureModel);
      if (!levelMap.has(level)) levelMap.set(level, []);
      levelMap.get(level).push(name);
    });

    function getLevel(nodeName, model, level = 0) {
      const parent = model[nodeName]?.parent;
      if (!parent) return 0;
      return getLevel(parent, model, level + 1) + 1;
    }

    // First create all nodes
    levelMap.forEach((featuresInLevel, level) => {
      const levelWidth = featuresInLevel.length * HORIZONTAL_SPACING;
      const startX = -(levelWidth / 2);

      featuresInLevel.forEach((featureName, index) => {
        const feature = featureModel[featureName];
        const xPos = startX + index * HORIZONTAL_SPACING;

        flowNodes.push({
          id: featureName,
          position: {
            x: xPos + HORIZONTAL_SPACING / 2,
            y: level * VERTICAL_SPACING,
          },
          data: {
            label: featureName,
            mandatory: feature.mandatory,
            groupType: feature.group_type,
          },
          type: "featureNode",
        });
      });
    });

    // Then create all edges after nodes are created
    flowNodes.forEach((node) => {
      const feature = featureModel[node.id];
      
      if (feature.parent) {
        // Add parent-child edge
        flowEdges.push({
          id: `${feature.parent}-${node.id}`,
          source: feature.parent,
          target: node.id,
          type: "step",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { strokeWidth: 2 }
        });

        // Handle group edges
        if (feature.group_type) {
          const siblings = featureModel[feature.parent].children
            .filter(child => featureModel[child].group_type === feature.group_type);
          
          const siblingIndex = siblings.indexOf(node.id);
          if (siblingIndex < siblings.length - 1) {
            const nextSibling = siblings[siblingIndex + 1];
            const currentNodePos = flowNodes.find(n => n.id === node.id)?.position;
            const nextNodePos = flowNodes.find(n => n.id === nextSibling)?.position;

            if (currentNodePos && nextNodePos && 
                Math.abs(currentNodePos.x - nextNodePos.x) <= HORIZONTAL_SPACING * 1.5) {
              flowEdges.push({
                id: `group-${feature.parent}-${node.id}-${nextSibling}`,
                source: node.id,
                target: nextSibling,
                type: "straight",
                style: {
                  stroke: "#000",
                  strokeWidth: feature.group_type === "xor" ? 2 : 1,
                  strokeDasharray: feature.group_type === "xor" ? "0" : "5,5",
                }
              });
            }
          }
        }
      }
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  };

  useEffect(() => {
    if (featureModel) {
      createFlowElements();
    }
  }, [featureModel]);

  const FeatureNode = ({ data }) => (
    <div className="relative">
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
      <div
        className={`
        px-4 py-2 rounded border-2
        ${data.mandatory ? "border-blue-600" : "border-gray-400"}
        bg-white min-w-[120px] text-center
      `}
      >
        <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
          <div
            className={`
            w-4 h-4 rounded-full border-2 border-black
            ${data.mandatory ? "bg-black" : "bg-white"}
          `}
          />
        </div>
        <span>{data.label}</span>
      </div>
      {data.groupType && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-purple-600">
          {data.groupType.toUpperCase()}
        </div>
      )}
    </div>
  );

  const nodeTypes = {
    featureNode: FeatureNode,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Feature Model Visualization</h2>
      <div style={{ height: 600 }} className="border rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FeatureModelFlow;