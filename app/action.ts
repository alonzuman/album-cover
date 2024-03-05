"use server";
export async function generateCover(formData: FormData) {
  const image1 = formData.get("image1");
  const image2 = formData.get("image2");

  // Get the images

  // Run the model with both images

  // Put the result in the DB

  // Store it in the DB

  // Return the generation url
  return { id: "1234" };
}
