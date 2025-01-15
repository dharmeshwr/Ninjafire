import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  try {
    const train = await fetch(
      new URL("../../assets/fonts/TrainOne-Regular.ttf", import.meta.url),
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
            <h1 tw="text-5xl font-bold">DHARMESH KUMAR</h1>
          </div>
        </div>
      ),
      {
        fonts: [
          {
            name: "TrainOne",
            data: train,
            weight: 800,
            style: "normal",
          },
        ],
      },
    );
  } catch {
    return new Response("Failed to generate OG Image", { status: 500 });
  }
}
