export type Project = {
  title: string;
  description: React.ReactNode;
  date: [string, string?];
  type: string;
  github: string;
  live?: string;
  media: string;
  badges: string[];
};

const ShiftDescription = () => (
  <span>
    To learn more about <code>file systems</code> and their underlying
    mechanics, I built a Desktop File Manager using <code>Electron</code> for
    the backend and <code className="font-mono text-green-600">React</code> for
    the frontend. The interface features a{" "}
    <code className="italic text-purple-600">sidebar</code> with two views: a{" "}
    <code>Places view</code> displaying common folders like{" "}
    <code>Downloads, Pictures, Documents</code>, and a{" "}
    <code>Directory Tree</code>, inspired by VS Code, for deep folder
    navigation. The <code>header</code> includes navigation buttons for{" "}
    <code>back, forward, and home</code>, plus a <code>search bar</code> for
    quick path access. The <code>footer</code> shows the selected file&apos;s
    size and total/free disk space. The app supports themes like{" "}
    <code className="text-orange-600">Gruvbox</code>,{" "}
    <code className="text-pink-600">TokyoNight</code>, <code>Nord</code>, and{" "}
    <code className="text-yellow-600">Solarized</code> for a visually appealing
    experience. You can track the checkpoint I completed through my{" "}
    <a
      target="_blank"
      className="underline"
      href="https://x.com/Dharmeshwr/status/1931336370905116852"
    >
      tweets
    </a>
    .
  </span>
);

const RPMDescription = () => (
  <span>
    I created a simple note-taking app using{" "}
    <code className="font-mono text-green-600">Electron</code> for the backend
    and <code className="font-mono text-green-600">React</code> for the frontend
    to make jotting down ideas quick and easy. The app generates{" "}
    <code>Markdown files</code> for each note and provides a clean editor
    powered by <code>@mdxeditor/editor</code>. A <code>sidebar</code> lists all
    Markdown files, with <code className="text-purple-600">Create</code> and{" "}
    <code className="text-red-600">Delete</code> buttons for easy note
    management. Global state is managed with{" "}
    <code className="font-mono text-orange-600">Jotai</code>, ensuring a smooth
    and organized user experience.
  </span>
);

const PromanageDescription = () => (
  <span>
    Promanage is a robust <code className="font-bold">RBAC</code> application
    for team collaboration and project management, built with{" "}
    <code className="font-mono text-green-600">React.js</code> on the frontend
    and <code className="font-mono text-green-600">Express.js</code> on the
    backend. It integrates <code>ReactFlow</code>, <code>Framer Motion</code>,{" "}
    <code>Socket.io</code>, <code>NodeMailer</code>, <code>AWS S3</code>, and{" "}
    <code>MongoDB</code>. Users can create teams, assign roles, and manage tasks
    displayed on a personalized{" "}
    <code className="font-mono text-purple-600">Kanban board</code>. The{" "}
    <code>workflow editor</code>, powered by ReactFlow, visualizes tasks with
    real-time updates via Socket.io. The <code>file-sharing system</code> uses
    AWS S3 for secure storage of PDFs and images, while{" "}
    <code className="text-purple-600">NodeMailer</code> sends email
    notifications for task deadlines and assignments, boosting productivity and
    accountability.
  </span>
);

const HavnsDescription = () => (
  <span>
    Havns is a <code className="font-mono text-green-600">Next.js</code>-based
    event venue booking platform styled with <code>Tailwind CSS</code> and
    powered by <code>MongoDB</code>. It simplifies reserving venues for events
    like weddings and reunions with features like{" "}
    <code className="text-purple-600">Google OAuth</code> via{" "}
    <code>NextAuth</code> and secure{" "}
    <code className="text-purple-600">Stripe</code> payments. Users can explore
    venues through <code>Cloudinary</code>-hosted images and{" "}
    <code>Leaflet</code> maps, take virtual tours via{" "}
    <code className="text-purple-600">Zoom API</code>-generated links, save
    venues to a <code>wishlist</code>, and leave reviews. Hosts can list venues
    by submitting details and uploading images. <code>Framer Motion</code>{" "}
    enhances the experience with smooth animations.
  </span>
);

const ProductionCrateDescription = () => (
  <span>
    Built during my 2nd semester of undergrad, this <code>UI clone</code> of{" "}
    <a
      href="https://www.productioncrate.com"
      target="_blank"
      rel="noopener noreferrer"
      className="underline"
    >
      Production Crate
    </a>{" "}
    was created to practice{" "}
    <code className="font-mono text-green-600">CSS</code> skills before learning
    JavaScript. The original site may have changed since summer 2022. Without
    access to ChatGPT, I relied on{" "}
    <code className="text-purple-600">YouTube tutorials</code> for debugging.
    All styles were written in a single CSS file, resulting in ~2000 lines of
    code, as I was unaware CSS could be split into multiple files.
  </span>
);

