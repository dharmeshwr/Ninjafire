import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const filepath = path.join(process.cwd(), "public", "resume.pdf");

  try {
    const filecontent = (await fs.readFile(filepath)) as BodyInit;

    const response = new NextResponse(filecontent);
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Content-Disposition",
      "attachment; filename=Dharmesh's Resume",
    );

    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
