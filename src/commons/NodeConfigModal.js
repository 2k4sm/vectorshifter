// nodeConfigModal.js
import { useState } from 'react';
import { NodeInput, NodeSelect } from '../commons/NodeFields';

const fieldTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'display', label: 'Display Field' }
];

export const NodeConfigModal = ({ onSave, onClose, initialConfig = {} }) => {
  const [config, setConfig] = useState({
        nodeType: initialConfig.nodeType || '',
        backgroundColor: initialConfig.backgroundColor || '#be87fe',
        borderColor: initialConfig.borderColor || '#150536',
        inputs: initialConfig.inputs || [],
        outputs: initialConfig.outputs || [],
        fields: initialConfig.fields || [],
        fieldValues: {}
    });

  const [newField, setNewField] = useState({
    type: 'text',
    label: '',
    options: []
  });

  const addInput = () => {
    setConfig(prev => ({
      ...prev,
      inputs: [...prev.inputs, { id: `input-${prev.inputs.length}`, label: `Input ${prev.inputs.length + 1}` }]
    }));
  };
  const removeInput = (id) => {
    setConfig(prev => ({
      ...prev,
      inputs: prev.inputs.filter(input => input.id !== id)
    }));
  };

  const addOutput = () => {
    setConfig(prev => ({
      ...prev,
      outputs: [...prev.outputs, { id: `output-${prev.outputs.length}`, label: `Output ${prev.outputs.length + 1}` }]
    }));
  };
  const removeOutput = (id) => {
    setConfig(prev => ({
      ...prev,
      outputs: prev.outputs.filter(output => output.id !== id)
    }));
  };

  const addField = () => {
    if (!newField.label) return;
    
    const fieldConfig = {
      id: `field-${config.fields.length}`,
      type: newField.type,
      label: newField.label,
    };

    if (newField.type === 'select') {
      fieldConfig.options = newField.options;
    }

    setConfig(prev => ({
      ...prev,
      fields: [...prev.fields, fieldConfig]
    }));

    setNewField({
      type: 'text',
      label: '',
      options: []
    });
  };
  const removeField = (id) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }));
  };

  const addSelectOption = () => {
    setNewField(prev => ({
      ...prev,
      options: [...prev.options, { value: '', label: '' }]
    }));
  };

  const updateSelectOption = (index, key, value) => {
    setNewField(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = { ...newOptions[index], [key]: value };
      return { ...prev, options: newOptions };
    });
  };

  const handleSave = () => {
    if (!config.nodeType.trim()) {
      alert('Node type name is required');
      return;
    }

    const processedConfig = {
      ...config,
      fields: config.fields.map((field, index) => ({
        ...field,
        id: field.id || `field-${index}`,
      })),
      inputs: config.inputs.map((input, index) => ({
        ...input,
        id: input.id || `input-${index}`,
      })),
      outputs: config.outputs.map((output, index) => ({
        ...output,
        id: output.id || `output-${index}`,
      }))
    };

    onSave(processedConfig);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-purple-200 rounded-lg p-10 sm:w-[40vw] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Configure Custom Node</h2>
        
        <div className="space-y-4">
          <NodeInput
            label="Node Type"
            value={config.nodeType}
            onChange={(e) => setConfig(prev => ({ ...prev, nodeType: e.target.value }))}
          />

          <h3 className="font-medium">Styling</h3>
          <div className="flex justify-evenly">
            <div className='w-[50%]'>
              <label className="block">Background Color</label>
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-full rounded-md"
              />
            </div>
            <div className='w-[50%]'>
              <label className="block">Border Color</label>
              <input
                type="color"
                value={config.borderColor}
                onChange={(e) => setConfig(prev => ({ ...prev, borderColor: e.target.value }))}
                className="w-full rounded-md"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Connection Points</h3>
            <div className="flex space-x-2 justify-between">
              <button
                onClick={addInput}
                className="w-[50%] p-4 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Add Inputs
              </button>
              <button
                onClick={addOutput}
                className="w-[50%] p-4 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Add Outputs
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <div className="text-purple-900 font-medium">Inputs: {config.inputs.length}</div>
                {config.inputs.map(input => (
                  <div key={input.id} className="flex items-center justify-between bg-purple-100 p-2 rounded mt-2">
                    <span>{input.label}</span>
                    <button
                      onClick={() => removeInput(input.id)}
                      className="p-1 hover:bg-purple-200 rounded"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-purple-900 font-medium">Outputs: {config.outputs.length}</div>
                {config.outputs.map(output => (
                  <div key={output.id} className="flex items-center justify-between bg-purple-100 p-2 rounded mt-2">
                    <span>{output.label}</span>
                    <button
                      onClick={() => removeOutput(output.id)}
                      className="p-1 hover:bg-purple-200 rounded"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className='flex justify-between'>
              <h3 className="font-medium">Fields</h3>
              <button
                  onClick={addField}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-green-600"
                >
                  Add Field
                </button>
            </div>
            <div className="space-y-2">
              <NodeSelect
                label="Field Type"
                value={newField.type}
                onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
                options={fieldTypes}
              />
              
              <NodeInput
                label="Field Label"
                value={newField.label}
                onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
              />

              {newField.type === 'select' && (
                <div className="space-y-2">
                  <button
                    onClick={addSelectOption}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Add Option
                  </button>
                  
                  {newField.options.map((option, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        placeholder="Value"
                        value={option.value}
                        onChange={(e) => updateSelectOption(index, 'value', e.target.value)}
                        className="border rounded px-2 py-1 w-1/2"
                      />
                      <input
                        placeholder="Label"
                        value={option.label}
                        onChange={(e) => updateSelectOption(index, 'label', e.target.value)}
                        className="border rounded px-2 py-1 w-1/2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="text-purple-900 font-medium">Current Fields: {config.fields.length}</div>
              {config.fields.map(field => (
                <div key={field.id} className="flex items-center justify-between bg-purple-100 p-2 rounded mt-2">
                  <div>
                    <span className="font-medium">{field.label}</span>
                    <span className="text-sm text-purple-600 ml-2">({field.type})</span>
                  </div>
                  <button
                    onClick={() => removeField(field.id)}
                    className="p-1 hover:bg-purple-200 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between space-x-2 mt-4">
          <button
            onClick={onClose}
            className="w-[30%] p-5 bg-purple-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-[30%] p-5 bg-purple-500 text-white rounded hover:bg-green-600"
          >
            Save Node
          </button>
        </div>
      </div>
    </div>
  );
};