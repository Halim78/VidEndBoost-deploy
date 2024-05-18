import { useEffect, useRef, useState } from "react";
import CustomSwitch from "./CustomSwitch";
import Header from "./Header";
import Slider from "./Slider";
import CustomButton from "./CustomButton";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import html2canvas from "html2canvas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import telechargerIcon from "/src/assets/telecharger.png";
import copierIcon from "/src/assets/copie.png";
import {
  formatISODurationToMinutesAndSeconds,
  getTimeAgo,
  getVideoId,
  formatViewCount,
  formatLikeCount,
} from "../Utils/ParsingData";
import "react-toastify/dist/ReactToastify.css";
import CustomSkeleton from "./CustomSkeleton";
import LinearProgressBar from "./LinearProgressBar";
import { useTranslation } from "react-i18next";

const HomeNew = () => {
  const YOUTUBE_APIKEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const [placeholder, setPlaceholder] = useState("");
  const fullText = "htttps://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const charIndex = useRef(0);
  const typingTimeout = useRef(0);

  const [isLoading, setIsLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isToastActive, setIsToastActive] = useState(false);

  //Toast notification
  const notify = (label: string) => {
    if (!isToastActive) {
      toast(label, {
        autoClose: 1500,
        onClose: () => setIsToastActive(false),
        onOpen: () => setIsToastActive(true),
      });
    }
  };

  const handleChange = (value: string) => {
    console.log(youtubeUrl);
    setPlaceholder(value);
    setYoutubeUrl(value);
    if (!value.startsWith("https://")) {
      notify("⚠️ Adresse Invalide");
      return null;
    }
    const videoId: string | null = getVideoId(value);
    if (videoId) {
      fetchYouTubeVideo(videoId);
    }
  };

  const transformImageUrl = (videoImage: string) => {
    const proxyUrl = `https://vid-end-boost-deploy-server.vercel.app/image-proxy?url=${encodeURIComponent(
      videoImage
    )}`;
    return proxyUrl;
  };

  //FETCH youtube channel
  const fetchYouTubeChannel = async (channelId: string) => {
    const apiKey = YOUTUBE_APIKEY;
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      handleNewSwitchChange(
        "channelImage",
        data.items[0].snippet.thumbnails.default.url
      );
      return data;
    } catch (error) {
      console.error("Error fetching YouTube channel data: ", error);
    }
  };

  //FETCH video Youtube
  const fetchYouTubeVideo = async (videoId: string) => {
    setIsLoading(true);
    const apiKey = YOUTUBE_APIKEY;
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        setIsLoading(false);
        notify("🔥 Error lors de la récupération ...");
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const finalData = data.items[0];
      setIsLoading(false);

      handleNewSwitchChange(
        "videoImage",
        finalData.snippet.thumbnails.maxres.url
      );
      handleNewSwitchChange(
        "channelImage",
        finalData.snippet.thumbnails.maxres.url
      );
      handleNewSwitchChange("channelTitle", finalData.snippet.channelTitle);
      handleNewSwitchChange("title", finalData.snippet.title);
      handleNewSwitchChange(
        "durationVideo",
        formatISODurationToMinutesAndSeconds(
          data.items[0].contentDetails.duration
        )
      );
      handleNewSwitchChange(
        "likeCount",
        formatLikeCount(finalData.statistics.likeCount)
      );
      handleNewSwitchChange(
        "viewCount",
        formatViewCount(finalData.statistics.viewCount)
      );
      handleNewSwitchChange(
        "publicationVideoDate",
        getTimeAgo(data.items[0].snippet.publishedAt)
      );

      fetchYouTubeChannel(data.items[0].snippet.channelId);

      return data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      notify("🔥 Error lors de la récupération ...");
    }
  };

  const divRef = useRef(null);
  const imgRef = useRef<HTMLImageElement>(null);

  //Télécharger la card
  const handleDownload = () => {
    if (!divRef.current || !imgRef.current) {
      console.error("Références à la div ou à l'image manquantes");
      return;
    }

    const currentSrc = imgRef.current.src;
    imgRef.current.src = transformImageUrl(currentSrc);

    const divElement = divRef.current;
    const imgElement = imgRef.current;

    // Attendre un peu pour que l'image soit rechargée via le proxy
    setTimeout(() => {
      html2canvas(divElement, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      })
        .then((canvas) => {
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = image;
          link.download = switchesSlidersState.title + ".png"; // Le nom sous lequel l'image sera téléchargée
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          imgElement.src = switchesSlidersState.videoImage;
          notify("🦄 Téléchargement réussi");
        })
        .catch((err) => {
          console.error("Erreur lors de la capture de la div:", err);
        });
    }, 800); // Délai pour le rechargement de l'image
  };

  //Copier la card dans le press papier
  const handleCopyToClipboard = () => {
    if (!divRef.current || !imgRef.current) {
      console.error("Références à la div ou à l'image manquantes");
      return;
    }

    const currentSrc = imgRef.current.src;
    imgRef.current.src = transformImageUrl(currentSrc);

    const divElement = divRef.current;
    const imgElement = imgRef.current;

    // Attendre un peu pour que l'image soit rechargée via le proxy
    setTimeout(() => {
      html2canvas(divElement, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      })
        .then((canvas) => {
          canvas.toBlob((blob) => {
            if (blob) {
              navigator.clipboard
                .write([new ClipboardItem({ "image/png": blob })])
                .then(() => console.log("Image copiée dans le presse-papier!"))
                .catch((err) =>
                  console.error(
                    "Impossible de copier l'image dans le presse-papier:",
                    err
                  )
                );
              notify("Copié");
            } else {
              console.error("Impossible de créer un blob à partir du canvas");
            }
            imgElement.src = currentSrc; // Remettre l'URL originale de l'image si nécessaire
          }, "image/png");
        })
        .catch((err) => {
          console.error("Erreur lors de la capture de la div:", err);
        });
    }, 800); // Délai pour le rechargement de l'image
  };

  useEffect(() => {
    const typeWriter = () => {
      if (charIndex.current < fullText.length) {
        setPlaceholder((prev) => prev + fullText[charIndex.current]);
        charIndex.current++;
      } else {
        typingTimeout.current = setTimeout(() => {
          setPlaceholder("");
          charIndex.current = 0;
        }, 1000000); // Attendre 2 secondes avant de recommencer
      }
    };

    const intervalId = setInterval(typeWriter, 250); // Vitesse de frappe

    return () => {
      clearInterval(intervalId);
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  //GESTION DU LOCALSTORAGE
  const defaultSwitchesSlidersState = {
    duration: false,
    lectureBar: false,
    chaineLogo: true,
    chaineName: true,
    vues: false,
    publicationDate: false,
    like: false,
    darkTheme: false,
    progressBar: "30",
    borderRadius: "16",
    spacement: "20",
    policeSize: "20",
    modelSelectedDisplay: "col",
    modelSelectedIndex: 0,
    youtubeVideoPath: "",
    channelTitle: "Benjamin Code",
    title: "Quel abonné codera la meilleure solution ?",
    durationVideo: "16:30",
    likeCount: "1,5k",
    viewCount: "19 k vues",
    publicationVideoDate: "il y a 1 mois",
    channelImage:
      "https://yt3.ggpht.com/ytc/AIdro_ladyg5fV6ymBjPWBVtxYT06g8wSVa4-wnvez7kd9T-Ums=s88-c-k-c0x00ffffff-no-rj",
    videoImage: "https://i.ytimg.com/vi/f7_CHu0ADhM/maxresdefault.jpg",
    showTitle: true,
  };
  const loadSettings = () => {
    const savedSettings = localStorage.getItem("userSettings");
    const settingsFromStorage = savedSettings ? JSON.parse(savedSettings) : {};

    const queryParams = new URLSearchParams(window.location.search);

    type SettingsProps = {
      [key: string]: boolean | number | string;
    };

    const settingsFromURL: SettingsProps = Object.keys(
      defaultSwitchesSlidersState
    ).reduce((acc: SettingsProps, key: string) => {
      const value = queryParams.get(key);
      if (value !== null) {
        acc[key] = value === "true" ? true : value === "false" ? false : value;
      }
      return acc;
    }, {});

    // Combine settings from URL and storage, fallback to default values
    return {
      ...defaultSwitchesSlidersState,
      ...settingsFromStorage,
      ...settingsFromURL,
    };
  };

  const [switchesSlidersState, setSwitchesSlidersState] =
    useState(loadSettings);

  const handleNewSwitchChange = (
    switchName: string,
    newValue: string | boolean | number
  ) => {
    setSwitchesSlidersState((prevState: typeof switchesSlidersState) => {
      const newState = { ...prevState, [switchName]: newValue };
      localStorage.setItem("userSettings", JSON.stringify(newState));
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set(switchName, newValue.toString());
      window.history.replaceState(null, "", `?${queryParams.toString()}`);
      return newState;
    });
  };

  useEffect(() => {
    setYoutubeUrl(switchesSlidersState.youtubeVideoPath);
  }, [switchesSlidersState.youtubeVideoPath]);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    // Ajout de chaque état de switch comme paramètre
    Object.entries(switchesSlidersState).forEach(([key, value]) => {
      queryParams.set(key, (value ?? "").toString());
    });
    // Mise à jour de l'URL
    window.history.replaceState(null, "", `?${queryParams.toString()}`);
  }, [switchesSlidersState]);

  const hiddenClass =
    !switchesSlidersState.chaineLogo &&
    !switchesSlidersState.chaineName &&
    !switchesSlidersState.vues &&
    !switchesSlidersState.like &&
    !switchesSlidersState.publicationDate &&
    switchesSlidersState.showTitle
      ? "hidden"
      : "";
  const { t } = useTranslation();

  return (
    <div>
      <Header />
      <div className="mt-0 mb-2 max-lg:mt-10 ">
        <h1 className="text-5xl leading-normal tracking-wider text-white max-md:mt-16 max-md:text-3xl ">
          <span className="text-black dark:text-white">{t("title")}</span>
          <br />
          <span className="text-black dark:text-white">
            {t("title-union-word")}
            <span className="p-4 text-5xl font-bold text-center text-transparent max-md:text-4xl from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text">
              VidEndBoost
            </span>
          </span>
        </h1>
      </div>
      <div className="flex justify-center mt-10 max-md:mt-14">
        <div className="flex items-end max-md:flex-col">
          <label className="block pr-2 text-xl tracking-wider text-black dark:text-white ">
            {t("input-label")}
            <span className="text-2xl font-bold text-red-500 opacity-90">
              YouTube
            </span>
          </label>
          <div>
            <input
              id="typing-input"
              type="text"
              value={switchesSlidersState.youtubeVideoPath}
              onChange={(e) => {
                handleChange(e.target.value);
                handleNewSwitchChange("youtubeVideoPath", e.target.value);
              }}
              className="max-w-md px-3 py-1 text-base font-normal border-2 rounded-md max-md:py-0 w-96 focus:outline-none focus:border-purple-500"
              placeholder={placeholder}
            />
            {isLoading && <LinearProgressBar />}
          </div>
        </div>
      </div>
      <div className="absolute flex w-full mt-4 max-lg:flex-col h-2/3 max-lg:mt-16">
        {/*Bloc Gauche */}
        <div className="flex items-center justify-around w-1/2 pt-1 max-lg:w-auto max-md:flex-col ">
          <div className="absolute pointer-events-none h-full w-2/5 bg-[linear-gradient(to_right,#b1b1b12e_1px,transparent_1px),linear-gradient(to_bottom,#b1b1b12e_1px,transparent_1px)] bg-[size:18px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_10%,transparent_100%)]"></div>
          <div>
            <h2 className="pb-4 text-3xl font-medium tracking-wider text-left text-black max-md:text-xl dark:text-white">
              {t("parameters-title")}
            </h2>
            <div
              className="w-full fading-line"
              style={{
                width: "100%",
                height: "5px" /* Hauteur de la ligne */,
                background:
                  "linear-gradient(to right, pink, rgba(255, 255, 255, 0))",
                borderTopLeftRadius: "2px",
                borderBottomLeftRadius: "2px",
              }}
            ></div>
            <br />
            <br />
            <div className="flex w-auto">
              <div>
                <CustomSwitch
                  isActive={switchesSlidersState.duration}
                  onToggle={(newValue) =>
                    handleNewSwitchChange("duration", newValue)
                  }
                  title={t("display-video-time")}
                />
                <CustomSwitch
                  isActive={switchesSlidersState.lectureBar}
                  onToggle={(newValue) =>
                    handleNewSwitchChange("lectureBar", newValue)
                  }
                  title={t("display-read-bar")}
                />
                <CustomSwitch
                  isActive={switchesSlidersState.chaineLogo}
                  onToggle={(newValue) =>
                    handleNewSwitchChange("chaineLogo", newValue)
                  }
                  title={t("display-logo")}
                />
                <CustomSwitch
                  isActive={switchesSlidersState.chaineName}
                  onToggle={(newValue) =>
                    handleNewSwitchChange("chaineName", newValue)
                  }
                  title={t("display-channel")}
                />
                <CustomSwitch
                  isActive={switchesSlidersState.vues}
                  onToggle={(newValue) =>
                    handleNewSwitchChange("vues", newValue)
                  }
                  title={t("display-vues")}
                />
                <CustomSwitch
                  isActive={switchesSlidersState.publicationDate}
                  onToggle={(newValue) =>
                    handleNewSwitchChange("publicationDate", newValue)
                  }
                  title={t("display-publication")}
                />
                <CustomSwitch
                  isActive={switchesSlidersState.like}
                  onToggle={(newValue) =>
                    handleNewSwitchChange("like", newValue)
                  }
                  title={t("display-likes")}
                />
                <CustomSwitch
                  isActive={switchesSlidersState.showTitle}
                  onToggle={(newValue) =>
                    handleNewSwitchChange("showTitle", newValue)
                  }
                  title={t("display-image")}
                />
                <CustomSwitch
                  isActive={switchesSlidersState.darkTheme}
                  onToggle={(newValue) =>
                    handleNewSwitchChange("darkTheme", newValue)
                  }
                  title={t("display-theme")}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/3 mt-16 max-md:w-2/3 max-sm:flex-row max-sm:justify-center">
            <div>
              <Slider
                value={switchesSlidersState.progressBar}
                max={switchesSlidersState.durationVideo}
                min="0"
                onChange={(newValue) =>
                  handleNewSwitchChange("progressBar", newValue)
                }
                label={t("read-bar")}
              />
              <Slider
                value={switchesSlidersState.borderRadius}
                max={"100"}
                min="0"
                onChange={(newValue) =>
                  handleNewSwitchChange("borderRadius", newValue)
                }
                label={t("border-radius")}
              />
              <Slider
                value={switchesSlidersState.spacement}
                max={"70"}
                min="0"
                onChange={(newValue) =>
                  handleNewSwitchChange("spacement", newValue)
                }
                label={t("spacing")}
              />
              <Slider
                value={switchesSlidersState.policeSize}
                max={"30"}
                onChange={(newValue) =>
                  handleNewSwitchChange("policeSize", newValue)
                }
                label={t("title-size")}
              />
              <div className="flex-col items-center justify-center w-full m-8 mx-auto">
                <div className="flex flex-col items-start justify-center">
                  <span className="pb-2 pr-2 tracking-wider text-black dark:text-white text-start text-md font-semi-bold">
                    {t("model-choose")}
                  </span>
                  <div className="flex items-center">
                    {[0, 1].map((index) => (
                      <CustomSkeleton
                        key={index}
                        type={index === 0 ? "col" : "row"}
                        isSelected={
                          switchesSlidersState.modelSelectedIndex === index
                            ? true
                            : false
                        }
                        onSkeletonChange={() => {
                          handleNewSwitchChange(
                            "modelSelectedDisplay",
                            index === 0 ? "col" : "row"
                          );
                          handleNewSwitchChange("modelSelectedIndex", index);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Bloc Droite */}
        <div
          className="flex items-center justify-center w-1/2 border-pinkBorderCard border-y-2 dark:border-borderGrayOpac max-lg:w-auto max-md:py-8 max-lg:py-16"
          style={{
            borderTopWidth: "2px",
            borderBottomWidth: "2px",
            marginTop: `${
              switchesSlidersState.modelSelectedIndex === 0 ? "60px" : "145px"
            }`,
            marginBottom: `${
              switchesSlidersState.modelSelectedIndex === 0 ? "75px" : "170px"
            }`,
          }}
        >
          <div className="flex flex-col border-pinkBorderCard dark:border-borderGrayOpac border-x-20 ">
            <div className="h-16"></div>
            <div
              ref={divRef}
              className={`flex relative flex-${switchesSlidersState.modelSelectedDisplay} items-start justify-center mx-8 overflow-hidden bg-transparent
               shadow-lg h-1/2`}
              style={{
                padding: `${switchesSlidersState.spacement}px`,
                borderRadius: `${
                  parseInt(switchesSlidersState.borderRadius) +
                  parseInt(switchesSlidersState.spacement)
                }px`,
                backgroundColor: `${
                  switchesSlidersState.darkTheme === true ? "black" : "white"
                }`,
                boxShadow: `${
                  switchesSlidersState.darkTheme === true
                    ? "0px 0px 25px 0px white"
                    : "0px 0px 25px 0px gray"
                }`,
              }}
            >
              <div
                className="relative w-full max-w-md overflow-hidden"
                style={{
                  borderRadius: `${switchesSlidersState.borderRadius}px`,
                }}
              >
                <img
                  ref={imgRef}
                  className="w-full"
                  style={{
                    borderRadius: `${switchesSlidersState.borderRadius}px`,
                  }}
                  src={switchesSlidersState.videoImage}
                  alt="Image de la vidéo YouTube"
                />
                {switchesSlidersState.showTitle && (
                  <div
                    className="absolute top-0 left-0 w-full p-2 font-bold tracking-wider text-white bg-black bg-opacity-50 gradient-bg font-roboto"
                    style={{
                      fontSize: `${switchesSlidersState.policeSize}px`,
                      textAlign: "center",
                    }}
                  >
                    {switchesSlidersState.title}
                  </div>
                )}
                {/* Conteneur de la barre de progression avec arrondis en bas */}
                {switchesSlidersState.lectureBar && (
                  <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden bg-gray-300 rounded-b-xl">
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${switchesSlidersState.progressBar}%` }}
                    ></div>{" "}
                  </div>
                )}
                {/* Durée de la vidéo */}
                {switchesSlidersState.duration && (
                  <div className="absolute right-2 bottom-2 bg-gray-800 bg-opacity-65 text-white text-xs px-1 py-0.5 rounded">
                    <span>{switchesSlidersState.durationVideo}</span>
                  </div>
                )}
              </div>

              <div className={`w-full ${hiddenClass}`}>
                <div className="flex items-start pt-2 pl-1.5">
                  {switchesSlidersState.chaineLogo && (
                    <img
                      className="w-8 h-8 rounded-2xl"
                      src={switchesSlidersState.channelImage}
                      alt="Icon chaîne YouTube"
                    />
                  )}
                  <div className="flex flex-col max-w-sm pl-2">
                    {switchesSlidersState.showTitle ? null : (
                      <span
                        className={`pb-1 font-roboto font-bold text-${
                          switchesSlidersState.darkTheme === true
                            ? "white"
                            : "black"
                        }`}
                        style={{
                          fontSize: `${switchesSlidersState.policeSize}px`,
                          textAlign: "left",
                        }}
                      >
                        {!switchesSlidersState.showTitle &&
                          switchesSlidersState.title}
                      </span>
                    )}
                    <div
                      className={`flex justify-${
                        switchesSlidersState.chaineName === false
                          ? "end"
                          : "between"
                      }`}
                    >
                      {switchesSlidersState.chaineName && (
                        <span className="mt-1 text-sm font-medium text-subTitleGray font-roboto ">
                          {switchesSlidersState.channelTitle}
                        </span>
                      )}
                      {switchesSlidersState.like && (
                        //right-3p bottom-36P
                        <div
                          className={`absolute flex right-5p bottom-${
                            switchesSlidersState.type === "row" ? "36p" : "6p"
                          } max-w-sm:right-4p max-w-sm:bottom-36p`}
                        >
                          <button className="flex items-center px-3 py-1 text-white bg-gray-500 rounded-full pointer-events-none w-17 h-9">
                            <ThumbUpOffAltIcon sx={{ fontSize: 20 }} />
                            <span className="p-0 ml-2 text-xs font-bold">
                              {switchesSlidersState.likeCount}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex ">
                      {switchesSlidersState.vues && (
                        <span className="text-sm font-medium text-subTitleGray font-roboto ">
                          {switchesSlidersState.viewCount}
                        </span>
                      )}
                      {switchesSlidersState.publicationDate &&
                        switchesSlidersState.vues && (
                          <span className="px-1 text-sm font-medium text-subTitleGray font-roboto">
                            {" "}
                            .{" "}
                          </span>
                        )}
                      {switchesSlidersState.publicationDate && (
                        <>
                          <span className="text-sm font-medium text-subTitleGray font-roboto ">
                            {switchesSlidersState.publicationVideoDate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-10">
              <CustomButton
                pathIcon={telechargerIcon}
                onClick={handleDownload}
                label={t("download-card")}
              />
              <div className="w-8"></div>
              <CustomButton
                pathIcon={copierIcon}
                onClick={handleCopyToClipboard}
                label={t("copy-card")}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <span className="absolute text-gray-300 max-lg:hidden bottom-3 right-6">
        V.1
      </span>
    </div>
  );
};

export default HomeNew;
