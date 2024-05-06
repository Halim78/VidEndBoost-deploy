import { changeDarkMode } from "../Utils/ParsingData";
import videoBoostLogo from "/src/assets/videndboost-logo.png";
import moonIcon from "/src/assets/moon.png";
import sunIcon from "/src/assets/sun.png";
import linkedinIcon from "/src/assets/linkedin.png";
// import { useEffect } from "react";

const Header = () => {
  // useEffect(() => {
  //   changeDarkMode();
  // }, []);

  return (
    <div className="flex flex-row justify-between h-16">
      <div className="flex">
        <div className="w-8"></div>
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
      <div className="flex justify-between p-6">
        <div className="flex items-start pt-1 pr-8">
          <img
            src={moonIcon}
            className="cursor-pointer display-none toggle-dark"
            onClick={changeDarkMode}
            height={25}
            width={25}
            alt="icon lune"
          />
          <img
            src={sunIcon}
            className="cursor-pointer toggle-dark"
            onClick={changeDarkMode}
            height={25}
            width={25}
            alt="icon soleil"
          />
        </div>
        <a href="https://www.linkedin.com/in/halim-aktas/" target="_blank">
          <img
            src={linkedinIcon}
            alt="logo linkedin"
            className="h-8 mr-2 cursor-pointer"
          />
        </a>
      </div>
    </div>
  );
};

export default Header;
