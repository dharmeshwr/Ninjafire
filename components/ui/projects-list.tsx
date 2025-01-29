"use client";

import { useCallback, useState } from "react";

import { type Project } from "@/config/projects";
import ProjectModal from "@/components/ui/project-modal";

export function ProjectList({ data }: { data: Record<string, Project[]> }) {
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
        body: project.description,
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
                    className="flex w-full cursor-pointer flex-col items-start rounded p-1 hover:bg-foreground/5 md:flex-row md:justify-between"
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

      <ProjectModal
        isOpen={modalData.openModal}
        media={modalData.media}
        title={modalData.title}
        github={modalData.github}
        live={modalData.live}
        close={CloseModal}
      >
        {modalData.body}
      </ProjectModal>
    </>
  );
}