const IPModelDescription = () => (
  <span>
    I developed an IP-based <code>server-client system</code> in{" "}
    <code className="font-mono text-green-600">C</code> using{" "}
    <code>raw sockets</code> for low-level network communication. By leveraging{" "}
    <code>sys/socket.h, linux/ip.h, unistd.h, arpa/inet.h</code>, I crafted{" "}
    <code>IP headers</code> to encapsulate and transmit data, bypassing
    higher-level protocols. This project deepened my understanding of{" "}
    <code className="text-purple-600">network layer</code> operations and{" "}
    <code className="text-purple-600">socket programming</code>, offering
    hands-on experience with data encapsulation at the IP layer.
  </span>
);

const AuthenticationDescription = () => (
  <span>
    This project explored{" "}
    <code className="font-bold">Authentication and Authorization</code> through
    three methods: <code>session token-based authentication</code>,{" "}
    <code>JWT-based authentication</code> with{" "}
    <code className="text-purple-600">OWASP-compliant security</code> and custom{" "}
    <code className="text-purple-600">CSRF protection</code>, and{" "}
    <code>Google OAuth</code> in a{" "}
    <code className="font-mono text-green-600">Next.js</code> app. Features
    include <code className="text-purple-600">password recovery</code>,{" "}
    <code className="text-purple-600">email verification</code>,{" "}
    <code className="text-purple-600">two-factor authentication</code>, and{" "}
    <code className="text-purple-600">role-based authentication</code>,
    providing hands-on experience with secure application design.
  </span>
);

export const projects: Project[] = [
  {
    title: "Shift :: File Manager",
    description: <ShiftDescription />,
    date: ["May 2025", "ongoing"],
    type: "Desktop Apps",
    github: "https://github.com/dharmeshwr/shift",
    media: "/projects/shift.webp",
    badges: [
      "Electron",
      "Electron-vite",
      "ReactJS",
      "Jotai",
      "Typescript",
      "TailwindCSS",
    ],
  },
  {
    title: "RPM :: Note App",
    description: <RPMDescription />,
    date: ["April 2025"],
    type: "Desktop Apps",
    github: "https://github.com/dharmeshwr/RPM",
    media: "/projects/RPM.webp",
    badges: [
      "Electron",
      "Electron-vite",
      "ReactJS",
      "Jotai",
      "Typescript",
      "TailwindCSS",
    ],
  },
  {
    title: "Promanage :: A Project Management Platform",
    description: <PromanageDescription />,
    date: ["Mar 2024", "Aug 2024"],
    type: "Websites",
    github: "https://github.com/dharmeshwr/promanage",
    live: "https://promanage-ten.vercel.app",
    media: "/projects/promanage-1.webp",
    badges: [
      "ReactJS",
      "ReactFlow",
      "Framer Motion",
      "ExpressJS",
      "Socket.io",
      "NodeMailer",
      "AWS(S3)",
      "Mongoose",
    ],
  },
  {
    title: "Havns :: A Venue Booking Platform",
    description: <HavnsDescription />,
    date: ["Jun 2023", "Oct 2023"],
    type: "Websites",
    github: "https://github.com/dharmeshwr/havns",
    live: "https://havns.vercel.app",
    media: "/projects/havns.webp",
    badges: [
      "NextJS",
      "TailwindCSS",
      "Mongoose",
      "NextAuth",
      "Cloudinary",
      "Leaflet",
      "Stripe API",
      "Zoom API",
      "Framer Motion",
    ],
  },
  {
    title: "Production Crate :: UI Clone",
    description: <ProductionCrateDescription />,
    date: ["Sept 2022"],
    type: "Websites",
    github: "https://github.com/dharmeshwr/ProductionCrate-CSS-Clone",
    live: "https://dharmesh53.github.io/ProductionCrate-CSS-Clone",
    media: "/projects/production-crate.webp",
    badges: ["HTML", "CSS", "Javascript"],
  },
  {
    title: "IP Based Server And Client Model Using Raw Sockets",
    description: <IPModelDescription />,
    date: ["Jun 2024"],
    type: "Foundational Concepts",
    github: "https://github.com/dharmeshwr/IP-Server-And-Client-Model",
    media: "/projects/ip.webp",
    badges: [
      "sys/socket.h",
      "stdlib.h",
      "netint/in.h",
      "arpa/inet.h",
      "linux/ip.h",
    ],
  },
  {
    title: "Authentication And Authorization",
    description: <AuthenticationDescription />,
    date: ["Sept 2024", "Oct 2024"],
    type: "Foundational Concepts",
    github: "https://github.com/dharmeshwr/Authentication",
    media: "/projects/auth.webp",
    badges: [
      "Session based Authentication",
      "JWT based Authentication",
      "NextAuth",
      "Two Factor Authentication",
      "Email Verification",
    ],
  },
];
