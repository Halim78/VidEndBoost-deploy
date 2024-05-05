type CustomSliderProps = {
  label: string;
  value: string;
  max: string;
  min?: string;
  onChange: (e: string) => void;
};

const Slider: React.FC<CustomSliderProps> = ({
  label,
  value,
  max,
  min = 6,
  onChange,
}) => {
  return (
    <div className="relative ">
      <div className="flex items-center justify-between py-1.5">
        <div className="flex flex-col justify-between w-full">
          <label
            htmlFor="default-range"
            className="w-full font-medium tracking-wider text-left text-black text-md dark:text-gray-300"
          >
            {label}
          </label>
          <input
            id="default-range"
            className="w-full py-1 cursor-pointer "
            type="range"
            value={value}
            step="0.1"
            min={min}
            max={max}
            onChange={(e) => onChange(e.target.value)} // Ajout du gestionnaire d'événements onChange
          />
        </div>
        <output
          htmlFor="default-range"
          className="w-2/6 ml-3 font-medium text-gray-300 font-roboto text-md dark:text-gray-300"
        >
          {Math.round(parseInt(value))}{" "}
          {label === "Progression lecture bar" ? "%" : "px"}
        </output>
      </div>
    </div>
  );
};

export default Slider;
