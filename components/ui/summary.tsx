"use client";

import { PropsWithChildren, useEffect, useState } from "react";

import { metaData } from "@/config/site";
import { getMyAge } from "@/lib/utils";

export function Summary() {
  const [age, setAge] = useState(getMyAge);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAge(getMyAge());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="prose text-left leading-8 text-foreground">
      <p>
        Hi! I usually go by Dharmesh on the internet, I&apos;m an{" "}
        <span>{age}</span> old developer deeply passionate about building
        websites.
      </p>
      <p>
        My interests resides in scripting, open-source softwares, games,
        low-level and hardware stuff and I love linux, neovim, suckless simple
        terminal(ST), tiling window managers(DWM) and doing everything possible
        from command line, here are the
        <ExternalLink href={`${metaData.links.github}dotfiles`}>
          Dotfiles
        </ExternalLink>
        if you want to have a look.
      </p>
      <p>
        I&apos;m currently proficient in building websites using{" "}
        <strong className="text-foreground">
          {" "}
          ReactJS, NextJS, ExpressJS, WebSockets{" "}
        </strong>{" "}
        and both <i>relational and non relational databases</i>.
      </p>
      I have built
      <ExternalLink href={"https://promanage-ten.vercel.app"}>
        Promanage
      </ExternalLink>
      , a work management platform using ReactJS and ExpressJS with Socket.io
      and
      <ExternalLink href={"https://havns.vercel.app"}>Havns</ExternalLink>, a
      venue booking palatform using NextJS with Leaflet, Stripe API and Zoom API
      integration. You can find more information about my studies and project
      work in my <ExternalLink href="/resume">Resume</ExternalLink>.
      <p>
        Beyond tech, I enjoy watching webseries and animes shows and I love
        talking to friends.
      </p>
    </div>
  );
}

const ExternalLink = ({
  children,
  href,
}: PropsWithChildren & { href: string }) => {
  return (
    <a className="px-1 text-foreground" target="_blank" href={href}>
      {children}
    </a>
  );
};
