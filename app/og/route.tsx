import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET() {
  const size = {
    width: 800,
    height: 300,
  };

  try {
    /*
      const train = await fetch(
        new URL("fonts/TrainOne-Regular.ttf", getBaseURL()),
      ).then((res) => res.arrayBuffer());
    */
    const train = await readFile(
      join(process.cwd(), "fonts/TrainOne-Regular.ttf"),
    );

    return new ImageResponse(
      (
        <div tw="w-full h-full bg-[#ebdbb2] text-5xl text-[#282828] p-8 flex items-center justify-center relative">
          DHARMESH
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "TrainOne",
            data: train,
            weight: 400,
            style: "normal",
          },
        ],
      },
    );
  } catch (e) {
    console.log(e);
    return new Response("Failed to generate OG Image", { status: 500 });
  }
}
