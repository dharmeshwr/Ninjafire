import { ImageResponse } from "next/og";

import { getBaseURL } from "@/lib/utils";

export const alt = "DHARMESH";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const fontBuffer = await fetch(
    new URL("fonts/TrainOne-Regular.ttf", getBaseURL()),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          width: "100%",
          height: "100%",
          backgroundColor: "#ebdbb2",
          color: "#282828",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        DHARMESH
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Train",
          data: fontBuffer,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
