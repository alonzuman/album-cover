import React, { Suspense } from "react";
import { CoversList } from "./covers";
import { listCovers } from "./actions";
// import { Seed } from "./seed/client";

export default async function Page() {
  return (
    <>
      {/* <Seed /> */}
      <h1 className="text-xl font-medium mb-2">Latest</h1>
      <Suspense fallback="Loading...">
        <Covers />
      </Suspense>
    </>
  );
}

async function Covers() {
  const covers = await listCovers();
  return <CoversList data={covers} />;
}
