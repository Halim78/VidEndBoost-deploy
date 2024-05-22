import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const [isChecked, setIsChecked] = useState(language === "fr");

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked: boolean) => {
      const newChecked = !prevChecked;
      const newLanguage = newChecked ? "fr" : "en";
      changeLanguage(newLanguage);
      return newChecked;
    });
  };

  return (
    <>
      <label
        className={`relative inline-flex items-center justify-center p-1 bg-white dark:bg-black rounded-sm cursor-pointer select-none themeSwitcherTwo shadow-card`}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span
          className={`flex items-center space-x-[2px] rounded py-0 px-[8px] text-sm font-medium ${
            isChecked
              ? "text-primary bg-[#010101] dark:bg-white"
              : "text-body-color"
          }`}
        >
          <span className="text-gray-300 dark:text-gray-500">Fr</span>
        </span>
        <span
          className={`flex items-center space-x-[2px] rounded py-0 px-[8px] text-sm font-medium ${
            !isChecked
              ? "text-primary bg-[#010101] dark:bg-white"
              : "text-body-color"
          }`}
        >
          <span className="text-gray-300 dark:text-gray-500">En</span>
        </span>
      </label>
    </>
  );
};

export default LanguageSwitcher;
