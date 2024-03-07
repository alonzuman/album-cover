"use server";
import { db } from "@/lib/db";
import {
  createImageCaption,
  createImageGeneration,
  getImageGeneration,
} from "@/lib/replicate";
import { put } from "@vercel/blob";
import { createBlobUrl } from "@/lib/utils";
import { Cover } from "@prisma/client";

const coverInclude = {
  parentCovers: true,
};

export async function createCover(formData: FormData) {
  console.log("[createCover]", Date.now());
  const cover1Id = formData.get("cover1") as string;
  const cover2Id = formData.get("cover2") as string;

  const [cover1, cover2] = await Promise.all([
    await getCover(cover1Id),
    await getCover(cover2Id),
  ]);

  const image1Url = cover1?.url;
  const image2Url = cover2?.url;

  if (!image1Url || !image2Url) throw new Error("Missing image");

  // Create the prompt by mixing the descriptions of both images
  const generatedPrompt = await generatePrompt({
    cover1,
    cover2,
  });

  // Run the model with both images
  const generation = await createImageGeneration({
    prompt: generatedPrompt,
    image1: image1Url,
    image2: image2Url,
  });

  // Put the result meta in the db
  const cover = await db.cover.create({
    data: {
      id: generation.id,
      prompt: generatedPrompt,
      status: "processing",
      parentCovers: {
        connect: [
          {
            id: cover1Id,
          },
          {
            id: cover2Id,
          },
        ],
      },
    },
  });

  // Return the generation
  return cover;
}

export async function getOrUpsertCover(id: string) {
  console.log("[getOrUpsertCover]", id, Date.now());
  const TIMEOUT = 30;
  let count = 0;

  while (count < TIMEOUT) {
    const cover = await getCover(id);
    if (cover?.status === "succeeded" || cover?.status === "published") {
      return cover;
    } else if (cover?.status === "error") {
      console.log("Error generating cover", cover);
      throw new Error("Error generating cover");
    }

    // Sleep for 1 sec
    console.log("Sleeping");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    count++;
  }
}

export async function getCover(id: string) {
  console.log("[getCover]", id, Date.now());
  let cover = await db.cover.findUnique({
    where: {
      id,
    },
    include: coverInclude,
  });

  if (cover?.status === "succeeded" || cover?.status === "published") {
    return cover;
  }

  // Get the generation from the db
  const generation = await getImageGeneration(id);

  if (generation.status === "succeeded") {
    // Get the first response
    const imageResponse = generation?.output?.[0];

    if (!imageResponse) throw new Error("No image response");

    // Fetch it and turn it into a buffer
    const blob = await fetch(imageResponse, {
      cache: "no-store",
    }).then((res) => res.blob());

    // Upload the image to the object store
    const blobUrl = createBlobUrl({ folder: "covers", id });
    const blobRes = await put(blobUrl, blob, {
      contentType: "image/jpeg",
      access: "public",
    });

    // Save the url in the db
    cover = await db.cover.update({
      where: {
        id,
      },
      data: {
        url: blobRes.url,
        status: "succeeded",
      },
      include: coverInclude,
    });
  }

  // TODO handle error cases better
  if (generation.status === "failed" || generation.status === "error") {
    console.error(generation.error, Date.now());
    cover = await db.cover.update({
      where: {
        id,
      },
      data: {
        status: "error",
      },
      include: coverInclude,
    });
  }

  // Return the generation
  return cover;
}

async function generatePrompt(args: { cover1: Cover; cover2: Cover }) {
  console.log("[generatePrompt]", args, Date.now());
  const [image1Caption, image2Caption] = await Promise.all([
    args.cover1.prompt
      ? { caption: args.cover1.prompt }
      : createImageCaption({ image: args.cover1.url as string }),
    args.cover2.prompt
      ? { caption: args.cover2.prompt }
      : createImageCaption({ image: args.cover1.url as string }),
  ]);

  return `An album cover of a mix between ${image1Caption.caption} and a ${image2Caption.caption}`;
}

export async function listCovers() {
  console.log("[listCovers]", Date.now());
  const covers = await db.cover.findMany({
    where: {
      status: "published",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return covers;
}

export type ListCovers = Awaited<ReturnType<typeof listCovers>>;
