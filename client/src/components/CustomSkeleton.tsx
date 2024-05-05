type CustomSkeletonProps = {
  isSelected: boolean;
  type: string;
  onSkeletonChange: (value: boolean) => void;
};

const CustomSkeleton: React.FC<CustomSkeletonProps> = ({
  isSelected,
  type,
  onSkeletonChange,
}) => {
  const handleClick = () => {
    onSkeletonChange(!isSelected);
  };

  return (
    <div
      onClick={handleClick}
      className={`border-2 mx-2 cursor-pointer ${
        isSelected ? "border-blue-300" : "border-gray-200"
      } shadow rounded-md p-2 mx-full `}
    >
      <div className={`flex flex-${type} space-x-6`}>
        <div className="w-12 h-8 bg-black rounded dark:bg-white"></div>
        <div className="flex-1 py-0 space-y-1">
          {type === "row" ? (
            <div className="h-2 bg-black rounded dark:bg-white"></div>
          ) : (
            <div className="h-1"></div>
          )}
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-3">
              <div className="h-2 col-span-2 bg-black rounded dark:bg-white"></div>
              <div className="h-2 col-span-1 bg-black rounded dark:bg-white"></div>
            </div>
            <div className="h-2 bg-black rounded dark:bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSkeleton;
