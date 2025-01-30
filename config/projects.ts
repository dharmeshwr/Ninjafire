import { createElement } from "react";

export type Project = {
  title: string;
  description: string | React.ReactNode;
  date: [string, string?];
  type: string;
  github: string;
  live?: string;
  media: string;
};

export const projects: Project[] = [
  {
    title: "Promanage : A Work Management Platform",
    description:
      "Promanage is a robust Role-Based Access Control (RBAC) application designed to streamline team collaboration and project management. Built with React.js on the frontend and Express.js on the backend, it integrates ReactFlow, Framer Motion, Socket.io, NodeMailer, AWS S3, and MongoDB to deliver a seamless user experience. The platform enables users to create and manage teams, assign roles, and collaborate efficiently. Team leaders can assign tasks, which are displayed in a personalized Kanban board for each user. The Kanban board, workflow editor, and file-sharing system enhance project organization. The workflow editor, powered by ReactFlow, provides a visual representation of tasks and updates in real time using Socket.io to ensure synchronization across all online users. Additionally, the file-sharing system, backed by AWS S3, securely stores PDFs, images, and other files. To keep users informed, email notifications are sent for task deadlines and assignments via NodeMailer, enhancing productivity and accountability.",
    date: ["Mar 2024", "Aug 2024"],
    type: "Websites",
    github: "https://github.com/Dharmesh53/promanage",
    live: "https://promanage-ten.vercel.app",
    media: "/projects/promanage-1.webp",
  },
  {
    title: "Havns : A Venue Booking Platform",
    date: ["Jun 2023", "Oct 2023"],
    description:
      "Havns is a Next.js-based event venue booking platform that simplifies the process of reserving halls for weddings, reunions, and other gatherings. Styled with Tailwind CSS and powered by MongoDB, it offers a seamless user experience with features like Google OAuth authentication via NextAuth and secure Stripe-based payments. Users can explore venues through Cloudinary-hosted images and interactive Leaflet maps to view exact locations. Before booking, they can take a virtual tour via Zoom, with meeting links generated dynamically using the Zoom API. A wishlist feature allows users to save venues for later, and they can also leave reviews to help others make informed decisions. Additionally, hosts can list their own venues by submitting details and uploading images. The platform is enhanced with Framer Motion for smooth animations, providing a polished and engaging experience for both venue seekers and hosts.",
    type: "Websites",
    github: "https://github.com/Dharmesh53/havns",
    live: "https://havns.vercel.app",
    media: "/projects/havns.webp",
  },
  {
    title: "Production Crate : UI Clone",
    date: ["Sept 2022"],
    description: createElement(
      "span",
      null,
      "This project was created during my 2nd semester of undergraduation, when we had web development in curriculum. ",
      "I built this UI clone to practice my CSS skills, as I hadn't yet learned JavaScript at that time. ",
      "You can view the original website on ",
      createElement(
        "a",
        {
          href: "https://www.productioncrate.com",
          target: "_blank",
          rel: "noopener noreferrer",
          style: { textDecoration: "underline" },
        },
        "Production Crate",
      ),
      ". The original site might have changed since I created this clone during the summer of 2022. ",
      "It was a fun and challenging project, especially considering that ChatGPT wasn't available to assist us back then. ",
      "Whenever I encountered errors, I turned to YouTube tutorials for help. At that point, I also didn't know that CSS could be split into separate files, ",
      "so I ended up writing all my styles in a single CSS file, which ended up with around 2000 lines of code!",
    ),
    type: "Websites",
    github: "https://github.com/Dharmesh53/ProductionCrate-CSS-Clone",
    live: "https://dharmesh53.github.io/ProductionCrate-CSS-Clone",
    media: "/projects/production-crate.webp",
  },
  {
    title: "IP Based Server And Client Model Using Raw Sockets",
    date: ["Jun 2024"],
    description:
      "I developed a basic IP-based server and client system in C, utilizing raw sockets for low-level network communication. The system communicates by sending messages using IP packets directly between the server and client. By leveraging sys/socket.h, linux/ip.h, unistd.h, and arpa/inet.h, I implemented a solution that interacts with the network layer of the OSI model, bypassing higher-level protocols. This was achieved by manually crafting IP headers to encapsulate data and transmitting it over raw sockets. The server and client communicate efficiently while directly managing network interactions, providing a deeper understanding of the fundamental mechanisms that drive network communication. The project helped me explore and work with low-level network protocols, providing hands-on experience in socket programming and data encapsulation at the IP layer.",
    type: "Foundational Concepts",
    github: "https://github.com/Dharmesh53/IP-Server-And-Client-Model",
    media: "/projects/ip.webp",
  },
  {
    title: "Sorting Algorithms",
    date: ["Jul 2024"],
    description:
      "One day, while working on a LeetCode problem that required knowledge of a sorting algorithm, I realized I didn't fully understand it. This prompted me to revisit the algorithm, and during that process, I decided to revise all the algorithms I knew. As I continued exploring different algorithms, I got more curious about their differences and performance. This led me to write out all the algorithms and compare them. I analyzed their time and space complexities, and performance. In the end, I not only gained a deeper understanding of sorting algorithms but also enhanced my knowledge of various other algorithms, which improved my problem-solving skills and gave me a better perspective on choosing the right algorithm for different problems.",
    type: "Foundational Concepts",
    github: "https://github.com/Dharmesh53/All-Sorting-Methods",
    media: "/projects/sort.webp",
  },
  {
    title: "Authentication And Authorization",
    date: ["Sept 2024", "Oct 2024"],
    description:
      "This project was created to gain a thorough understanding of Authentication and Authorization. It features three different methods of handling authentication. First, it implements session token-based authentication to manage user sessions. The second method uses JWT-based authentication, where I followed all the necessary security parameters mentioned on owasp.org and even implemented CSRF protection from scratch, storing the token in memory within the JavaScript code. The third method incorporates Google OAuth authentication in a Next.js application, handling sign-ins via Google. Additionally, I added features like password recovery, email verification, two-factor authentication, and role-based authentication. This project not only helped me understand the core principles of securing applications but also provided hands-on experience with various advanced techniques, ensuring a robust and secure authentication system for users.",
    type: "Foundational Concepts",
    github: "https://github.com/Dharmesh53/Authentication",
    media: "/projects/auth.webp",
  },
];
