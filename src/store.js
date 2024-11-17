// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    customNodeTypes: {},

    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
        set(({
            edges: addEdge({
                ...connection, 
                type: 'smoothstep', 
                animated: true, 
                markerEnd: {
                    type: MarkerType.Arrow, 
                    height: '20px', 
                    width: '20px'
                }
            }, get().edges),
        }));
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
        set(({
            nodes: get().nodes.map((node) => 
                node.id === nodeId 
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            fieldValues: {
                                ...(node.data.fieldValues || {}),
                                [fieldName]: fieldValue
                            }
                        }
                    }
                    : node
            )
        }));
    },
    addNodeType: (config) => {
        set(({
            customNodeTypes: {
                ...get().customNodeTypes,
                [config.nodeType]: config
            }
        }));
    },
    getInitNodeData: (nodeID, type, customConfig = null) => {
        const state = get();
        
        if (type === 'custom' && customConfig) {
            return {
                id: nodeID,
                type: 'custom',
                nodeType: customConfig.nodeType,
                backgroundColor: customConfig.backgroundColor,
                borderColor: customConfig.borderColor,
                inputs: customConfig.inputs || [],
                outputs: customConfig.outputs || [],
                fields: customConfig.fields || [],
                fieldValues: {},
            };
        }
        if (state.customNodeTypes[type]) {
            const config = state.customNodeTypes[type];
            return {
                id: nodeID,
                type: 'custom',
                nodeType: type,
                backgroundColor: config.backgroundColor,
                borderColor: config.borderColor,
                inputs: config.inputs || [],
                outputs: config.outputs || [],
                fields: config.fields || [],
                fieldValues: {},
            };
        }
        return { 
            id: nodeID,
            type: type,
            nodeType: type 
        };
    },
}));