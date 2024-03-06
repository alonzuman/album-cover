import React, { Suspense } from "react";
import { Covers } from "./covers";
import { listCovers } from "./actions";
import { Seed } from "./seed/client";

export default async function Page() {
  return (
    <>
      {/* <Seed /> */}
      <h2 className="font-medium mb-2">Latest</h2>
      <Suspense fallback="Loading...">
        <CoversList />
      </Suspense>
    </>
  );
}

async function CoversList() {
  const covers = await listCovers();
  return <Covers data={covers} />;
}
