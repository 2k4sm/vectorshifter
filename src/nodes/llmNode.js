// llmNode.js
import { useStore } from '../store';
import { Node } from './Node';
import { NodeSelect } from '../commons/NodeFields';
const modelOptions = [
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-3.5', label: 'GPT-3.5' },
  { value: 'claude', label: 'Claude' }
];

export const LLMNode = ({ id, data }) => {
  const updateNodeField = useStore(state => state.updateNodeField);

  const handleModelChange = (e) => {
    updateNodeField(id, 'model', e.target.value);
  };

  return (
    <Node
      id={id}
      nodeType="LLM"
      className="border-purple-600 bg-purple-200"
      inputs={[
        { id: 'system', label: 'System' },
        { id: 'prompt', label: 'Prompt' }
      ]}
      outputs={[
        { id: 'response', label: 'Response' }
      ]}
    >
      <div className="space-y-3">
        <NodeSelect
          label="Model"
          value={data?.fieldValues?.model || 'gpt-4'}
          onChange={handleModelChange}
          options={modelOptions}
        />

        <div className="text-xs text-gray-500">
          <div className="flex justify-between mb-1">
            <span>System Prompt:</span>
            <span className="text-purple-600">Left Top</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>User Prompt:</span>
            <span className="text-purple-600">Left Bottom</span>
          </div>
          <div className="flex justify-between">
            <span>Response:</span>
            <span className="text-purple-600">Right</span>
          </div>
        </div>
      </div>
    </Node>
  );
};