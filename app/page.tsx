import React, { Suspense } from "react";
import { CoversList } from "./covers";
import { listCovers } from "./actions";
import { Seed } from "./seed/client";

export default async function Page() {
  return (
    <>
      {/* <Seed /> */}
      <h2 className="font-medium mb-2">Latest</h2>
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
