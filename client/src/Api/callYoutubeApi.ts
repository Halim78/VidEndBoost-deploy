//FETCH youtube channel
export const fetchYouTubeChannel = async (channelId: string) => {
  const apiKey = "AIzaSyAZLZ95D4VubXTr0F6KcokWrZcmmTg0TiY"; // Remplacez par votre clé API
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching YouTube channel data: ", error);
    return `{"Error fetching YouTube channel data:" , ${error}`;
  }
};

//Utilisation dans le composant :
// useEffect(() => {
//     fetchYouTubeChannel(channelId)
//       .then(data => {
//         setChannelImage(data.items[0].snippet.thumbnails.default.url);
//       })
//       .catch(err => {s
//         setError(err.message);
//       });
//   }, [channelId]);

//FETCH video Youtube
export const fetchYouTubeVideo = async (videoId: string) => {
  const apiKey = "AIzaSyAZLZ95D4VubXTr0F6KcokWrZcmmTg0TiY";
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;

  try {
    const response = await fetch(url);

    const data = await response.json();
    const finalData = data.items[0];

    fetchYouTubeChannel(finalData.snippet.channelId);

    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return `{"Error fetching YouTube vidéo:" , ${error}`;
  }
};
