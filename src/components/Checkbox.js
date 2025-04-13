const Checkbox = ({ name, label, checked, onChange }) => (
    <div className="w-full">
        <input
            type="checkbox"
            name={name}
            id={name}
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
        />
        <label
            htmlFor={name}
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
            {label}
        </label>
    </div>
);


export default Checkbox;