import Link from "next/link";
import { getRiddle } from "@/actions/riddle-action";

export const Riddle = async () => {
  const { riddle, answer } = await getRiddle();

  return (
    <div className="relative w-full break-words border-2 border-black px-1">
      <span className="block pt-1 font-yorktown text-4xl mix-blend-multiply">
        <Link href={"/gif"}> Riddle of the day </Link>
      </span>
      <div className="my-1">{riddle}</div>

      <div className="group absolute bottom-1 right-1 text-sm">
        <span className="block group-hover:hidden">Answer</span>
        <span className="hidden group-hover:block">{answer}</span>
      </div>
    </div>
  );
};
