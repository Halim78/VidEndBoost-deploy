import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export function formatISODurationToMinutesAndSeconds(duration: string) {
  // RegExp pour extraire les minutes et les secondes
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);

  // Extraire les minutes et les secondes, assigner '00' si non présent
  const minutes = (matches && matches[2]) || "00";
  const seconds = (matches && matches[3]) || "00";

  // Formatter les minutes et les secondes pour toujours afficher deux chiffres
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function getTimeAgo(dateString: string) {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: fr });
}

export function getVideoId(url: string) {
  const urlObj = new URL(url);
  const videoId = urlObj.searchParams.get("v");
  return videoId;
}

export function formatViewCount(views: number) {
  if (views < 1000) {
    return `${views} vues `;
  } else {
    return `${Math.floor(views / 1000)} k vues `;
  }
}

export function formatLikeCount(views: number) {
  if (views < 1000) {
    return `${views} k `;
  } else {
    return `${Math.floor(views / 1000)} k`;
  }
}

export function changeDarkMode() {
  if (localStorage.theme === "dark" || !("theme" in localStorage)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  if (localStorage.theme === "dark") {
    localStorage.theme = "light";
  } else {
    localStorage.theme = "dark";
  }
}
