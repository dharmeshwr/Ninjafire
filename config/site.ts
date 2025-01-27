const site_url = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const socialLinks = {
  twitter: "https://x.com/Dharmesh177208",
  github: "https://github.com/dharmesh53/",
  linkedin: "https://www.linkedin.com/in/dharmeshxr",
  email: "mailto:dharmeshwr@gmail.com",
};

export const metaData = {
  title: "Dharmesh's Portfolio",
  name: "Dharmesh",
  baseUrl: site_url,
  description: "This is all about myself.",
  ogImage: "/opengraph-image.png",
  links: { ...socialLinks },
  mailSupport: "dharmeshwr@gmail.com",
};
