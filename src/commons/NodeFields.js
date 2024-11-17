export const NodeInput = ({ label, value, onChange, className = '' }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm text-gray-600">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`
        px-2 py-1
        border rounded
        text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500
        bg-white
        ${className}
      `}
    />
  </div>
);

export const NodeSelect = ({ label, value, onChange, options, className = '' }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm text-gray-600">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className={`
        px-2 py-1
        border rounded
        text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500
        bg-white
        ${className}
      `}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export const NodeDisplay = ({label, value, className=""}) => (
  <div>
    {label}
    {value}
  </div>
);