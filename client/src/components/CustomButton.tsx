type CustomButtonProps = {
  label: string;
  pathIcon: string;
  onClick: () => void;
};

const CustomButton: React.FC<CustomButtonProps> = ({ label, pathIcon, onClick }) => {
  return (
    <div>
      <button
        onClick={onClick}
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
      >
          <span className="flex justify-between relative px-5 py-2 tracking-wider transition-all ease-in duration-75 bg-white dark:bg-black rounded-md group-hover:bg-opacity-0">
            <img src={pathIcon} width={20} height={20} alt="icone" />
            <span className="pl-2">{label}</span>
          </span>
      </button>
    </div>
  );
};

export default CustomButton;
