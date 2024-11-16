import { Handle, Position } from 'reactflow';

export const Node = ({ 
  id, 
  nodeType,
  inputs = [],
  outputs = [],
  children,
  className = '',
}) => {
  return (
    <div className={`
      w-64 min-h-[80px] 
      border-2 rounded-lg 
      shadow-sm
      transition-all
      hover:shadow-md
      ${className}
    `}>
      {/* Input Handles */}
      {inputs.map((input, index) => (
        <Handle
          key={`${id}-${input.id}`}
          type="target"
          position={Position.Left}
          id={`${id}-${input.id}`}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
          style={{ 
            top: inputs.length === 1 ? '50%' : `${((index + 1) * 100) / (inputs.length + 1)}%`,
            ...input.style
          }}
        />
      ))}

      <div className="p-3">
        <div className="font-semibold text-gray-700 mb-2 border-b border-gray-200 pb-2">
          {nodeType}
        </div>

        <div className="space-y-2">
          {children}
        </div>
      </div>

      {/* Output Handles */}
      {outputs.map((output, index) => (
        <Handle
          key={`${id}-${output.id}`}
          type="source"
          position={Position.Right}
          id={`${id}-${output.id}`}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
      ))}
    </div>
  );
};