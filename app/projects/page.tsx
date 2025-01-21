"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { projects, type Project } from "@/config/projects";
import { capatilize, cn, createQueryString } from "@/lib/utils";

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

function ProjectList({ data }: { data: Record<string, Project[]> }) {
  return (
    <div className="mt-6 space-y-3">
      {Object.entries(data).map(([categoryName, projects]) => {
        return (
          <div key={categoryName} className="flex flex-col gap-2">
            <span className="text-xl font-semibold">{categoryName}</span>
            <ul>
              {projects.map((project) => (
                <li
                  key={project.title}
                  className="flex cursor-pointer flex-col justify-between rounded p-1 hover:bg-foreground/5 md:flex-row"
                >
                  <span>{project.title}</span>
                  <span className="text-sm text-foreground/60">
                    {project.date.join(" - ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
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
