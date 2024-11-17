// customNode.js
import { memo } from 'react';
import { useStore } from '../store';
import { Node } from './Node';
import { NodeInput, NodeSelect } from '../commons/NodeFields';

export const CustomNode = memo(({ id, data }) => {
    
    const updateNodeField = useStore(state => state.updateNodeField);

    const renderField = (field) => {
        
        const handleChange = (e) => {
            updateNodeField(id, field.id, e.target.value);
        };

        switch (field.type) {
            case 'textarea':
                return (
                    <NodeInput
                        key={field.id}
                        label={field.label}
                        value={data.fieldValues?.[field.id] || ''}
                        onChange={handleChange}
                        type='textarea'
                    />
                );
            case 'text':
                return (
                    <NodeInput
                        key={field.id}
                        label={field.label}
                        value={data.fieldValues?.[field.id] || ''}
                        onChange={handleChange}
                        type='text'
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
            className='w-fit'
        >
            <div className="space-y-3 w-fit">
                {data.fields?.map(field => (
                    <div key={field.id}>
                        {renderField(field)}
                    </div>
                ))}
            </div>
        </Node>
    );
});