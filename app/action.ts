"use server";
import { db } from "@/lib/db";
import { createImageGeneration, getImageGeneration } from "@/lib/replicate";
import { getId } from "@/lib/utils";
import { ALBUMS } from "./data";
import { put } from "@vercel/blob";
import fs from "fs";

export async function createCover(formData: FormData) {
  console.log("[createCover]");
  const image1 = formData.get("image1") as File;
  const image2 = formData.get("image2") as File;

  const [image1Url, image2Url] = await Promise.all([
    put(getId() + ".png", image1, { access: "public" }),
    put(getId() + ".png", image2, { access: "public" }),
  ]);
  

  // TODO Create the prompt by mixing the descriptions of both images
  const image1Description = "a bright abstract painting";
  const image2Description = "a cyborg";
  const generatedPrompt = `An album cover of a ${image1Description} and a ${image2Description}`;

  // Run the model with both images
  const generation = await createImageGeneration({
    prompt: generatedPrompt,
    image1: image1Url.url,
    image2: image2Url.url,
  });

  // Put the result in the object store

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

  if (generation.status === "succeeded" && !cover?.url) {
    console.log("UPDATING");
    // Get the first response
    const imageResponse = generation?.output?.[0];

    if (!imageResponse) throw new Error("No image response");

    // Fetch it and turn it into a buffer
    const blob = await fetch(imageResponse).then((res) => res.blob());

    // Get the file extension
    const fileExtension = imageResponse.split(".").pop();

    // Upload the image to the object store
    const blobRes = await put(id + fileExtension, blob, {
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
  const covers = await db.cover.findMany();
  return covers;
}

export type ListCovers = Awaited<ReturnType<typeof listCovers>>;

export async function seed() {
  for (let i = 0; i < ALBUMS.length; i++) {
    console.log("Seeding album", i);
    const album = ALBUMS[i];
    // Transform the image to a blobg

    const albumUrlPath = process.cwd() + "/public" + album.url;
    const buffer = fs.readFileSync(albumUrlPath);

    // Put it in the object store
    const fileName = album.url.split("/").pop();
    const fileExtension = fileName?.split(".").pop();

    const res = await put(album.id + fileExtension, buffer, {
      access: "public",
    });

    await db.cover.create({
      data: {
        id: album.id,
        url: res.url,
      },
    });
  }
}
