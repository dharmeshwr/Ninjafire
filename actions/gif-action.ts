"use server";

import axios from "axios";

export const getGIF = async () => {
  const keywords = ["one+piece", "bleach+anime", "bankai", "jujustu+kaisen"];

  const selectedKeywords = keywords[Math.floor(Math.random() * 4)];

  try {
    const { data } = await axios.get(
      `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API_KEY}&tag=${selectedKeywords}&rating=pg-13`,
    );
    return { gif: data.data.images.original.webp };

    // GIPHY API allows only 100 requests per hour, so during dev. please use this static gif
    // return { gif: "https://media0.giphy.com/media/v1.Y2lkPWZlMzI0YWYzZXRmN290eDZrajJycmk2bXdnaXVrdTZ6NWpnYm1sc253ZW5maTgyOCZlcD12MV9naWZzX3JhbmRvbSZjdD1n/ff54BctkWA5ry/giphy.webp" }
  } catch (error) {
    return { error };
  }
};
