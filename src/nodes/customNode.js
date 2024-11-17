// customNode.js
import { memo } from 'react';
import { useStore } from '../store';
import { Node } from './Node';
import { NodeInput, NodeSelect, NodeDisplay } from '../commons/NodeFields';

export const CustomNode = memo(({ id, data }) => {
    console.log('CustomNode rendering with data:', data); // Debug log
    
    const updateNodeField = useStore(state => state.updateNodeField);

    const renderField = (field) => {
        console.log('Rendering field:', field); // Debug log
        
        const handleChange = (e) => {
            updateNodeField(id, field.id, e.target.value);
        };

        switch (field.type) {
            case 'text':
                return (
                    <NodeInput
                        key={field.id}
                        label={field.label}
                        value={data.fieldValues?.[field.id] || ''}
                        onChange={handleChange}
                    />
                );
            
            case 'select':
                return (
                    <NodeSelect
                        key={field.id}
                        label={field.label}
                        value={data.fieldValues?.[field.id] || ''}
                        onChange={handleChange}
                        options={field.options || []}
                    />
                );
            
            case 'display':
                return (
                    <NodeDisplay
                        key={field.id}
                        label={field.label}
                        value={data.fieldValues?.[field.id] || ''}
                    />
                );
            
            default:
                return null;
        }
    };

    return (
        <Node
            id={id}
            nodeType={data.nodeType || "Custom Node"}
            style={{
                backgroundColor: data.backgroundColor || '#ffffff',
                borderColor: data.borderColor || '#000000',
                borderWidth: '2px',
                borderStyle: 'solid',
            }}
            inputs={data.inputs || []}
            outputs={data.outputs || []}
        >
            <div className="space-y-3">
                {data.fields?.map(field => (
                    <div key={field.id}>
                        {renderField(field)}
                    </div>
                ))}
            </div>
        </Node>
    );
});