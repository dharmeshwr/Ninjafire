import Image from "next/image";
import Balancer from "react-wrap-balancer";

import BackgroundMusic from "../layout/background-music";

export default async function Section() {
  return (
    <div>
      <Balancer className="main-heading m-0 p-0 py-3 text-center font-gloucester min-[600px]:whitespace-nowrap">
        A NEW FORCE EMERGES FROM THE SHADOWS
      </Balancer>

      <div className="text-md grid grid-cols-1 font-slab min-[600px]:text-lg min-[800px]:grid-cols-4 min-[1000px]:text-xl min-[1200px]:grid-cols-3">
        <div className="col-span-1 grid grid-cols-1 border-black max-[800px]:space-y-6 min-[800px]:col-span-4 min-[800px]:grid-cols-3 min-[1200px]:col-span-1 min-[1200px]:grid-cols-1 min-[1200px]:space-y-6 min-[1200px]:border-r min-[1200px]:pr-2 [@media_(min-width:800px)_and_(max-width:1200px)]:pb-4">
          <div className="border-black text-justify [@media_(min-width:800px)_and_(max-width:1200px)]:border-r [@media_(min-width:800px)_and_(max-width:1200px)]:pr-2">
            Whispers are circulating about a unusal individual, known across the
            internet as Ninjafire, but his real name is Dharmesh, barely past
            his twentieth year, this young human dedicates his waking hours to
            the meticulous craft of software construction, a passion that seems
            to consume him entirely.
          </div>
          <div className="border-black text-justify [@media_(min-width:800px)_and_(max-width:1200px)]:border-r [@media_(min-width:800px)_and_(max-width:1200px)]:px-2">
            His interests are not for the faint of heart. From scripting to
            computer graphics, open-source softwares to games, and low-level
            hardware, he delves into each with unwavering passion and
            curiosity., Sources close to him, who wish to remain anonymous
            report that he possibly communicates with his Neovim instance on a
            spiritual level. His love for Linux and suckless softwares is
            unparalleled.
          </div>
          <div className="[@media_(min-width:800px)_and_(max-width:1200px)]:pl-2">
            <Balancer className="sec-heading block font-gloucester">
              THE TOOLS HE WIELDS WITH MASTERY
            </Balancer>
            <div className="mt-2 text-justify">
              When it comes to his tech stack, Dharmesh is a true master. He is
              adept at weaving complex web interfaces with ReactJS and NextJS,
              building robust back-ends with ExpressJS, while deploying them on
              AWS. On top he can craft desktop applications using ElectronJS.
              Websites bloom under his touch he is a force to be reckoned with.
            </div>
          </div>
        </div>

        <div className="relative col-span-1 border-black max-[800px]:my-6 min-[800px]:col-span-2 min-[800px]:border-r min-[800px]:px-2 min-[1200px]:col-span-1">
          <div className="flex h-fit justify-center">
            <Image
              src={"/profile-with-frame.png"}
              alt="profile picture"
              width={600}
              height={600}
              className="mix-blend-multiply"
            />
          </div>
          <BackgroundMusic />
        </div>

        <div className="col-span-1 space-y-10 pl-2 min-[800px]:col-span-2 min-[1200px]:col-span-1">
          <div>
            <Balancer className="sec-heading block font-gloucester mix-blend-multiply">
              THE MAN IS UNSTOPPABLE
            </Balancer>
            <div className="mt-2 text-justify">
              It is understood Dharmesh, is not content with mere theoretical
              knowledge, As a Software Developer at Yoglabs AI Research
              Foundation, he plunged headfirst into an AI project designed to
              monitor student progress- a concept that could revolutionize (or
              perhaps complicate) hiring as we know it. His duties included
              surveying, designing microservices and developing user interfaces
              with React.js. He deployed Python-based services an extraction
              service on on something called AWS Lambda. One can only imagine
              what digital contraption he will unleash next.
            </div>
          </div>

          <div className="border-2 border-black px-1">
            <Balancer className="block font-yorktown text-3xl italic mix-blend-multiply">
              Elon Musk&apos;s Mars Vacation Special
            </Balancer>
            <div className="my-2 text-justify">
              Why settle for a beach when you can dodge asteroids? Elon&apos;s
              got the tickets, one-way rocket rides, zero-gravity selfies, and
              complimentary space dust. Book now and claim your spot in the red
              planet lineup. Earth who?
            </div>
          </div>

          <div className="text-justify">
            Beyond his digital manoeuvre, Dharmesh finds delight in webseries
            and anime, finding solace in conversations with his companions. A
            complex figure, indeed.
          </div>
        </div>
      </div>
    </div>
  );
}
