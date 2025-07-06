import { useCallback, useState } from "react";
import { globalZIndexAtom } from "@/store";
import { useAtomValue } from "jotai";
import { createPortal } from "react-dom";

import { type Project } from "@/config/projects";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

import { ProjectModalDesktop, ProjectModalMobile } from "./project-modal";

interface ProjectListProps {
  data: Record<string, Project[]>;
}
type ProjectModal = Project & {
  zIndex: number;
  offset: number;
};

export function ProjectListDesktop({ data }: ProjectListProps) {
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
          <ProjectModalDesktop
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
          </ProjectModalDesktop>,
          document.body,
        ),
      )}
    </>
  );
}

export function ProjectListMobile({
  data,
}: {
  data: Record<string, Project[]>;
}) {
  const [modalData, setModalData] = useState({
    openModal: false,
    media: "",
    title: "",
    body: "",
    github: "",
    live: "",
    close: () => {},
  });

  const CloseModal = useCallback(() => {
    setModalData({
      openModal: false,
      media: "",
      title: "",
      body: "",
      github: "",
      live: "",
      close: () => {},
    });
  }, []);

  const UpdateModalData = useCallback(
    (project: Project) => {
      setModalData({
        openModal: true,
        media: project?.media,
        title: project.title,
        body: project.description as string,
        github: project.github,
        live: project.live || "",
        close: CloseModal,
      });
    },
    [CloseModal],
  );

  return (
    <>
      <div className="mt-6 space-y-3">
        {Object.entries(data).map(([categoryName, projects]) => {
          return (
            <div key={categoryName} className="flex flex-col gap-2">
              <span className="text-xl font-semibold">{categoryName}</span>
              <div>
                {projects.map((project) => (
                  <button
                    key={project.title}
                    className="flex w-full cursor-pointer flex-col items-start rounded p-1 text-left hover:bg-foreground/5 md:flex-row md:justify-between"
                    onClick={() => UpdateModalData(project)}
                  >
                    <span>{project.title}</span>
                    <span className="text-sm text-foreground/60">
                      {project.date.join(" - ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <ProjectModalMobile
        isOpen={modalData.openModal}
        title={modalData.title}
        github={modalData.github}
        live={modalData.live}
        close={CloseModal}
      >
        {modalData.body}
      </ProjectModalMobile>
    </>
  );
}

export default function ProjectList({ data }: ProjectListProps) {
  const { isMobile } = useMediaQuery();

  return isMobile ? (
    <ProjectListMobile data={data} />
  ) : (
    <ProjectListDesktop data={data} />
  );
}
