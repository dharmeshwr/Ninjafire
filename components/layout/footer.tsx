"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Rss, Twitter } from "lucide-react";

import { socialLinks } from "@/config/site";

const YEAR = new Date().getFullYear();

function SocialLink({ href, icon: Icon }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Icon />
    </a>
  );
}

function SocialLinks() {
  return (
    <div className="float-right flex gap-3.5 text-lg transition-opacity duration-300 hover:opacity-90">
      <SocialLink href={socialLinks.linkedin} icon={Linkedin} />
      <SocialLink href={socialLinks.twitter} icon={Twitter} />
      <SocialLink href={socialLinks.github} icon={Github} />
      <SocialLink href={socialLinks.email} icon={Mail} />
      <Link href="/rss.xml" target="_self">
        <Rss />
      </Link>
    </div>
  );
}

export default function Footer() {
  return (
    <small className="mt-16 flex items-center justify-between lg:mt-24">
      <span className="flex gap-1">
        <time>© {YEAR}</time>
        {
          // <a
          //   className="no-underline"
          //   href={socialLinks.twitter}
          //   target="_blank"
          //   rel="noopener noreferrer"
          // >
          //   {metaData.title}
          // </a>
        }
        <style jsx>{`
          @media screen and (max-width: 480px) {
            article {
              padding-top: 2rem;
              padding-bottom: 4rem;
            }
          }
        `}</style>
      </span>
      <SocialLinks />
    </small>
  );
}
