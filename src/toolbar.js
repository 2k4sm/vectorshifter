// toolbar.js
import { useState, useCallback } from 'react';
import { DraggableNode } from './draggableNode';
import { NodeConfigModal } from './commons/NodeConfigModal';
import { useStore } from './store';

const EditIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
);

const DeleteIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

export const PipelineToolbar = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingNode, setEditingNode] = useState(null);

    const customNodeTypes = useStore(state => state.customNodeTypes);
    const addNodeType = useStore(state => state.addNodeType);
    const deleteNodeType = useStore(state => state.deleteNodeType);
    const updateNodeType = useStore(state => state.updateNodeType);

    const handleSaveNodeConfig = useCallback((config) => {
        if (editingNode) {
            updateNodeType(editingNode.nodeType, config);
        } else {
            addNodeType(config);
        }
        setShowModal(false);
        setEditingNode(null);
    }, [addNodeType, updateNodeType, editingNode]);

    const handleDeleteNode = useCallback((event, nodeType) => {
        event.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the "${nodeType}" node type? All instances will be removed from the canvas.`)) {
            deleteNodeType(nodeType);
        }
    }, [deleteNodeType]);

    const handleEditNode = useCallback((event, nodeType, config) => {
        event.stopPropagation();
        setEditingNode({ nodeType, config });
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setEditingNode(null);
    }, []);

    return (
        <div className="p-4">
            <h3 className="font-medium mb-2">Standard Nodes</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
            </div>
            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Custom Nodes</h3>
                    <button
                        onClick={() => {
                            setEditingNode(null);
                            setShowModal(true);
                        }}
                        className="px-3 py-1 bg-purple-800 text-white rounded hover:bg-green-600 text-sm"
                    >
                        New Node
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(customNodeTypes).map(([nodeType, config]) => (
                        <div 
                            key={nodeType}
                            className="relative group"
                        >
                            <DraggableNode 
                                type="custom"
                                label={config.nodeType}
                                data={config}
                            />
                            <div className="absolute -top-2 -right-2 hidden group-hover:flex gap-1">
                                <button
                                    onClick={(e) => handleEditNode(e, nodeType, config)}
                                    className="p-1 bg-blue-500 rounded-full text-white hover:bg-blue-600"
                                    title="Edit node"
                                >
                                    <EditIcon />
                                </button>
                                <button
                                    onClick={(e) => handleDeleteNode(e, nodeType)}
                                    className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                                    title="Delete node"
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showModal && (
                <NodeConfigModal
                    onSave={handleSaveNodeConfig}
                    onClose={closeModal}
                    initialConfig={editingNode?.config}
                />
            )}
        </div>
    );
};