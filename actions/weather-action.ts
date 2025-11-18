"use server";

import axios from "axios";
import cron from "node-cron";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_APIKEY });

let cachedWeather: { date: string; summary: string } | null = null;

async function fetchAndSummarizeWeather() {
  try {
    const { data } = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_APIKEY}&q=haryana&aqi=no`,
    );

    const weather = data.current;
    const prompt = `
      The current weather data is:
      ${JSON.stringify(weather, null, 2)}.
      Summarize this weather in one short, natural English phrase (under 10 words)
      that could describe today’s weather to a friend.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 15,
    });

    const summary =
      completion.choices[0].message.content?.trim() ?? "Fair and mild.";

    cachedWeather = {
      date: new Date().toISOString().slice(0, 10),
      summary,
    };

    return summary;
  } catch (error) {
    console.error("Fetch failed:", error);
    return "Fair and mild.";
  }
}

export async function getWeather() {
  if (process.env.NODE_ENV === "development")
    return "Cloudy and cool with light winds";

  const today = new Date().toISOString().slice(0, 10);

  if (cachedWeather?.date === today) {
    return cachedWeather.summary;
  }

  return await fetchAndSummarizeWeather();
}

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily weather job...");
  await fetchAndSummarizeWeather();
});
