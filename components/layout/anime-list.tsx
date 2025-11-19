import { getAnime } from "@/actions/anime-action";
import Balancer from "react-wrap-balancer";

export async function AnimeBroadcast() {
  const trending = await getAnime();
  const filteredAnime = trending
    .filter((anime) => anime.title.length < 40)
    .slice(0, 5);

  return (
    <div className="border-2 border-black p-1">
      <h1 className="mb-4 font-schwachsinn text-5xl">
        Next Broadcasting of your favorite anime
      </h1>
      <div className="*:border-black max-[700px]:[&>*:not(:last-child)]:border-b-2">
        {filteredAnime.map((anime) => (
          <div
            key={anime.id}
            className="mb-3 grid-cols-3 gap-x-2 min-[700px]:grid min-[1550px]:grid-cols-4"
          >
            <div className="place-content-center font-bold min-[1550px]:col-span-2">
              <Balancer>{anime.title}</Balancer>
            </div>
            {anime.nextEpisode ? (
              <>
                <p className="place-content-center text-left text-[1.1rem] [@media_(min-width:700px)_and_(max-width:1550px)]:text-center">
                  Episode {anime.nextEpisode.number} airs on{" "}
                </p>
                <p className="place-content-center text-left text-[1.1rem] [@media_(min-width:700px)_and_(max-width:1550px)]:text-center">
                  {anime.nextEpisode.date}
                </p>
              </>
            ) : (
              <p className="text-sm text-orange-600">No next episode info</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
