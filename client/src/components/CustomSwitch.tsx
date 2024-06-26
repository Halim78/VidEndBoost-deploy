type CustomSwitchProps = {
  title: string;
  isActive: boolean;
  onToggle: (e: boolean) => void;
};

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  title,
  isActive,
  onToggle,
}) => {
  return (
    <div>
      <label className="inline-flex items-center w-full mb-3 cursor-pointer">
        <span className="p-2 font-medium tracking-wider text-gray-900 text-md ">
          {title}
        </span>
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => onToggle(e.target.checked)}
          className="sr-only peer"
        />
        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
};

export default CustomSwitch;
