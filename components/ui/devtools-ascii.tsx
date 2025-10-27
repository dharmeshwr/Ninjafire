"use client";

import { useEffect } from "react";

export default function DevToolsDetector() {
  useEffect(() => {
    let devtoolsOpen = false;
    const threshold = 160;

    const checkDevTools = () => {
      const diffHeight = window.outerHeight - window.innerHeight;
      const diffWidth = window.outerWidth - window.innerWidth;
      const isOpen = diffHeight > threshold || diffWidth > threshold;

      if (isOpen && !devtoolsOpen) {
        devtoolsOpen = true;
        showAsciiArt();
      } else if (!isOpen) {
        devtoolsOpen = false;
      }
    };

    const intervalId = setInterval(checkDevTools, 500);
    checkDevTools(); // Initial check

    return () => clearInterval(intervalId);
  }, []);

  const showAsciiArt = () => {
    const art = [
      " /$$   /$$ /$$                          /$$$$$$  /$$                    ",
      "| $$$ | $$|__/                         /$$__  $$|__/                    ",
      "| $$$$| $$ /$$ /$$$$$$$  /$$  /$$$$$$ | $$  \__/ /$$  /$$$$$$   /$$$$$$ ",
      "| $$ $$ $$| $$| $$__  $$|__/ |____  $$| $$$$    | $$ /$$__  $$ /$$__  $$",
      "| $$  $$$$| $$| $$  \ $$ /$$  /$$$$$$$| $$_/    | $$| $$  \__/| $$$$$$$$",
      "| $$\  $$$| $$| $$  | $$| $$ /$$__  $$| $$      | $$| $$      | $$_____/",
      "| $$ \  $$| $$| $$  | $$| $$|  $$$$$$$| $$      | $$| $$      |  $$$$$$$",
      "|__/  \__/|__/|__/  |__/| $$ \_______/|__/      |__/|__/       \_______/",
      "                 /$$  | $$                                              ",
      "                |  $$$$$$/                                              ",
      "                 \______/                                               ",
    ];

    console.log(
      "%c" + art[0],
      "color: #ff6b6b; font-family: monospace; font-size: 12px;",
    );
    console.log(
      "%c" + art[1],
      "color: #4ecdc4; font-family: monospace; font-size: 12px;",
    );
    console.log(
      "%c" + art[2],
      "color: #45b7d1; font-family: monospace; font-size: 12px;",
    );
    console.log(
      "%c" + art[3],
      "color: #96ceb4; font-family: monospace; font-size: 12px;",
    );
    console.log(
      "%c" + art[4],
      "color: #feca57; font-family: monospace; font-size: 12px;",
    );
    console.log(
      "%c" + art[5],
      "color: #ff6b6b; font-family: monospace; font-size: 12px;",
    );
    console.log(
      "%c" + art[6],
      "color: #4ecdc4; font-family: monospace; font-size: 12px;",
    );
    console.log(
      "%c" + art[7],
      "color: #45b7d1; font-family: monospace; font-size: 12px;",
    );
    console.log(
      "%c" + art[8],
      "color: #96ceb4; font-family: monospace; font-size: 12px;",
    );
    console.log(
      "%c" + art[9],
      "color: #feca57; font-family: monospace; font-size: 12px;",
    );
    console.log(
      "%c" + art[10],
      "color: #ff6b6b; font-family: monospace; font-size: 12px;",
    );

    console.log(
      "%cWhat business do you have here ? huhhhhhhhh!!",
      "color: #ffeaa7; font-family: monospace;",
    );
  };

  return null;
}
