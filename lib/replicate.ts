import Replicate from "replicate";
import { z } from "zod";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  fetch: (...args) =>
    // This is a fix for the aggressive Next.js caching strategy
    fetch(args[0], {
      ...args[1],
      cache: "no-store",
    }),
});

const imageGenerationInputSchema = z.object({
  prompt: z.string(),
  image1: z.string().url(),
  image2: z.string().url(),
});

const imageGenerationOutputSchema = z.object({
  id: z.string(),
  model: z.string(),
  version: z.string(),
  input: z
    .object({
      added_merge_noise: z.number().optional(),
      base_model: z.string().optional(),
      batch_size: z.number().optional(),
      height: z.number().optional(),
      image_1: z.string().url().optional(),
      image_2: z.string().url().optional(),
      merge_strength: z.number().optional(),
      negative_prompt: z.string().optional(),
      prompt: z.string().optional(),
      steps: z.number().optional(),
      width: z.number().optional(),
    })
    .optional(),
  logs: z.string().optional(),
  error: z.string().nullish().optional(),
  status: z.string().optional(),
  created_at: z.string().optional(),
  output: z.string().array().optional(),
  urls: z
    .object({
      cancel: z.string().optional(),
      get: z.string().optional(),
    })
    .optional(),
});

export async function createImageGeneration(
  args: z.infer<typeof imageGenerationInputSchema>
) {
  // console.log("[createImageGeneration]", args);
  const { image1, image2, prompt } = imageGenerationInputSchema.parse(args);

  const res = await replicate.predictions.create({
    input: {
      steps: 20,
      width: 1024,
      height: 1024,
      prompt: prompt,
      image_1: image1,
      image_2: image2,
      base_model: "albedobaseXL_v13.safetensors",
      batch_size: 1,
      merge_strength: 0.75,
      negative_prompt: "",
      added_merge_noise: 0,
    },
    version: "5fd9159399134ae0dd7b06bbbaabe7e7c15dbfec8b038eddef2ca3aa03355620",
  });

  // Parse the result data
  return imageGenerationOutputSchema.parse(res);
}

export async function getImageGeneration(id: string) {
  // console.log("[getImageGeneration]", id);
  const res = await replicate.predictions.get(id);
  return imageGenerationOutputSchema.parse(res);
}

const createImageCaptionInputSchema = z.object({
  image: z.string().url(),
});

const createImageCaptionReplicateOutputSchema = z.string();

export async function createImageCaption(
  args: z.infer<typeof createImageCaptionInputSchema>
) {
  // console.log("[createImageCaption]", args);
  const output = await replicate.run(
    "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
    {
      input: {
        task: "image_captioning",
        image: args.image
      },
    }
  );

  const parsedOutput = createImageCaptionReplicateOutputSchema.parse(output);

  return {
    caption: parsedOutput?.replace("Caption: ", ""),
  };
}
