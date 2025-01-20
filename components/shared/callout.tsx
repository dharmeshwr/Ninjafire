import { cn } from "@/lib/utils";

interface CalloutProps {
  icon?: string;
  children?: React.ReactNode;
  type?: "default" | "warning" | "danger";
}

export function Callout({
  children,
  icon,
  type = "default",
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn(
        "my-6 flex items-start rounded-md border border-l-4 border-foreground/50 bg-foreground/5 p-4 py-2",
        {
          "border-[#cc241d] bg-[#cc241d]/10": type === "danger",
          "border-[#458588] bg-[#458588]/10": type === "warning",
        },
      )}
      {...props}
    >
      {icon && <span className="mr-4 text-2xl">{icon}</span>}
      <div>{children}</div>
    </div>
  );
}
