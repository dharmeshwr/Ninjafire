import { ImageResponse } from "next/og";

import { getBaseURL } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET() {
  try {
    const train = await fetch(
      new URL("fonts/TrainOne-Regular.ttf", getBaseURL()),
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            fontFamily: "TrainOne",
            fontWeight: "bolder",
          }}
          tw="w-full h-full bg-[#ebdbb2] text-[#282828] p-8 flex items-center justify-center relative"
        >
          <div tw="flex flex-col">
            <h1 tw="text-5xl font-bold">DHARMESH</h1>
          </div>
        </div>
      ),
      {
        fonts: [
          {
            name: "TrainOne",
            data: train,
            weight: 400,
            style: "normal",
          },
        ],
        width: 800,
        height: 300,
      },
    );
  } catch (e) {
    console.log(e);
    return new Response("Failed to generate OG Image", { status: 500 });
  }
}
