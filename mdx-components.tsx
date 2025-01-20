import { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { highlight } from "sugar-high";

type HeadingProps = ComponentPropsWithoutRef<"h1">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;

const components = {
  h1: (props: HeadingProps) => (
    <h1
      style={{
        animation: "fade-in 1s ease-in-out",
        marginBottom: "0",
        paddingTop: "1.5rem",
        fontWeight: 500,
      }}
      {...props}
    />
  ),
  h2: (props: HeadingProps) => (
    <h2
      style={{
        marginBottom: "0.75rem",
        marginTop: "2rem",
        fontWeight: 500,
      }}
      {...props}
    />
  ),
  h3: (props: HeadingProps) => (
    <h3
      style={{
        marginBottom: "0.75rem",
        marginTop: "2rem",
        fontWeight: 500,
      }}
      {...props}
    />
  ),
  h4: (props: HeadingProps) => <h4 style={{ fontWeight: 500 }} {...props} />,
  p: (props: ParagraphProps) => (
    <p
      style={{
        lineHeight: "1.5",
      }}
      {...props}
    />
  ),
  ol: (props: ListProps) => (
    <ol
      style={{
        listStyleType: "decimal",
        paddingLeft: "1.25rem",
        margin: 0,
        marginBottom: "1rem",
      }}
      {...props}
    />
  ),
  ul: (props: ListProps) => (
    <ul
      style={{
        listStyleType: "disc",
        paddingLeft: "1.25rem",
        margin: 0,
        marginBottom: "1rem",
      }}
      {...props}
    />
  ),
  li: (props: ListItemProps) => (
    <li
      style={{
        paddingLeft: "0.25rem",
      }}
      {...props}
    />
  ),
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em style={{ fontWeight: 500 }} {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong style={{ fontWeight: 500 }} {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const commonStyle = {
      color: "#458588",
      textDecoration: "none",
      transition: "color 0.2s ease-in-out",
    } as React.CSSProperties;

    if (href?.startsWith("/")) {
      return (
        <Link href={href} style={commonStyle} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} style={commonStyle} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={commonStyle}
        {...props}
      >
        {children}
      </a>
    );
  },
  code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => {
    const codeHTML = highlight(children as string);
    return (
      <code
        style={{
          padding: "0.2rem 0.4rem",
          borderRadius: "4px",
          fontSize: "0.875rem",
        }}
        dangerouslySetInnerHTML={{ __html: codeHTML }}
        {...props}
      />
    );
  },
  Table: ({ data }: { data: { headers: string[]; rows: string[][] } }) => (
    <table
      style={{ borderCollapse: "collapse", width: "100%", margin: "1rem 0" }}
    >
      <thead>
        <tr>
          {data.headers.map((header, index) => (
            <th
              key={index}
              style={{
                textAlign: "left",
                padding: "0.5rem",
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                style={{
                  borderBottom: "1px solid #e2e8f0",
                  padding: "0.5rem",
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      style={{
        marginLeft: "0.2rem",
        paddingLeft: "1rem",
      }}
      {...props}
    />
  ),
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}
