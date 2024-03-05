import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: "https://www.npmjs.com/package/create-replicate",
});

export async function run() {
  const model =
    "fofr/image-merge-sdxl:5fd9159399134ae0dd7b06bbbaabe7e7c15dbfec8b038eddef2ca3aa03355620";
  const input = {
    steps: 20,
    width: 1024,
    height: 1024,
    prompt: "a bright abstract painting of a cyborg",
    image_1:
      "https://replicate.delivery/pbxt/KRyveMWjBWpI9NR6GuK1B1GoJMUhlvfUEa0yq6RWBqz3HaP5/ComfyUI_00319_.png",
    image_2:
      "https://replicate.delivery/pbxt/KRyveLQ82s8OdaAqUNIV5kbH3dPIdrGTqO9ka1IK5TecpWz0/output-0.png",
    base_model: "albedobaseXL_v13.safetensors",
    batch_size: 1,
    merge_strength: 0.92,
    negative_prompt: "",
    added_merge_noise: 0,
  };
  console.log("Running...");
  const output = await replicate.run(model, { input });
  console.log("Done!", output);
}
