// outputNode.js
import { useStore } from '../store';
import { Node } from './Node';
import { NodeDisplay } from '../commons/NodeFields';


export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore(state => state.updateNodeField);

  const handleNameChange = (e) => {
    updateNodeField(id, 'outputName', e.target.value);
  };

  const handleContentChange = (e) => {
    updateNodeField(id, 'outputContent', e.target.value);
  };

  return (
    <Node
      id={id}
      nodeType="Output"
      className="border-orange-600 bg-orange-200"
      inputs={[
        { id: 'value', label: 'Input' }
      ]}
      outputs={[
        {id: 'value', label: 'Output'}
      ]}
    >
      <div className="space-y-3">
        <NodeDisplay
          label="Name"
          value={data?.outputName || id.replace('customOutput-', 'output_')}
        />

        <NodeDisplay
          label="Content"
          value = {data?.outputContent || id.replace('customOutput-', 'output_')}
        />
        
      </div>
    </Node>
  );
};