import Link from "next/link";

import { getAllBlogsMetadata } from "@/lib/utils";

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
