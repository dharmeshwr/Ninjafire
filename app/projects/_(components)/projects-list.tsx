import { useState } from "react";
import { globalZIndexAtom } from "@/store";
import { useAtomValue } from "jotai";
import { createPortal } from "react-dom";

import { type Project } from "@/config/projects";
import { cn } from "@/lib/utils";

import ProjectModal from "./project-modal";

interface ProjectListProps {
  data: Record<string, Project[]>;
}
type ProjectModal = Project & {
  zIndex: number;
  offset: number;
};

export function ProjectList({ data }: ProjectListProps) {
  const [openProjects, setOpenProjects] = useState<ProjectModal[]>([]);
  const globalZIndex = useAtomValue(globalZIndexAtom);

  const isAlreadyOpen = (title: string) =>
    openProjects.find((p) => p.title === title);

  const openModal = (project) => {
    if (!isAlreadyOpen(project.title)) {
      if (openProjects.length === 0) {
        project.zIndex = globalZIndex;
        project.offset = 0;
      } else {
        project.zIndex = globalZIndex + 1;
        const lastOffset = openProjects[openProjects.length - 1].offset;
        project.offset = lastOffset + 20;
      }
      setOpenProjects([...openProjects, project]);
    }
  };

  const closeModal = (project: ProjectModal) => {
    setOpenProjects(openProjects.filter((p) => p.title !== project.title));
  };

  return (
    <>
      <div className="mt-6 space-y-14">
        {Object.entries(data).map(([categoryName, projects]) => (
          <div key={categoryName} className="flex flex-col gap-2">
            <span className="font-serif text-3xl">{categoryName}</span>
            <div className="space-y-1">
              {projects.map((project) => (
                <button
                  key={project.title}
                  className={cn(
                    "flex w-full cursor-pointer flex-col items-start rounded p-1 text-left hover:bg-foreground/5 md:flex-row md:justify-between",
                    isAlreadyOpen(project.title) &&
                      "border border-foreground/20",
                  )}
                  onClick={() => openModal(project)}
                >
                  <span>{project.title}</span>
                  <span className="text-sm text-foreground/60">
                    {project.date.join(" - ")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {openProjects.map((project) =>
        createPortal(
          <ProjectModal
            key={project.title}
            title={project.title}
            github={project.github}
            live={project.live}
            zIndex={project.zIndex}
            offset={project.offset}
            badges={project.badges}
            close={() => closeModal(project)}
          >
            {project.description}
          </ProjectModal>,
          document.body,
        ),
      )}
    </>
  );
}
