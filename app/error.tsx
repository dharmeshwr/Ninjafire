"use client";

import { useEffect } from "react";

export default function Error({ error }: { error: Error }) {
  useEffect(() => console.error(error), [error]);

  return (
    <div>
      <p>Oops! Something went wrong... maybe try refreshing?</p>
      <pre>{JSON.stringify(error.message, null, 2)}</pre>
    </div>
  );
}
