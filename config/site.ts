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

export const summary = `
  perspiciatis unde omnis iste natus error sit voluptatem accusantium
  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
  inventore veritatis et quasi architecto beatae vitae dicta sunt
  explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
  odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
  voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
  quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam
  eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
  voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam
  corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur
`;
