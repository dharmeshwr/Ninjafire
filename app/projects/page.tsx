"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { projects, type Project } from "@/config/projects";
import { capatilize, cn, createQueryString } from "@/lib/utils";
import { ProjectList } from "@/components/ui/projects-list";

enum CategoryType {
  DATE = "date",
  TYPE = "type",
}

const Categories = [CategoryType.TYPE, CategoryType.DATE];

export default function ProjectsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchparams = useSearchParams();
  let category =
    (searchparams.get("category") as CategoryType) ?? CategoryType.TYPE;

  if (!Categories.includes(category)) {
    category = CategoryType.TYPE;
  }

  function sortProjectsByYear(projects: Record<string, Project[]>) {
    const sortedKeys = Object.keys(projects).sort(
      (a, b) => Number(b) - Number(a),
    );

    return sortedKeys.reduce((acc, key) => {
      acc[`Year ${key}`] = projects[key];
      return acc;
    }, {});
  }

  const categorizedProjects = useMemo(() => {
    const grouped = projects.reduce<Record<string, Project[]>>(
      (accumulate, current) => {
        const key =
          category === CategoryType.TYPE
            ? current[category]
            : current[category][0].split(" ")[1]; // Extract year from date

        accumulate[key] = accumulate[key] ?? [];

        accumulate[key].push(current);

        return accumulate;
      },
      {},
    );

    return category === CategoryType.DATE
      ? sortProjectsByYear(grouped)
      : grouped;
  }, [category]);

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl">My Projects</h2>

        <div className="flex justify-center rounded-full border border-foreground/40 bg-foreground/5 p-1 text-sm font-semibold">
          {Categories.map((key) => (
            <button
              key={key}
              className={cn(
                "inline-flex items-center rounded-full px-2 py-1",
                category === key && "bg-foreground text-background",
              )}
              onClick={() =>
                router.push(
                  pathname +
                    "?" +
                    createQueryString("category", key, searchparams),
                )
              }
            >
              {capatilize(key)}
            </button>
          ))}
        </div>
      </div>

      <ProjectList data={categorizedProjects} />
    </div>
  );
}
