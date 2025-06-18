const site_url = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const socialLinks = {
  twitter: "https://x.com/Dharmeshwr",
  github: "https://github.com/dharmeshwr/",
  linkedin: "https://www.linkedin.com/in/dharmeshxr",
  email: "mailto:dharmeshwr@gmail.com",
};

export const metaData = {
  title: "Home",
  name: "Dharmesh",
  baseUrl: site_url,
  description: "This is all about myself.",
  links: { ...socialLinks },
  mailSupport: "dharmeshwr@gmail.com",
};

export const tagline = `I work with websites`;
