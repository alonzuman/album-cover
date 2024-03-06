import { SubmitButton } from "@/components/submit-button";
import { db } from "@/lib/db";
import { Cover } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <>
      <h1 className="text-xl font-medium mb-2">Admin</h1>
      <Suspense fallback="Loading...">
        <NewCoversList />
      </Suspense>
    </>
  );
}

async function NewCoversList() {
  const covers = await db.cover.findMany({
    where: {
      // Get all succeeded generation that aren't approved
      status: "succeeded",
    },
  });

  return (
    <>
      {covers.map((cover) => (
        <NewCoverListItem key={cover.id} {...cover} />
      ))}
    </>
  );
}

function NewCoverListItem({ ...cover }: Cover) {
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        // console.log("Approve", cover.id);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {cover.url && <img src={cover.url} alt="cover" className="rounded-md" />}
      <div className="flex gap-4 p-4">
        <SubmitButton
          formAction={async (formData: FormData) => {
            "use server";
            console.log("Delete", cover.id);
            await db.cover.update({
              where: {
                id: cover.id,
              },
              data: {
                status: "deleted",
              },
            });
            revalidatePath("/admin");
          }}
          className="w-full"
          size="lg"
        >
          Remove
        </SubmitButton>
        <SubmitButton
          formAction={async (formData: FormData) => {
            "use server";
            console.log("Approve", cover.id);
            await db.cover.update({
              where: {
                id: cover.id,
              },
              data: {
                status: "published",
              },
            });
            revalidatePath("/admin");
          }}
          className="w-full"
          size="lg"
        >
          Approve
        </SubmitButton>
      </div>
    </form>
  );
}
