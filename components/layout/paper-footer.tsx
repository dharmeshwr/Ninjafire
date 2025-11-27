import Image from "next/image";

import GetRating from "../ui/get-rating";

export default function Footer() {
  return (
    <div className="space-y-1 border-t border-black py-1 pb-2 text-sm leading-5 max-[400px]:my-3">
      <span className="flex justify-between pr-2">
        Rate Undefined Chronicle
        <Image src={"/sign.svg"} alt="Signature" width={60} height={80} />
      </span>
      <div className="flex justify-between gap-1 pr-2 max-[1200px]:flex-col">
        <GetRating />
        <span className="text-sm">
          Powered by Neovim - Typewriter that never jam
        </span>
      </div>
    </div>
  );
}
