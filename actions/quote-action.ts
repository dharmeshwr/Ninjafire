import axios from "axios";
import cron from "node-cron";

let cachedQuote: {
  date: string;
  quote: { q: string; a: string; h: unknown };
} | null = null;

async function fetchQuote() {
  try {
    const { data } = await axios.get("https://zenquotes.io/api/today");
    const quote = data[0];

    cachedQuote = {
      date: new Date().toISOString().slice(0, 10),
      quote,
    };

    return quote;
  } catch (error) {
    console.log(error);
    return {
      q: "Keep going, no matter what.",
      a: "Unknown",
    };
  }
}

export async function getQuote() {
  const today = new Date().toISOString().slice(0, 10);

  if (cachedQuote?.date === today) {
    return cachedQuote.quote;
  }

  console.log("Calling the function", cachedQuote?.date, today);
  return await fetchQuote();
}

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily quote job...");
  await fetchQuote();
});
