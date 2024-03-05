import React, { Suspense } from "react";
import { Covers } from "./covers";
import { listCovers, seed } from "./action";
import { Button } from "@/components/ui/button";

export default async function Page() {
  return (
    <>
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

function SeedButton() {
  return (
    <form action={seed}>
      <Button>Seed</Button>
    </form>
  );
}
