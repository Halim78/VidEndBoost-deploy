let fetch;

(async () => {
  fetch = (await import("node-fetch")).default;

  const express = require("express");
  const cors = require("cors");
  const app = express();

  app.use(cors());

  app.get("/image-proxy", async (req, res) => {
    const imageUrl = req.query.url;

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch the image: ${response.statusText}`);
      }
      const buffer = await response.buffer();
      res.set("Access-Control-Allow-Origin", "*");

      res.set(
        "Content-Type",
        response.headers.get("Content-Type") || "image/png"
      );
      res.send(buffer);
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).send("Failed to fetch image");
    }
  });

  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
  });
})();
