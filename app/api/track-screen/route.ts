import { NextRequest } from "next/server";
import { redis } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    const data = text ? JSON.parse(text) : {};

    const bucket = data.bucket;
    console.log(bucket);
    if (["small", "laptop", "desktop"].includes(bucket)) {
      await redis.incr(`screen:${bucket}`);
    }
  } catch {}
  return new Response(null, { status: 204 });
}

export const runtime = "edge";
