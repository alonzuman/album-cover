"use server";

import { db } from "@/lib/db";
import { createBlobUrl } from "@/lib/utils";
import { del, list, put } from "@vercel/blob";
import fs from "fs";
import { getId } from "@/lib/utils";
import { createImageCaption } from "@/lib/replicate";

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

  // Read dir public/covers
  const coversPaths = fs.readdirSync(process.cwd() + "/public/covers");
  // Get the album buffer in an array
  const coverBuffers = coversPaths.map((coverPath) => {
    return fs.readFileSync(process.cwd() + "/public/covers/" + coverPath);
  });

  await Promise.all(
    coverBuffers.map(async (cover) => {
      const blobUrl = createBlobUrl({ folder: "covers", id: getId() });

      // Upload the image to the object store
      const putRes = await put(blobUrl, cover, {
        contentType: "image/webp",
        access: "public",
      });

      // Get the caption
      const imageCaptionRes = await createImageCaption({ image: putRes.url });

      await db.cover.create({
        data: {
          id: getId(),
          url: putRes.url,
          prompt: imageCaptionRes.caption,
          // Note that we are publishing the album covers as they are already
          // approved by us
          status: "published",
        },
      });
    })
  );

  console.log("Seeded!");
}
