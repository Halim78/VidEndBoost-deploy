import { useEffect, useRef, useState } from "react";
import CustomSwitch from "./CustomSwitch";
import Slider from "./Slider";
import { ImageUp } from "lucide-react";
import CustomButton from "./CustomButton";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import html2canvas from "html2canvas";
import "react-toastify/dist/ReactToastify.css";
import telechargerIcon from "/src/assets/telecharger.png";
import copierIcon from "/src/assets/copie.png";
// import axios from "axios";
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
import LanguageSwitcher from "./LanguageSwitcher";
import AccordionParameters from "./AccordionParameters";
import ShineBorder from "./magicui/shine-border";
import DotPattern from "./magicui/dot-pattern";
import { cn } from "../Utils/lib";
import { toast, ToastContainer } from "react-toastify";
import { InfiniteCard } from "./InfiniteCard";
// import RemoveBg from "./RemoveBg.jsx";

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
        notify("⚠️ Network response was not ok");
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
      setIsBlob(false);

      handleNewSwitchChange(
        "videoImage",
        finalData.snippet.thumbnails.high.url
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
  const [isBlob, setIsBlob] = useState(false);

  //*** Télécharger la card ***
  const handleDownload = () => {
    if (!divRef.current || !imgRef.current) {
      console.error("Références à la div ou à l'image manquantes");
      return;
    }

    const currentSrc = imgRef.current.src;
    imgRef.current.src = transformImageUrl(currentSrc);

    const divElement = divRef.current;
    const imgElement = imgRef.current;

    notify("⌛ Téléchargement en cours");

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
        })
        .catch((err) => {
          console.error("Erreur lors de la capture de la div:", err);
        });
    }, 800); // Délai pour le rechargement de l'image
  };

  //*** Copier la card dans le press papier ***
  const handleCopyToClipboard = () => {
    if (!divRef.current || !imgRef.current) {
      console.error("Références à la div ou à l'image manquantes");
      return;
    }
    notify("⌛ Copie en cours");
    const currentSrc = imgRef.current.src;
    !isBlob ? (imgRef.current.src = transformImageUrl(currentSrc)) : null;
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
              toast.dismiss();
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
        }, 1000000);
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

  //*** GESTION DU LOCALSTORAGE ***
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

  // ***COMPOSANT UPLOAD IMAGE***
  const UploadImage = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Renommer le fichier
      const newFile = new File([file], "renamed_image.png", {
        type: file.type,
      });

      // Créer un URL pour le Blob
      const imageUrl = URL.createObjectURL(newFile);
      handleNewSwitchChange("videoImage", imageUrl);
      setIsBlob(true);
    };

    const triggerFileInput = () => {
      fileInputRef.current?.click();
    };

    return (
      <div
        onClick={triggerFileInput}
        className="flex justify-between p-3 bg-gray-200 rounded-lg cursor-pointer h-14"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <div className="flex p-1 rounded-lg cursor-pointer">
          <span className="pr-5 tracking-wider">{t("upload-image")}</span>
        </div>
        <ImageUp color={"#e580d8"} size={"35"} />
      </div>
    );
  };

  //*** REQUETE REMOVE.BG ***
  // const handleRemoveBackground = async () => {
  //   if (!imgRef.current) return;

  //   const REMOVEBG_APIKEY = import.meta.env.VITE_REMOVEBG_API_KEY;
  //   const imageElement = imgRef.current;

  //   try {
  //     const response = await fetch(
  //       `https://vid-end-boost-deploy-server.vercel.app/image-proxy?url=${encodeURIComponent(
  //         imageElement.src
  //       )}`
  //     );
  //     const blob = await response.blob();
  //     const formData = new FormData();
  //     formData.append("image_file", blob, "image.png");

  //     const removeBgResponse = await axios.post(
  //       "https://api.remove.bg/v1.0/removebg",
  //       formData,
  //       {
  //         headers: {
  //           "X-Api-Key": REMOVEBG_APIKEY,
  //         },
  //         responseType: "blob",
  //       }
  //     );

  //     const imageBlob = removeBgResponse.data;
  //     const imageObjectURL = URL.createObjectURL(imageBlob);
  //     setProcessedImage(imageObjectURL);
  //     handleNewSwitchChange("videoImage", imageObjectURL);
  //   } catch (error) {
  //     notify("⚠️ Erreur lors de la suppression de l'arrière-plan");
  //     console.error("Erreur lors de la suppression de l'arrière-plan:", error);
  //   }
  // };

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
    <div className="relative">
      <div className="mt-20 mb-2 max-lg:mt-10">
        <h1 className="text-5xl leading-normal tracking-wider text-white max-md:mt-16 max-md:text-3xl max-md:mx-10 mx-md:mb-6">
          <span className="text-black dark:text-white">{t("title")}</span>
          <br />
          <span className="text-black dark:text-white">
            {t("title-second-ligne")}
          </span>
          <br />
          <span className="text-black dark:text-white">
            {t("title-union-word")}
            <span className="p-4 text-5xl font-bold text-center text-transparent max-md:text-4xl from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text">
              VidEndBoost
            </span>
          </span>
        </h1>
      </div>
      <h2 className="mt-6 font-normal tracking-wider text-gray-300">
        {t("subtitle")}
        <br /> {t("subtitle-second-ligne")}
      </h2>
      {/*INPUT YT VIDEO*/}
      <div className="flex justify-center mt-20 max-md:mt-14 max-md:mx-2">
        <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
          <div className="flex items-end max-sm:items-center max-md:flex-col ">
            <label className="block pr-2 mr-6 text-xl tracking-wider text-black max-sm:pr-0 dark:text-white max-md:pb-2">
              {t("input-label")}
              <span className="ml-2 text-2xl font-bold text-red-500 opacity-90">
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
                className="max-w-md px-3 py-1 text-base font-normal text-black border-2 rounded-md max-md:py-0 w-96 focus:outline-none focus:border-purple-500"
                placeholder={placeholder}
              />
              {isLoading && <LinearProgressBar />}
            </div>
          </div>
        </ShineBorder>
      </div>
      {/*BODY */}
      <div className="relative flex w-full mt-28 max-lg:flex-col h-2/3 max-lg:mt-16">
        {/*Bloc Gauche */}
        <div className="flex items-start justify-around w-1/2 pt-1 max-lg:w-auto max-md:flex-col max-lg:items-center">
          <div
          // className="absolute pointer-events-none h-full w-2/5 bg-[linear-gradient(to_right,#b1b1b12e_1px,transparent_1px),linear-gradient(to_bottom,#b1b1b12e_1px,transparent_1px)] bg-[size:18px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_10%,transparent_100%)]"
          ></div>
          <DotPattern
            height={"20px"}
            className={cn(
              "[mask-image:radial-gradient(200px_circle_at_center,white,transparent)] absolute  h-full w-3/5"
            )}
          />
          <div>
            <div className="flex justify-between">
              <h3 className="pb-4 text-3xl font-medium tracking-wider text-left text-black max-md:text-xl dark:text-white">
                {t("parameters-title")}
              </h3>
              <div className="block sm:hidden">
                <LanguageSwitcher />
              </div>
            </div>
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
            <div className="flex flex-col w-auto gap-6">
              <AccordionParameters title={t("display-settings")}>
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
              </AccordionParameters>
              <AccordionParameters title={t("design-settings")}>
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
                </div>
              </AccordionParameters>
              <UploadImage />
              {/* <RemoveBg handleRemoveBackground={handleRemoveBackground} /> */}
            </div>
          </div>
          <div className="flex flex-col w-1/3 mt-16 max-md:w-2/3 max-sm:flex-row max-sm:justify-center">
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
        {/*Bloc Droite */}
        <div
          className="flex items-center justify-center w-1/2 border-pinkBorderCard border-y-2 dark:border-borderGrayOpac max-lg:w-auto max-md:py-8 max-lg:py-16"
          style={{
            borderTopWidth: "2px",
            borderBottomWidth: "2px",
            // marginTop: `${
            //   switchesSlidersState.modelSelectedIndex === 0 ? "60px" : "145px"
            // }`,
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
                    maxHeight: "336px",
                    maxWidth: "448px",
                  }}
                  src={
                    // processedImage
                    //   ? processedImage
                    //   :
                    switchesSlidersState.videoImage
                  }
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
      {/*A gérer ici le souci du botoom border*/}
      <div className="h-[20rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <InfiniteCard items={testimonials} direction="right" speed="slow" />
      </div>
      <div className="h-12"></div>
      <ToastContainer />
      <span className="absolute text-gray-300 max-lg:hidden bottom-3 right-6">
        V.1.5
      </span>
    </div>
  );
};

