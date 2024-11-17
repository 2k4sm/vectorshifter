import { useStore } from '../store';
import { Node } from './Node';
import { NodeInput } from '../commons/NodeFields';
import { useCallback, useEffect, useState, useMemo } from 'react';

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore(state => state.updateNodeField);
  const [inputs, setInputs] = useState([]);

  const extractVariables = useCallback((text) => {
    try {
      const regex = /{{([^},^{]+)}}/g;
      const matches = [...(text || '').matchAll(regex)];
      const uniqueVariables = [...new Set(
        matches.map(match => match[1].trim())
          .filter(variable => variable.length > 0)
      )];
      return uniqueVariables;
    } catch (error) {
      console.error('Error extracting variables:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    const currentText = data?.fieldValues?.text || '';
    const variables = extractVariables(currentText);
    
    const newInputs = variables.map(variable => ({
      id: `input-${variable}`,
      label: variable,
      type : 'target'
    }));

    if (JSON.stringify(inputs) !== JSON.stringify(newInputs)) {
      setInputs(newInputs);
    }
  }, [data?.fieldValues?.text, extractVariables, inputs]);

  const currentValue = useMemo(() => 
    data?.fieldValues?.text || '', 
    [data?.fieldValues?.text]
  );

  const handleTextChange = (e) => {
    updateNodeField(id, 'text', e.target.value);
  };

  return (
    <Node
      id={id}
      nodeType="Text"
      className="border-red-600 bg-red-200 w-fit"
      inputs={inputs}
      outputs={[
        { id: 'output', label: 'Output', type: 'source' }
      ]}
    >
      <div className="space-y-3">
        <NodeInput
          label="Text"
          value={currentValue}
          onChange={handleTextChange}
          className="font-mono"
          placeholder="Type {{variable}} to create input handles"
          type='textarea'
        />
        {inputs.length > 0 && (
          <div className="text-xs text-gray-500">
            {inputs.map(input => {
              return (
                <div key={input.id} className="flex justify-between">
                  <span className="text-red-600">{input.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Node>
  );
};