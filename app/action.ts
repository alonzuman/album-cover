"use server";

import { createImageGeneration, getImageGeneration } from "@/lib/replicate";

export async function createCover(formData: FormData) {
  const image1 = formData.get("image1");
  const image2 = formData.get("image2");

  // TODO Create the prompt by mixing the descriptions of both images
  const image1Description = "a bright abstract painting";
  const image2Description = "a cyborg";
  const generatedPrompt = `An album cover of a ${image1Description} and a ${image2Description}`;

  // Run the model with both images
  const gen = await createImageGeneration({
    prompt: generatedPrompt,
    image1: image1 as any,
    image2: image2 as any,
  });

  console.log("gen", gen.id, Date.now());

  // Put the result in the object store

  // Put the result meta in the db

  // Return the generation
  return { ...gen };
}

export async function getCover(id: string) {
  // TODO Get the generation from the db
  const gen = await getImageGeneration(id);

  // Return the generation
  return gen;
}
