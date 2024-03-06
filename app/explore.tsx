import React, { Suspense } from "react";
import { listCovers } from "./actions";
import { CoversList } from "./covers-list";

export async function Explore() {
  const covers = await listCovers();

  return <CoversList data={covers} />;
}
