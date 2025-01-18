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
      <h1>Listed Blogs</h1>
      <ul>
        {blogs.map((blog, index) => (
          <li key={index}>
            <Link href={`${blog.href}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
