"use server";

export interface Anime {
  id: number;
  title: string;
  nextEpisode: {
    number: number;
    date: string;
    unix: number;
  } | null;
}

export async function getAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 10) {
        media(sort: TRENDING_DESC, type: ANIME, status: RELEASING) {
          id
          title {
            english
            romaji
          }
          nextAiringEpisode {
            airingAt          
            episode          
            timeUntilAiring 
          }
        }
      }
    }
  `;

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch trending anime from AniList");
  }

  const json = await res.json();

  return json.data.Page.media.map(
    (anime: any): Anime => ({
      id: anime.id,
      title: anime.title.english || anime.title.romaji,
      nextEpisode: anime.nextAiringEpisode
        ? {
            number: anime.nextAiringEpisode.episode,
            date:
              new Date(anime.nextAiringEpisode.airingAt * 1000).toLocaleString(
                "en-US",
                {
                  timeZone: "Asia/Kolkata",
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              ) + " IST",
            unix: anime.nextAiringEpisode.airingAt,
          }
        : null,
    }),
  );
}
