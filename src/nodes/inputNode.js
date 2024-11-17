import { useStore } from '../store';
import { Node } from './Node';
import { NodeInput, NodeSelect } from '../commons/NodeFields';
const inputTypeOptions = [
  { value: 'Text', label: 'Text' },
  { value: 'File', label: 'File' }
];

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore(state => state.updateNodeField);

  const handleNameChange = (e) => {
    updateNodeField(id, 'inputName', e.target.value);
  };

  const handleTypeChange = (e) => {
    updateNodeField(id, 'inputType', e.target.value);
  };

  return (
    <Node
      id={id}
      nodeType="Input"
      className="border-green-600 bg-green-200"
      outputs={[
        { id: 'value', label: 'Output' }
      ]}
    >
      <div className="space-y-3">
        <NodeInput
          label="Name"
          value={data?.inputName || id.replace('customInput-', 'input_')}
          onChange={handleNameChange}
        />

        <NodeSelect
          label="Type"
          value={data?.inputType || 'Text'}
          onChange={handleTypeChange}
          options={inputTypeOptions}
        />
      </div>
    </Node>
  );
};