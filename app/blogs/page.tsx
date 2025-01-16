import Image from "next/image";
import Link from "next/link";
import { allBlogs, Blog } from "contentlayer/generated";
import { compareDesc } from "date-fns";

import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog",
  description: "Blog from my learning",
};

function BlogCard(blog: Blog) {
  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link
          href={blog.slug}
          className="text-blue-700 hover:text-blue-900 dark:text-blue-400"
        >
          {blog.title}
        </Link>

        {blog.image && (
          <Image
            src={blog.image}
            alt={blog.title}
            width={804}
            height={452}
            className="bg-muted rounded-md border transition-colors"
          />
        )}
      </h2>
      <time dateTime={blog.date} className="mb-2 block text-xs text-gray-600">
        {formatDate(blog.date)}
      </time>
    </div>
  );
}

export default function Blogs() {
  const blogs = allBlogs
    .filter((blog) => blog.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <div className="mx-auto max-w-xl py-8">
      {blogs.map((blog, idx) => (
        <BlogCard key={idx} {...blog} />
      ))}
    </div>
  );
}
