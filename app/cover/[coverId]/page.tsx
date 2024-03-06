import { getCover } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
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
        <p>
          It took too long to generate the cover art, try refreshing the page
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {cover?.url && (
        <Image
          className="rounded-md"
          src={cover?.url}
          width={1024}
          height={1024}
          alt={cover?.id}
        />
      )}
      {cover?.parentCovers && cover?.parentCovers?.length > 0 && (
        <>
          <h2 className="">Created from:</h2>
          <div className="flex gap-2">
            <Link href={`/cover/${cover?.parentCovers?.[0]?.id}`}>
              <Image
                key={cover?.parentCovers?.[0]?.id}
                className="rounded-md h-full w-full aspect-square object-cover"
                src={cover?.parentCovers?.[0]?.url ?? ""}
                width={100}
                height={100}
                alt={cover?.parentCovers?.[0]?.prompt ?? ""}
              />
            </Link>
            <div className="flex h-full flex-col p-4">+</div>
            <Link href={`/cover/${cover?.parentCovers?.[1]?.id}`}>
              <Image
                key={cover?.parentCovers?.[1]?.id}
                className="rounded-md h-full w-full aspect-square object-cover"
                src={cover?.parentCovers?.[1]?.url ?? ""}
                width={100}
                height={100}
                alt={cover?.parentCovers?.[1]?.prompt ?? ""}
              />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
