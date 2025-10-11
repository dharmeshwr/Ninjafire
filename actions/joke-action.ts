import axios from "axios";
import cron from "node-cron";

let cachedJoke: { date: string; joke: string } | null = null;

async function fetchJoke() {
  try {
    const { data } = await axios.get(
      "https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky?format=txt&type=single",
    );
    cachedJoke = { date: new Date().toISOString().slice(0, 10), joke: data };
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return "Fair and mild.";
  }
}

export async function getJoke() {
  const today = new Date().toISOString().slice(0, 10);

  if (cachedJoke?.date === today) {
    return cachedJoke.joke;
  }

  return await fetchJoke();
}

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily joke...");
  await fetchJoke();
});
