import { useStore } from '../store';
import { Node } from './Node';
import { NodeInput } from '../commons/NodeFields';

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore(state => state.updateNodeField);

  const handleTextChange = (e) => {
    updateNodeField(id, 'text', e.target.value);
  };

  return (
    <Node
      id={id}
      nodeType="Text"
      className="border-red-600 bg-red-200"
      outputs={[
        { id: 'output', label: 'Output' }
      ]}
    >
      <div className="space-y-3">
        <NodeInput
          label="Text"
          value={data?.text || '{{input}}'}
          onChange={handleTextChange}
          className="font-mono"
        />
      </div>
    </Node>
  );
};