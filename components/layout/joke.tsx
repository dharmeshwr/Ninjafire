import Link from "next/link";
import { getJoke } from "@/actions/joke-action";

export const Joke = () => {
  const joke = getJoke();

  return (
    <div className="relative w-full break-words border-2 border-black px-1">
      <span className="block pt-1 font-yorktown text-4xl mix-blend-multiply">
        <Link href={"/gif"}> Joke of the day </Link>
      </span>
      <div className="my-1">{joke}</div>
    </div>
  );
};
