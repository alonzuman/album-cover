import { getCover } from "@/app/action";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

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

  // Have a counter for safety
  let count = 0;
  const MAX_COUNT = 30;

  // Not returning anything so the component will be suspended
  while (cover?.status === "processing" && count < MAX_COUNT) {
    // Sleep for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Refetch it
    cover = await getCover(props.coverId);

    // Increment the counter
    count++;
  }

  if (count >= MAX_COUNT) {
    return (
      <div>
        <h1>Timeout</h1>
        <p>It took too long to process the cover</p>
        <Button>Try Again</Button>
      </div>
    );
  }

  return (
    <div>
      {cover?.url && (
        <Image src={cover?.url} width={1024} height={1024} alt={cover?.id} />
      )}
      <pre>{JSON.stringify(cover, null, 2)}</pre>
    </div>
  );
}
