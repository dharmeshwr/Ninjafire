"use server";

import axios from "axios";

export const getGIFfromTenor = async () => {
  const keywords = ["one+piece", "bleach+anime", "bankai", "jujustu+kaisen"];

  const selectedKeywords =
    keywords[Math.floor(Math.random() * keywords.length)];

  const { data } = await axios.get(
    `https://tenor.googleapis.com/v2/search?q=${selectedKeywords}&key=${process.env.TENOR_API_KEY}&client_key=Ninjafire&random=true&limit=1&contentfilter=off`,
  );

  return { gif: data.results[0].media_formats.tinygif.url };
};

export const getQuote = async () => {
  try {
    const { data } = await axios.get("https://zenquotes.io/api/today");
    return data[0];
  } catch (error) {
    console.error("Fetch failed:", error);
  }
};
