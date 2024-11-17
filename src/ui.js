// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap, useKeyPress } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { CustomNode } from './nodes/customNode';
import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
    customInput: InputNode,
    llm: LLMNode,
    customOutput: OutputNode,
    text: TextNode,
    custom: CustomNode,
};

const nodeSelector = state => state.nodes;
const edgeSelector = state => state.edges;
const nodesChangeSelector = state => state.onNodesChange;
const edgesChangeSelector = state => state.onEdgesChange;
const connectSelector = state => state.onConnect;
const getNodeIDSelector = state => state.getNodeID;
const addNodeSelector = state => state.addNode;
const getInitNodeDataSelector = state => state.getInitNodeData;

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedElements, setSelectedElements] = useState({ nodes: [], edges: [] });

    const nodes = useStore(nodeSelector, shallow);
    const edges = useStore(edgeSelector, shallow);
    const onNodesChange = useStore(nodesChangeSelector);
    const onEdgesChange = useStore(edgesChangeSelector);
    const onConnect = useStore(connectSelector);
    const getNodeID = useStore(getNodeIDSelector);
    const addNode = useStore(addNodeSelector);
    const getInitNodeData = useStore(getInitNodeDataSelector);

    const onSelectionChange = useCallback((params) => {
        setSelectedElements({
            nodes: params.nodes || [],
            edges: params.edges || []
        });
    }, []);
    const onNodeContextMenu = useCallback((event, node) => {
        event.preventDefault();
        
        const connectedEdges = edges.filter(
            edge => edge.source === node.id || edge.target === node.id
        );
        
        if (connectedEdges.length > 0) {
            onEdgesChange(
                connectedEdges.map(edge => ({
                    type: 'remove',
                    id: edge.id
                }))
            );
        }
    }, [edges, onEdgesChange]);

    const handleDelete = useCallback(() => {
        if (selectedElements.edges.length > 0) {
            onEdgesChange(
                selectedElements.edges.map(edge => ({
                    type: 'remove',
                    id: edge.id
                }))
            );
        }

        if (selectedElements.nodes.length > 0) {
            onNodesChange(
                selectedElements.nodes.map(node => ({
                    type: 'remove',
                    id: node.id
                }))
            );

            const nodesToDelete = new Set(selectedElements.nodes.map(node => node.id));
            const connectedEdges = edges.filter(
                edge => nodesToDelete.has(edge.source) || nodesToDelete.has(edge.target)
            );

            if (connectedEdges.length > 0) {
                onEdgesChange(
                    connectedEdges.map(edge => ({
                        type: 'remove',
                        id: edge.id
                    }))
                );
            }
        }
    }, [selectedElements, edges, onNodesChange, onEdgesChange]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Delete') {
                handleDelete();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [handleDelete]);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            if (!reactFlowInstance || !reactFlowWrapper.current) {
                return;
            }

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            let data;
            
            try {
                data = JSON.parse(event.dataTransfer.getData('application/reactflow'));
                console.log('Dropped data:', data);
            } catch (err) {
                console.error('Failed to parse drag data:', err);
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(data.nodeType);
            const nodeData = getInitNodeData(nodeID, data.nodeType, data.customConfig);
            const newNode = {
                id: nodeID,
                type: data.customConfig ? 'custom' : data.nodeType,
                position,
                data: nodeData
            };
            console.log('Adding new node:', newNode);
            addNode(newNode);
        },
        [reactFlowInstance, getNodeID, addNode, getInitNodeData]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <>
        <div style={{ width: '100%', height: '70vh' }} ref={reactFlowWrapper} className="bg-gray-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                onNodeContextMenu={onNodeContextMenu}
                onSelectionChange={onSelectionChange}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                deleteKeyCode={null}
                selectionKeyCode={['Shift']}
                multiSelectionKeyCode={['Shift']}
            >
                <Background color="red" gap={gridSize}/>
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
        </>
    )
}