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

export default function Page() {
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

        <div className="relative flex justify-center rounded-full border border-foreground/40 bg-foreground/5 p-1 text-sm font-semibold">
          <span
            className={cn(
              "absolute -z-10 h-[calc(100%-0.50rem)] w-[calc(50%-0.25rem)] rounded-full bg-foreground px-2 transition-all duration-200",
              category === CategoryType.TYPE && "left-1",
              category === CategoryType.DATE && "left-[3.2rem]",
            )}
          />

          {Categories.map((key) => (
            <button
              key={key}
              className={cn(
                category === key && "text-background",
                "duration-50 px-2 py-1 transition-all",
              )}
              onClick={() => {
                const queryString = createQueryString(
                  "category",
                  key,
                  searchparams,
                );
                router.push(`${pathname}?${queryString}`);
              }}
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
