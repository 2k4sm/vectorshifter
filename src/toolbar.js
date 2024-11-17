// toolbar.js
import { useState } from 'react';
import { DraggableNode } from './draggableNode';
import { NodeConfigModal } from './commons/NodeConfigModal';
import { useStore } from './store';

export const PipelineToolbar = () => {
    const [showModal, setShowModal] = useState(false);
    const customNodeTypes = useStore(state => state.customNodeTypes);
    const addNodeType = useStore(state => state.addNodeType);

    const handleSaveNodeConfig = (config) => {
        addNodeType(config);
        setShowModal(false);
    };

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
                        onClick={() => setShowModal(true)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    >
                        Create New Node
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(customNodeTypes).map(([nodeType, config]) => (
                        <DraggableNode 
                            key={nodeType}
                            type="custom"
                            label={config.nodeType}
                            data={config}
                        />
                    ))}
                </div>
            </div>
            {showModal && (
                <NodeConfigModal
                    onSave={handleSaveNodeConfig}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};
