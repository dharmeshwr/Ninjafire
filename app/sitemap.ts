import { promises as fs } from "fs";
import path from "path";
import { MetadataRoute } from "next";

import { getBaseURL } from "@/lib/utils";

const BaseUrl = getBaseURL();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogsDirectory = path.join(process.cwd(), "app", "blogs", "(content)");
  const slugs = await fs.readdir(blogsDirectory);

  const blogs = slugs.map((slug) => ({
    url: `${BaseUrl}${slug}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  const routes = ["", "blogs", "projects", "playground"].map((route) => ({
    url: `${BaseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...blogs, ...routes];
}
