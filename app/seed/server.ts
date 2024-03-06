"use server";

import { db } from "@/lib/db";
import { createBlobUrl } from "@/lib/utils";
import { del, list, put } from "@vercel/blob";
import fs from "fs";
import { getId } from "@/lib/utils";

const ALBUMS = [
  {
    id: getId(),
    name: "Abbey Road",
    artist: "The Beatles",
    url: "/covers/1.webp",
  },
  {
    id: getId(),
    name: "Horses/Horses",
    artist: "Patti Smith",
    url: "/covers/2.webp",
  },
  {
    id: getId(),
    name: "Ready to Die",
    artist: "The Notorious B.I.G.",
    url: "/covers/3.webp",
  },
  {
    id: getId(),
    name: "Led Zeppelin",
    artist: "Led Zeppelin",
    url: "/covers/4.webp",
  },
  {
    id: getId(),
    name: "Nevermind",
    artist: "Nirvana",
    url: "/covers/5.webp",
  },
  {
    id: getId(),
    name: "To Pimp a Butterfly",
    artist: "Kendrick Lamar",
    url: "/covers/6.webp",
  },
];

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

  const seedPromises = ALBUMS.map(async (album) => {
    console.log("Seeding album", album.id);
    const albumUrlPath = process.cwd() + "/public" + album.url;
    const buffer = fs.readFileSync(albumUrlPath);

    const blobUrl = createBlobUrl({ folder: "covers", id: album.id });

    const putRes = await put(blobUrl, buffer, {
      contentType: "image/webp",
      access: "public",
    });

    await db.cover.create({
      data: {
        id: album.id,
        url: putRes.url,
        // Note that we are publishing the album covers as they are already
        // approved by us
        status: "published",
      },
    });
  });

  await Promise.all(seedPromises);
}
