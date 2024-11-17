import { useStore } from '../store';
import { Node } from './Node';
import { NodeDisplay } from '../commons/NodeFields';
import { useEffect, useRef } from 'react';

export const OutputNode = ({ id, data }) => {
  const nodes = useStore(state => state.nodes);
  const edges = useStore(state => state.edges);
  const updateNodeField = useStore(state => state.updateNodeField);
  const prevConnectedNodeId = useRef(null);

  useEffect(() => {
    const incomingEdge = edges.find(edge => edge.target === id);

    const sourceNode = incomingEdge 
      ? nodes.find(node => node.id === incomingEdge.source)
      : null;

    // Handle disconnection
    if (!sourceNode && prevConnectedNodeId.current) {
      console.log('Disconnection detected. Previous connection:', prevConnectedNodeId.current);
      updateNodeField(id, 'sourceNodeId', null);
      updateNodeField(id, 'sourceNodeType', null);
      updateNodeField(id, 'content', null);
      prevConnectedNodeId.current = null;
      return;
    }

    if (!sourceNode || sourceNode.id === prevConnectedNodeId.current) {
      return;
    }

    const nodeType = sourceNode.type;
    console.log('Source Node Data:', sourceNode.data);
    
    let contentToStore = '';

    switch (nodeType) {
      case 'text':
        contentToStore = sourceNode.data?.fieldValues?.text || '';
        break;
      case 'customInput':
        const inputName = sourceNode.data?.fieldValues?.inputName || 'Unnamed Input';
        contentToStore = `Input Name: ${inputName}`;
        break;
      case 'customOutput':
        const content = sourceNode.data?.fieldValues?.content || 'Unnamed Input';
        contentToStore = `Output's output: ${content}`;
        break;
      case 'llm':
        contentToStore = sourceNode.data?.fieldValues?.response || 'Waiting for LLM response...';
        break;
      case 'custom':
        let value = ''

        for (let key in sourceNode.data?.fieldValues) {
          value += `${key}: ${sourceNode.data?.fieldValues[key]}\n`;
        }
        console.log("custom data---->>>", value)
        contentToStore = value;
        break;
      default:
        contentToStore = `Connected to unknown node type: ${nodeType}`;
        console.log('Unknown Node Type:', nodeType);
    }


    if (contentToStore !== data?.fieldValues?.content) {
      updateNodeField(id, 'sourceNodeId', sourceNode.id);
      updateNodeField(id, 'sourceNodeType', nodeType);
      updateNodeField(id, 'content', contentToStore);
      prevConnectedNodeId.current = sourceNode.id;
    } else {
      console.log('Content unchanged, skipping update');
    }

  }, [edges, nodes, id, updateNodeField, data?.fieldValues?.content]);

  return (
    <Node
      id={id}
      nodeType="Output"
      className="border-orange-600 bg-orange-200 w-fit"
      inputs={[
        { id: 'value', label: 'Input', type: 'target' }
      ]}
      outputs={[
        { id: 'output', label: 'Output', type: 'source' }
      ]}
    >
      <div className="space-y-3">
        <NodeDisplay
          label="Source"
          value={data?.fieldValues?.sourceNodeId 
            ? `Connected to: ${data?.fieldValues?.sourceNodeType} (${data?.fieldValues?.sourceNodeId})`
            : 'No connection'}
          className="font-medium"
        />

        <NodeDisplay
          label="Content"
          value={data?.fieldValues?.content || 'No input connected'}
          className="font-mono whitespace-pre-wrap break-words"
        />
      </div>
    </Node>
  );
};