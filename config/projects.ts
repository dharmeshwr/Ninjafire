export type Project = {
  title: string;
  description: string;
  date: [string, string?];
  type: string;
  github: string;
  live?: string;
};

export const projects: Project[] = [
  {
    title: "Promanage : A Work Management Platform",
    description: "",
    date: ["Mar 2024", "Aug 2024"],
    type: "Websites",
    github: "https://github.com/Dharmesh53/promanage",
    live: "https://promanage-ten.vercel.app",
  },
  {
    title: "Havns : A Marriage Hall Booking Platform",
    description: "",
    date: ["Jun 2023", "Oct 2023"],
    type: "Websites",
    github: "https://github.com/Dharmesh53/havns",
    live: "https://havns.vercel.app",
  },
  {
    title: "Production Crate : UI Clone",
    description: "Websites",
    date: ["Jan 2023"],
    type: "Websites",
    github: "https://github.com/Dharmesh53/ProductionCrate-CSS-Clone",
    live: "https://dharmesh53.github.io/ProductionCrate-CSS-Clone",
  },
  {
    title: "IP Based Server And Client Model Using Raw Sockets",
    description: "",
    date: ["Jun 2024"],
    type: "Core Concepts",
    github: "https://github.com/Dharmesh53/IP-Server-And-Client-Model",
    live: "",
  },
  {
    title: "Sorting Algorithms",
    description: "",
    date: ["Jul 2024"],
    type: "Core Concepts",
    github: "https://github.com/Dharmesh53/All-Sorting-Methods",
    live: "",
  },
  {
    title: "Authentication And Authorization",
    description: "Core Concepts",
    date: ["Sept 2024", "Oct 2024"],
    type: "Core Concepts",
    github: "https://github.com/Dharmesh53/Authentication",
    live: "",
  },
];
