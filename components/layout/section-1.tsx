import Balancer from "react-wrap-balancer";

import BackgroundMusic from "../layout/background-music";
import { Profile } from "../ui/profile";
import Stocks from "./stock";

export default async function Section() {
  return (
    <div className="select-none">
      <Balancer className="main-heading m-0 p-0 py-3 text-center font-gloucester min-[600px]:whitespace-nowrap">
        A NEW FORCE EMERGES FROM THE SHADOWS
      </Balancer>

      <div className="grid grid-cols-1 font-slab text-lg min-[800px]:grid-cols-4 min-[1550px]:grid-cols-3 min-[1550px]:text-xl">
        <div className="col-span-1 grid grid-cols-1 max-[800px]:space-y-6 min-[800px]:col-span-4 min-[800px]:grid-cols-2 min-[1550px]:col-span-1 min-[1550px]:grid-cols-1 min-[1550px]:pr-2 [@media_(min-width:800px)_and_(max-width:1550px)]:pb-4">
          <div className="text-justify [@media_(min-width:800px)_and_(max-width:1550px)]:pr-7">
            <p className="mb-1 hidden text-center font-gloucester text-3xl uppercase [@media_(min-width:800px)_and_(max-width:1550px)]:block">
              about him
            </p>
            Whispers are circulating about an unusal individual, known across
            the internet as Ninjafire, but his real name is{" "}
            <strong>Dharmesh</strong>. He is currently in his early twenties and
            has been completely obsessed with computers from an early age.
            <span className="min-[1550px]:hidden">
              {" "}
              He’s super into linux, neovim and scripting, regenerative arts,
              open-source stuff, playing and making little games — basically, he
              never stops learning and building.{" "}
            </span>
          </div>
          <div className="text-justify [@media_(min-width:800px)_and_(max-width:1200px)]:px-2">
            <p className="mb-1 text-center font-gloucester text-3xl uppercase">
              His tech stack
            </p>
            He builds beautiful, unique and fast websites using
            <i className="mx-1">ReactJS</i> and<i className="mx-1">NextJS</i>,
            can creates solid backend system using various pattern with
            <i className="mx-1">ExpressJS</i>, can puts everything online using{" "}
            <i className="mx-1">AWS </i> or any hosting platform, and can even
            make desktop apps that work on Windows, Mac, and Linux with{" "}
            <i className="mx-1">ElectronJS</i>. Pretty much anything he builds
            ends up looking and working super clean and professional.
          </div>
          <div className="hidden text-justify min-[1550px]:block [@media_(min-width:800px)_and_(max-width:1200px)]:pl-2">
            <p className="mb-1 text-center font-gloucester text-3xl uppercase">
              His interests
            </p>
            min-[800px]:col-span-2 He’s super into linux, neovim and scripting,
            regenerative arts, open-source stuff, playing and making little
            games — basically, he never stops learning and building.
          </div>
        </div>

        <div className="relative col-span-1 max-[800px]:my-6 min-[800px]:col-span-2 min-[800px]:px-2 min-[1550px]:col-span-1">
          <Profile />
          <BackgroundMusic />
        </div>

        <div className="col-span-1 space-y-10 pl-2 min-[800px]:col-span-2 min-[1550px]:col-span-1">
          <Stocks />
          <div>
            <Balancer className="sec-heading block font-gloucester mix-blend-multiply">
              THE MAN IS UNSTOPPABLE
            </Balancer>
            <div className="mt-2 text-justify">
              In past, Dharmesh worked as a
              <i className="mr-1"> software developer </i>
              at
              <i className="mr-1"> Yoglabs AI Research Foundation. </i>
              He build a smart AI system that keeps track of how well students
              are doing, something that could totally change the way companies
              hire people in the future.
              <br />
              <br />
              His job includes creating small backend services, making clean
              user interfaces with React, and running Python code on AWS Lambda
              to pull out useful data.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
