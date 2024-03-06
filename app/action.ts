"use server";
import { db } from "@/lib/db";
import { createImageGeneration, getImageGeneration } from "@/lib/replicate";
import { ALBUMS } from "./data";
import { put, del, list } from "@vercel/blob";
import fs from "fs";
import { getId } from "@/lib/utils";

export async function createCover(formData: FormData) {
  console.log("[createCover]");
  const image1Url = formData.get("image1") as string;
  const image2Url = formData.get("image2") as string;

  if (!image1Url || !image2Url) throw new Error("Missing image");

  // TODO Create the prompt by mixing the descriptions of both images
  const image1Description = "a bright abstract painting";
  const image2Description = "a cyborg";
  const generatedPrompt = `An album cover of a ${image1Description} and a ${image2Description}`;

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
      status: "processing",
    },
  });

  // Return the generation
  return cover;
}

export async function getCover(id: string) {
  console.log("[getCover]", id);
  let cover = await db.cover.findUnique({
    where: {
      id,
    },
  });

  if (cover?.status === "succeeded") return cover;

  // Get the generation from the db
  const generation = await getImageGeneration(id);

  console.log(generation.status);
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
    });
  }

  // TODO handle error cases
  if (generation.status === "failed" || generation.status === "error") {
    console.log(generation.error);

    cover = await db.cover.update({
      where: {
        id,
      },
      data: {
        status: "error",
      },
    });
  }

  // Return the generation
  return cover;
}

export async function listCovers() {
  const covers = await db.cover.findMany({
    where: {
      status: {
        in: ["succeeded", "published"],
      },
    },
  });
  return covers;
}

export type ListCovers = Awaited<ReturnType<typeof listCovers>>;

export async function seed() {
  console.log("[seed]", "🌱");

  // Delete covers
  console.log("Deleting covers...");
  await db.cover.deleteMany({});
  console.log("Deleted covers");

  console.log("Deleting blobs...");
  const res = await list();
  await Promise.all(
    res.blobs.map(async (blob) => {
      await del(blob.url);
    })
  );
  console.log("Deleted blobs");

  for (let i = 0; i < ALBUMS.length; i++) {
    console.log("Seeding album", i);
    const album = ALBUMS[i];
    // Transform the image to a blobg

    const albumUrlPath = process.cwd() + "/public" + album.url;
    const buffer = fs.readFileSync(albumUrlPath);

    // Put it in the object store
    const blobUrl = createBlobUrl({ folder: "covers", id: album.id });

    const putRes = await put(blobUrl, buffer, {
      contentType: "image/jpeg",
      access: "public",
    });

    await db.cover.create({
      data: {
        id: album.id,
        url: putRes.url,
      },
    });
  }
}

function createBlobUrl(args: { folder: string; id: string }) {
  const path = args.id || getId();

  return `covers/${path}`;
}
