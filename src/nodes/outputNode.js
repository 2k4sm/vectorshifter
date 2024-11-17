import { useStore } from '../store';
import { Node } from './Node';
import { NodeDisplay } from '../commons/NodeFields';
import { useEffect, useRef } from 'react';

export const OutputNode = ({ id, data }) => {
  const nodes = useStore(state => state.nodes);
  const edges = useStore(state => state.edges);
  const updateNodeField = useStore(state => state.updateNodeField);
  const prevConnectedNodeId = useRef(null);
  const prevSourceData = useRef(null);

  const processNodeContent = (sourceNode) => {
    if (!sourceNode) return '';
    
    const nodeType = sourceNode.type;
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
        contentToStore = value;
        break;
      default:
        contentToStore = `Connected to unknown node type: ${nodeType}`;
        console.log('Unknown Node Type:', nodeType);
    }

    return contentToStore;
  };

  useEffect(() => {
    const incomingEdge = edges.find(edge => edge.target === id);
    const sourceNode = incomingEdge 
      ? nodes.find(node => node.id === incomingEdge.source)
      : null;

    if (!sourceNode && prevConnectedNodeId.current) {
      console.log('Disconnection detected');
      updateNodeField(id, 'sourceNodeId', null);
      updateNodeField(id, 'sourceNodeType', null);
      updateNodeField(id, 'content', null);
      prevConnectedNodeId.current = null;
      prevSourceData.current = null;
      return;
    }

    if (!sourceNode) return;

    const currentSourceData = JSON.stringify(sourceNode.data?.fieldValues);
    const hasSourceChanged = sourceNode.id !== prevConnectedNodeId.current;
    const hasDataChanged = currentSourceData !== prevSourceData.current;

    if (hasSourceChanged || hasDataChanged) {

      const contentToStore = processNodeContent(sourceNode);

      updateNodeField(id, 'sourceNodeId', sourceNode.id);
      updateNodeField(id, 'sourceNodeType', sourceNode.type);
      updateNodeField(id, 'content', contentToStore);

      prevConnectedNodeId.current = sourceNode.id;
      prevSourceData.current = currentSourceData;
    }
  }, [edges, nodes, id, updateNodeField]);

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