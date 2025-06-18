import Link from "next/link";

import { metaData } from "@/config/site";
import { getAllBlogsMetadata } from "@/lib/utils";

export const metadata = {
  title: "Blogs",
  description: "Some of my writings about stuffs",
  metadataBase: new URL(metaData.baseUrl),
  openGraph: {
    images: "/og?title=Blogs&font=vt323",
  },
};

export default async function BlogsPage() {
  const blogs = await getAllBlogsMetadata();

  return (
    <div>
      <h2 className="text-2xl">My Blogs</h2>
      <ul className="pl-6 pt-5">
        {blogs.map((blog, index) => (
          <li
            key={index}
            className="text-md list-disc pl-3 font-medium underline"
          >
            <Link href={`${blog.href}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
