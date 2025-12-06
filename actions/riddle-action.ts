"use server";

import axios from "axios";
import cron from "node-cron";

let cachedRiddle: { date: string; riddle: string; answer: string } | null =
  null;

async function fetchRiddle() {
  try {
    const { data } = await axios.get(
      "https://api.apileague.com/retrieve-random-riddle?difficulty=easy",
      {
        headers: { "x-api-key": process.env.API_LEAGUE },
      },
    );
    cachedRiddle = {
      date: new Date().toISOString().slice(0, 10),
      riddle: data.riddle,
      answer: data.answer,
    };
    return cachedRiddle;
  } catch (error: any) {
    console.error("Fetch failed:", error.response.data.message);
    return {
      date: new Date().toISOString().slice(0, 10),
      riddle: "I’m tall when I’m young, and I’m short when I’m old. What am I?",
      answer: "A candle",
    };
  }
}

export async function getRiddle() {
  if (process.env.NODE_ENV === "development")
    return {
      date: String(new Date()),
      riddle: "I’m tall when I’m young, and I’m short when I’m old. What am I?",
      answer: "A candle",
    };

  const today = new Date().toISOString().slice(0, 10);

  if (cachedRiddle?.date === today) {
    return cachedRiddle;
  }
  return await fetchRiddle();
}

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily riddle...");
  try {
    await fetchRiddle();
  } catch (error) {
    console.error("Daily riddle prefetch failed:", error);
  }
});
