"use client";

import { useEffect, useState } from "react";

async function getVisitorLocation() {
  const res = await fetch("/api/get-address", {
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return data.location;
}

export function Address() {
  const [address, setAddress] = useState("Narnaul, Haryana");

  useEffect(() => {
    getVisitorLocation().then((loc) => {
      console.log(loc);
      setAddress(loc);
    });
  }, []);

  return <span>{address}</span>;
}
