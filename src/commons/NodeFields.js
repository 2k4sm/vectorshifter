export const NodeInput = ({ 
  label, 
  value, 
  onChange, 
  className, 
  placeholder,
  type = 'input',
  ...props 
}) => {
  if (type === 'textarea') {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <textarea
          value={value}
          onChange={onChange}
          className={`w-[400px] min-h-[200px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y ${className || ''}`}
          placeholder={placeholder}
          {...props}
        ></textarea>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className || ''}`}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export const NodeSelect = ({ label, value, onChange, options }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select 
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const NodeDisplay = ({ label, value, className = "" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <div 
      className={`w-[400px] min-h-[100px] p-3 rounded-md border border-gray-300 bg-white text-sm overflow-auto ${className}`}
    >
      {value || 'Waiting for input...'}
    </div>
  </div>
);