export default HomeNew;

const testimonials = [
  {
    question: "Qu’est ce qu’une miniature YouTube ?",
    quote:
      "Les miniatures YouTube sont ces petits aperçus visuels utilisés pour représenter les vidéos YouTube. On parle parfois d’image YouTube, de vignette YouTube, d’icône YouTube ou encore de YouTube thumbnail. Quel que soit le nom qu’on lui donne, une miniature YouTube vise à attirer l’attention des gens et à les inciter à regarder une vidéo. Pensez aux vignettes YouTube comme à des couvertures de livres. Il s’agit d’une mini représentation du contenu de votre vidéo, une sorte de bande-annonce fixe.",
  },
  {
    question: "Pourquoi les miniatures YouTube sont-elles importantes ?",
    quote:
      "Heureusement, YouTube vous permet de customiser vos miniatures et de publier des miniatures personnalisées. Lorsque vous téléchargez une vidéo, la plateforme prend automatiquement trois images de votre vidéo pour les utiliser comme vignettes. Mais il est préférable de créer les vôtres avec des outils comme VidEndBoost.",
  },
  {
    question: "Pourquoi une bonne vignette est essentielle ?",
    quote:
      "Une vignette YouTube efficace n'est pas seulement une image ; c'est un aperçu de votre vidéo, une promesse visuelle qui attire l'attention et suscite la curiosité. Elle doit refléter le contenu de votre vidéo tout en étant suffisamment intrigante pour encourager les clics.",
  },
  {
    question: "Créez des miniatures YouTube remarquables qui boost vos vues",
    quote:
      "Après avoir investi du temps et des efforts pour filmer et monter une vidéo exceptionnelle, vous souhaitez la présenter sous son meilleur jour. La vignette de votre vidéo est la première chose que votre audience verra, et elle doit refléter la qualité de votre contenu. Imaginez encapsuler l'essence de votre vidéo en une seule image accrocheuse qui incite les spectateurs à cliquer et à regarder. C'est exactement ce que vous pouvez réaliser avec Videndboost. Nos outils intuitifs vous permettent de concevoir des miniatures professionnelles qui captivent instantanément l'attention.",
  },
  {
    question: "Attirez l'attention avec des miniatures YouTube irrésistibles",
    quote:
      "Faire en sorte que votre public ne puisse pas résister à cliquer sur votre vignette YouTube est essentiel pour augmenter vos vues. Avec Videndboost, créer une miniature YouTube captivante devient un jeu d'enfant. Essayez-le maintenant et voyez la différence !",
  },
  {
    question: "Comment Obtenir plus de Vues sur YouTube ?",
    quote:
      "Obtenir plus de vues sur YouTube est essentiel pour faire croître votre chaîne et atteindre un public plus large. Voici quelques stratégies efficaces pour augmenter vos vues de manière authentique : Créez du Contenu de Qualité,  Optimisez vos Titres et Descriptions et Utilisez des Miniatures Accrocheuses",
  },
  {
    question: "5 astuces pour booster vos vues Youtube",
    quote: `Utiliser des mots clés pertinents dans le titre et la description de vos vidéos, Optimiser les miniatures de vos vidéos pour augmenter l’engagement des spectateurs, Partager vos vidéos sur les réseaux sociaux et les forums, Collaborer avec d’autres créateurs de contenu pour atteindre de nouveaux publics et Analyser les statistiques de vos impressions YouTube pour optimiser votre stratégie de contenu`,
  },
  {
    question: "Comment Videndboost peut vous aider ?",
    quote:
      "Avec Videndboost, vous avez accès à une gamme d'outils de conception intuitifs qui vous permettent de créer des vignettes impressionnantes sans effort pour booster vos vues. Que vous soyez un débutant ou un professionnel, nos fonctionnalités vous aideront à transformer vos idées en vignettes visuellement saisissantes. Ne laissez pas vos vidéos passer inaperçues. Utilisez Videndboost pour créer des miniatures YouTube irrésistibles qui boostent vos vues et attirent plus de spectateurs vers votre contenu de qualité. Essayez Videndboost aujourd'hui et donnez à vos vidéos l'attention qu'elles méritent.",
  },
];
