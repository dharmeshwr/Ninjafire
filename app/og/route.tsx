import { ImageResponse } from "next/og";

import { getBaseURL } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request) {
  const size = {
    width: 700,
    height: 500,
  };

  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const font = searchParams.get("font");

    const train = await fetch(
      new URL("fonts/TrainOne-Regular.ttf", getBaseURL()),
    ).then((res) => res.arrayBuffer());

    const vt323 = await fetch(
      new URL("fonts/VT323-Regular.ttf", getBaseURL()),
    ).then((res) => res.arrayBuffer());

    const stm = await fetch(
      new URL("fonts/ShareTechMono-Regular.ttf", getBaseURL()),
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div tw="w-full h-full bg-[#ebdbb2] text-5xl text-[#282828] p-24 flex items-center justify-center text-center relative">
          {title ?? "Dharmesh"}
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "font",
            data: font === "vt323" ? vt323 : font === "train" ? train : stm,
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
