import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

import { metaData } from "@/config/site";

import { VideoPaper } from "../ui/paper-video";
import { AnimeBroadcast } from "./anime-list";
import { Jet2Holiday } from "./jet";
import Footer from "./paper-footer";
import { Riddle } from "./riddle";

export default function Section() {
  return (
    <div className="grid grid-cols-1 py-4 font-slab text-lg min-[1000px]:text-xl min-[1200px]:grid-cols-3">
      <div className="col-span-2 space-y-5">
        <span className="sec-heading block font-gloucester">
          {" "}
          HIS EXTRAORDINARY CREATIONS{" "}
        </span>
        <div>
          <a
            href={"https://revord.org"}
            target="_blank"
            rel="noopener noreferrer"
            className="sec-heading cursor-pointer font-gloucester hover:underline"
          >
            <Balancer>
              REVORD - Make Mind-Blowing and Viral Tutorials Videos
            </Balancer>
          </a>
          <div className="space-x-2 pr-2 pt-3 leading-7 min-[1200px]:text-justify">
            <span>
              <Image
                src={"/projects/revord.svg"}
                alt="A Picture"
                width={190}
                height={190}
                className="shape-circle mr-2 mt-2 mix-blend-multiply grayscale transition-all ease-linear min-[400px]:float-left"
              />
            </span>
            <div>
              Revord is a cross-platform app (Windows, Linux, macOS) for
              creators and educators. It simplifies tutorial and demo creation
              with auto-generated zoom/pan effects from mouse movements,
              real-time annotations (pen, arrow), and easy screenshot editing
              (crop, pixelate). He made this project in collobration with one of
              his basement dweller friend
              <a
                href={"https://tarnished.lol"}
                target="_blank"
                className="mx-1 inline-flex cursor-pointer break-words font-bold hover:underline"
              >
                @Aryan
              </a>
            </div>
          </div>
        </div>

        <div className="m-2 ml-0 flex gap-3">
          <Jet2Holiday />
        </div>

        <div>
          <a
            href={"https://drapes-ui.vercel.app"}
            target="_blank"
            rel="noopener noreferrer"
            className="sec-heading cursor-pointer font-gloucester hover:underline"
          >
            <Balancer>DRAPES UI- Easy To Use Shaders Backgrounds</Balancer>
          </a>
          <div className="pr-2 pt-4 min-[1200px]:text-justify min-[1200px]:leading-8">
            <a
              href={"https://github.com/netmods/drapes-ui"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={"/projects/drapes.png"}
                alt="A Picture"
                width={500}
                height={500}
                className="mb-5 mr-2 mix-blend-multiply contrast-100 grayscale transition-all ease-linear min-[800px]:float-left"
              />
            </a>
            <span>
              Drapes UI offers ready-to-use live backgrounds for your websites,
              built entirely on HTML Canvas with zero dependencies and powered
              by React and Tailwind. It includes a control panel to personalize
              the background according to your theme, and you can easily
              integrate it by simply copying and pasting the code into your
              codebase. Available in both TSX and JSX formats, it delivers a
              fresh new background every week.
            </span>
          </div>
        </div>

        <div>
          <a
            href={"https://github-designer.vercel.app"}
            target="_blank"
            rel="noopener noreferrer"
            className="sec-heading cursor-pointer font-gloucester hover:underline"
          >
            <Balancer>
              GITHUB HEATMAP DESIGNER - Turn Your Heatmap into Pixel Art
            </Balancer>
          </a>
          <div className="pr-2 pt-4 min-[1200px]:text-justify min-[1200px]:leading-8">
            <a
              href={"https://github.com/dharmeshwr/github-designer"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={"/projects/designer.png"}
                alt="A Picture"
                width={500}
                height={500}
                className="mr-2 mix-blend-multiply contrast-100 grayscale transition-all ease-linear min-[800px]:float-left"
              />
            </a>
            GitHub Heatmap Designer helps you to personalize their GitHub
            contribution graphs with creative patterns, messages, or pixel art.
            Built for fun and profile enhancement, it lets users visualize and
            edit their contributions heatmap, applying changes by automatically
            generating repositories and timed commits.
          </div>
        </div>

        <div className="relative mr-2 pt-5 min-[600px]:text-lg min-[1000px]:text-xl">
          <AnimeBroadcast />
        </div>

        <div className="min-[1200px]:leading-8">
          If you want to contact him, You can find him on
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={metaData.links.twitter}
            className="mx-1 inline-block cursor-pointer font-bold"
          >
            [Twitter]
          </a>
          ,
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={metaData.links.github}
            className="mx-1 inline-block cursor-pointer font-bold"
          >
            [GitHub]
          </a>
          ,
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={metaData.links.linkedin}
            className="mx-1 inline-block cursor-pointer font-bold"
          >
            [LinkedIn]
          </a>
          or
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={metaData.links.email}
            className="mx-1 inline-block cursor-pointer font-bold"
          >
            [dharmeshwr@gmail.com]
          </a>
          and for a complete summary, here is the
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={"/resume"}
            className="mx-1 inline-block cursor-pointer font-bold"
          >
            [Resume]
          </a>
        </div>
        <div className="mr-2 hidden gap-3 min-[1550px]:flex">
          <Riddle />
        </div>

        <Link href={"/projects"}>
          <Balancer>
            <span
              className="mt-5 inline-block w-full font-gloucester min-[1200px]:hidden"
              style={{
                fontSize: "clamp(2rem, 4.9vw, 4rem)",
                lineHeight: "clamp(2rem, 4.9vw, 4rem)",
              }}
            >
              READ MORE ABOUT NINJAFIRE&apos;S CREATIONS IN THE NEXT PAGE
            </span>
            <span
              className="mt-5 inline-block w-full font-gloucester max-[1200px]:hidden"
              style={{
                fontSize: "clamp(1rem, 3vw, 4rem)",
                lineHeight: "clamp(1rem, 3vw, 4rem)",
              }}
            >
              READ MORE ABOUT NINJAFIRE&apos;S CREATIONS IN THE NEXT PAGE
            </span>
          </Balancer>
        </Link>

        <div className="max-[1200px]:hidden">
          <Footer />
        </div>
      </div>

      <div className="col-span-1 border-black pl-2 max-[1200px]:mt-6 min-[1200px]:border-l">
        <div>
          <span className="sec-heading block font-gloucester">
            {" "}
            HIS GENERATIVE ARTS{" "}
          </span>
          <div className="relative">
            <div className="mb-2 min-[600px]:text-lg min-[1000px]:text-xl">
              The man takes great joy in making procedural generation, here are
              some of his best fabrications.
            </div>
            <div className="grid gap-1 max-[1200px]:grid-cols-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1 min-[1200px]:space-y-1">
              <VideoPaper src={"/arts/perlin6.mp4"} href={"/arts/6"} />
              <VideoPaper src={"/arts/perlin5.mp4"} href={"/arts/5"} />
              <VideoPaper src={"/arts/perlin4.mp4"} href={"/arts/4"} />
              <VideoPaper src={"/arts/perlin3.mp4"} href={"/arts/3"} />
            </div>

            <div className="hidden max-[1200px]:block">
              <Footer />
            </div>
            <div className="flex justify-center pt-4 font-gothic text-7xl font-extrabold leading-6 text-black/90 mix-blend-multiply">
              w{" "}
            </div>

            <div className="mr-2 flex gap-3 min-[1550px]:hidden">
              <Riddle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
