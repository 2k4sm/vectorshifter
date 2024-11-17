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
        backgroundColor: initialConfig.backgroundColor || '#ffffff',
        borderColor: initialConfig.borderColor || '#000000',
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

  const addOutput = () => {
    setConfig(prev => ({
      ...prev,
      outputs: [...prev.outputs, { id: `output-${prev.outputs.length}`, label: `Output ${prev.outputs.length + 1}` }]
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Configure Custom Node</h2>
        
        <div className="space-y-4">
          <NodeInput
            label="Node Type Name"
            value={config.nodeType}
            onChange={(e) => setConfig(prev => ({ ...prev, nodeType: e.target.value }))}
          />

          <div className="space-y-2">
            <h3 className="font-medium">Styling</h3>
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
              className="w-full"
            />
            <input
              type="color"
              value={config.borderColor}
              onChange={(e) => setConfig(prev => ({ ...prev, borderColor: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Connection Points</h3>
            <div className="flex space-x-2">
              <button
                onClick={addInput}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Input
              </button>
              <button
                onClick={addOutput}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Output
              </button>
            </div>
            <div className="text-sm">
              Inputs: {config.inputs.length} | Outputs: {config.outputs.length}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Fields</h3>
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

              <button
                onClick={addField}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Field
              </button>
            </div>

            <div className="text-sm">
              Current Fields: {config.fields.length}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Node
          </button>
        </div>
      </div>
    </div>
  );
};