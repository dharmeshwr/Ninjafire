import { ImageResponse } from "next/og";

import { getBaseURL } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET() {
  const size = {
    width: 1200,
    height: 630,
  };

  try {
    // const { searchParams } = new URL(request.url);
    // const font = searchParams.get("font");

    const baseURL = getBaseURL();

    const gloucester = await fetch(
      new URL("fonts/Gloucester-Font.ttf", baseURL),
    ).then((res) => res.arrayBuffer());

    const slab = await fetch(new URL("fonts/slab.ttf", baseURL)).then((res) =>
      res.arrayBuffer(),
    );

    const oldEnglish = await fetch(
      new URL("fonts/OldEnglishFive.ttf", baseURL),
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          tw="relative w-full h-full flex items-center justify-center text-[#282828]"
          style={{
            backgroundColor: "#ebdbb2",
          }}
        >
          <img
            src={`${baseURL}/background/combo.png`}
            tw="absolute inset-0 w-full h-full"
          />

          <div tw="absolute top-0 left-0 w-full flex justify-center items-center pt-10 text-center">
            <div tw="text-5xl font-bold" style={{ fontFamily: "OldEnglish" }}>
              Undefined Chronicle
            </div>
          </div>

          <div
            tw="flex flex-col justify-center text-8xl font-bold items-center text-center p-20"
            style={{ fontFamily: "Gloucester" }}
          >
            <div> READ ABOUT </div>
            <div> NINJAFIRE </div>
            <div> IN OUR LATEST CHRONICLE </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Slab",
            data: slab,
            weight: 400,
            style: "normal",
          },
          {
            name: "Gloucester",
            data: gloucester,
            weight: 400,
            style: "normal",
          },
          {
            name: "OldEnglish",
            data: oldEnglish,
            weight: 400,
            style: "normal",
          },
        ],
      },
    );
  } catch (e) {
    return new Response(`Failed to generate OG Image, ${e}`, { status: 500 });
  }
}
