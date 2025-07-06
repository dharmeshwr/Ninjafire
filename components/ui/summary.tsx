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
        softwares.
      </p>
      <p>
        My interests resides in scripting, open-source softwares, games,
        low-level and hardware stuff and I love linux, neovim, suckless simple
        terminal(ST), tiling window managers(DWM) and here are the
        <ExternalLink href={`${metaData.links.github}dotfiles`}>
          dotfiles
        </ExternalLink>
        if you want to have a look.
      </p>
      <p>
        I&apos;m proficient in building websites using{" "}
        <strong className="text-foreground">
          {" "}
          ReactJS, NextJS, ExpressJS, ElectronJS, WebSockets{" "}
        </strong>{" "}
        and both <i>relational and non relational databases</i>.
      </p>
      <p>
        As a{" "}
        <strong className="text-foreground">
          Research Software Developer Intern
        </strong>{" "}
        at <i>YogLabs AI Research Foundation</i> (Feb 2025 &ndash; Present), I
        contributed to an{" "}
        <strong className="text-foreground">AI project</strong> to track student
        academic and skill progress. I conducted <i>surveys</i> to validate the
        product&rsquo;s need, designed a{" "}
        <strong className="text-foreground">microservice architecture</strong>,
        and developed a <i>React.js</i> web interface for seamless user
        interaction. Additionally, I built and deployed Python-based
        authentication and student serviceson <i>AWS Lambda</i> and implemented
        an extraction service on an <i>AWS EC2 instance</i>.
      </p>
      <p>
        I&apos;m currently developing two pieces of software. The first is a{" "}
        <ExternalLink href="https://github.com/NetMods/Rev">
          Screen Recorder
        </ExternalLink>
        , inspired by tools like Screen Studio, but with some of our own
        flavours as our first SaaS in collab with{" "}
        <ExternalLink href="https://aryan-snap.vercel.app/">
          @aryan
        </ExternalLink>
        . The second is a{" "}
        <ExternalLink href="https://github.com/dharmeshwr/Shift">
          File Manager
        </ExternalLink>{" "}
        built using <i>ElectronJS</i>, designed not as a commercial product but
        to get some understanding how things works under the hood.
      </p>
      I have built
      <ExternalLink href={"https://promanage-ten.vercel.app"}>
        Promanage
      </ExternalLink>
      , a project management platform using ReactJS and ExpressJS with Socket.io
      and
      <ExternalLink href={"https://havns.vercel.app"}>Havns</ExternalLink>, a
      venue booking palatform using NextJS with Leaflet, Stripe API and Zoom API
      integration. You can find more information about my studies and project
      work in my <ExternalLink href="/resume">Resume</ExternalLink>.
      <p>
        Beyond tech, I enjoy watching webseries and animes shows and I love
        talking to my friends.
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
