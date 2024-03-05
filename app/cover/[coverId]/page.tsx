import { getCover } from "@/app/action";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import React, { Suspense } from "react";

export const revalidate = 60;

export default async function Page(props: {
  params: {
    coverId: string;
  };
}) {
  return (
    <Suspense fallback="Loading cover...">
      <Cover coverId={props.params.coverId} />
    </Suspense>
  );
}

async function Cover(props: { coverId: string }) {
  // TODO replace it with fetch from my DB
  let cover = await getCover(props.coverId);

  // Not returning anything so the component will be suspended
  while (cover.status === "processing" || cover.status === "starting") {
    // Sleep for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Refetch it
    cover = await getCover(props.coverId);
  }

  return (
    <div>
      <h1>{cover.id}</h1>
      {cover?.output?.[0] && cover?.input?.prompt && (
        <Image
          src={cover?.output?.[0]}
          width={1024}
          height={1024}
          alt={cover?.input?.prompt}
        />
      )}
      <pre>{JSON.stringify(cover, null, 2)}</pre>
    </div>
  );
}
