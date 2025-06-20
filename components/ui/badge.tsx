export const Badges = ({ data }: { data: string[] }) => {
  const gruvboxColors = [
    "#fb4934", // Red
    "#b8bb26", // Green
    "#fabd2f", // Yellow
    "#83a598", // Blue
    "#8ec07c", // Aqua
    "#fe8019", // Orange
    "#d3869b", // Purple
  ];

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {data.map((badge, index) => (
        <span
          key={badge}
          className="inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-foreground/30 bg-backgroundAlt px-2 py-0.5 text-xs font-medium"
          style={{
            color: gruvboxColors[index % gruvboxColors.length],
          }}
        >
          {badge}
        </span>
      ))}
    </div>
  );
};
