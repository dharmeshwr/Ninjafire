import { NextRequest } from "next/server";

const defaultAddress = "Narnaul, Haryana";

const getClientIp = (request: NextRequest): string => {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0].trim();
    if (first && !["unknown", "127.0.0.1", "::1"].includes(first)) {
      return first;
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return request.headers.get("cf-pseudo-ipv4") || "127.0.0.1";
};

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);

  if (ip === "127.0.0.1" || !ip) {
    return Response.json({ location: defaultAddress });
  }

  const res = await fetch(`http://ip-api.com/json/${ip}?fields=city,country`);
  const data = await res.json();

  const location = data?.city
    ? `${data.city}, ${data.country}`
    : defaultAddress;

  return Response.json({ location });
}

export const runtime = "edge";
