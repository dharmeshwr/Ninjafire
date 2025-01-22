import { NextResponse } from "next/server";
import { Feed } from "feed";

import { metaData } from "@/config/site";
import { getAllBlogsMetadata, getBaseURL } from "@/lib/utils";

export async function generateStaticParams() {
  return [
    { format: "rss.xml" },
    { format: "atom.xml" },
    { format: "feed.json" },
  ];
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ format: string }> },
) {
  const { format } = await params;
  const validFormats = ["rss.xml", "atom.xml", "feed.json"];

  if (!validFormats.includes(format)) {
    return NextResponse.json(
      { error: "Unsupported feed format" },
      { status: 404 },
    );
  }

  const BaseUrl = getBaseURL();

  const feed = new Feed({
    title: metaData.title,
    description: metaData.description,
    id: BaseUrl,
    link: BaseUrl,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${metaData.title}`,
    generator: "Feed for Node.js",
    feedLinks: {
      json: `${BaseUrl}feed.json`,
      atom: `${BaseUrl}atom.xml`,
      rss: `${BaseUrl}rss.xml`,
    },
  });

  const blogs = await getAllBlogsMetadata();

  blogs.forEach((blog) => {
    const postUrl = blog.href.slice(1);

    feed.addItem({
      title: blog.title,
      link: `${BaseUrl}${postUrl}`,
      description: blog.description,
      date: new Date(blog.publishedAt),
    });
  });

  const responseMap = {
    "rss.xml": { content: feed.rss2(), contentType: "application/xml" },
    "atom.xml": { content: feed.atom1(), contentType: "application/xml" },
    "feed.json": { content: feed.json1(), contentType: "application/json" },
  };

  const response = responseMap[format];

  return new NextResponse(response.content, {
    headers: {
      "Content-Type": response.contentType,
    },
  });
}
