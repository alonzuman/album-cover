import React, { Suspense } from "react";
import { Explore } from "./explore";
// import { Seed } from "./seed/client";

// TODO consider maybe revalidating every minute
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      {/* <Seed /> */}
      <Suspense fallback="Loading...">
        <Explore />
      </Suspense>
    </>
  );
}
