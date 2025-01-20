export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose text-foreground prose-headings:font-semibold prose-headings:text-foreground prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg prose-blockquote:border-foreground/70 prose-blockquote:text-foreground/60 prose-strong:text-foreground prose-li:marker:text-foreground prose-thead:border-foreground prose-tr:border-foreground dark:prose-headings:text-foreground">
      {children}
    </div>
  );
}
