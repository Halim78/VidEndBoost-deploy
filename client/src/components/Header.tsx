import { toggleTheme, initializeTheme } from "../Utils/ParsingData";
import videoBoostLogo from "/src/assets/videndboost-logo.png";
import moonIcon from "/src/assets/moon.png";
import sunIcon from "/src/assets/sun.png";
import linkedinIcon from "/src/assets/linkedin.png";
import { useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  useEffect(() => {
    initializeTheme(); // Applique le thème lors du montage du composant
  }, []);
  return (
    <div className="flex flex-row justify-between h-16">
      <div className="flex">
        <div className="w-8 max-md:w-0"></div>
        <img
          src={videoBoostLogo}
          alt="logo videndboost"
          className="w-20 h-20 p-3"
        />
        <h2 className="py-8 pl-0 font-sans text-xl font-bold tracking-wider font-poppins text-rose-400 ">
          <span className="text-xl font-bold tracking-wider font-poppins text-rose-400">
            V
          </span>
          id
          <span className="font-bold tracking-wider text-1xl font-poppins text-rose-400">
            E
          </span>
          nd
          <span className="font-bold tracking-wider text-1xl font-poppins text-rose-400">
            B
          </span>
          oost
          <span className="loader max-md:h-2 max-md:w-2"></span>
        </h2>
      </div>
      <div className="hidden sm:contents">
        <LanguageSwitcher />
      </div>

      <div className="flex justify-between p-6">
        <div className="flex items-start pt-1 pr-8">
          <img
            src={moonIcon}
            className="cursor-pointer toggle-dark"
            onClick={toggleTheme}
            height={20}
            width={20}
            alt="icon lune"
          />
          <img
            src={sunIcon}
            className="cursor-pointer display-none toggle-dark"
            onClick={toggleTheme}
            height={20}
            width={20}
            alt="icon soleil"
          />
        </div>
        <div className="flex flex-col items-end justify-between">
          <a
            href="https://www.linkedin.com/in/halim-aktas/"
            target="_blank"
            className="mb-2"
          >
            <img
              src={linkedinIcon}
              alt="logo linkedin"
              className="h-8 mr-2 cursor-pointer"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
