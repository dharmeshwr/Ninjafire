import fs from "fs";
import path from "path";
import Link from "next/link";

const getAllBlogsSlug = async () => {
  const CONTENT_PATH = path.join(process.cwd(), "app/blogs/(content)");
  const dirs = fs.readdirSync(CONTENT_PATH);

  return Promise.all(
    dirs.map(async (blogDir) => {
      const { metadata } = await import(`./(content)/${blogDir}/page.mdx`);
      return { ...metadata, href: `/blogs/${blogDir}` };
    }),
  );
};

export default async function BlogsPage() {
  const blogs = await getAllBlogsSlug();

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
