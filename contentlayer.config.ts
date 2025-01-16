import { defineDocumentType, makeSource } from "contentlayer/source-files";
import type { ComputedFields } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

interface DocumentTypes {
  _raw: {
    flattenedPath: string;
  };
}

const computedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc: DocumentTypes) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc: DocumentTypes) =>
      doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
};

interface PrettyCodeOptions {
  theme: string;
  onVisitLine: (node: {
    children: Array<{ type: string; value: string }>;
  }) => void;
  onVisitHighlightedLine: (node: {
    properties: { className: string[] };
  }) => void;
  onVisitHighlightedWord: (node: {
    properties: { className: string[] };
  }) => void;
}

export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: `blogs/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    date: {
      type: "date",
      required: true,
    },
    published: {
      type: "boolean",
      default: true,
    },
    image: {
      type: "string",
      required: true,
    },
    authors: {
      type: "list",
      of: { type: "string" },
      required: true,
    },
  },
  computedFields,
}));

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark",
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className.push("line--highlighted");
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ["word--highlighted"];
  },
};

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Blog],
  mdx: {
    remarkPlugins: [[remarkGfm]],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, prettyCodeOptions],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});
