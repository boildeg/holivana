import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not get loaded");
  }

  return data;
}

export async function createCabin(newCabin) {
  const imageName = `${Math.ceil(Math.random() * 5000000)}-${
    newCabin.image.name
  }`;

  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  //1. create the cabin
  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagePath }])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  //2. upload the image
  const { error: uploadError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  if (uploadError) {
    await supabase.from("cabins").delete().eq("id", data[0].id);
    console.error(uploadError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }

  return data;
}

export async function editCabin({ image, ...cabin }) {
  // If there's no new image, just update the cabin data
  if (!image) {
    const { data, error } = await supabase
      .from("cabins")
      .update(cabin)
      .eq("id", cabin.id)
      .select();

    if (error) {
      console.error(error);
      throw new Error("Cabin could not be edited");
    }
    return data;
  }

  // If there is a new image, handle like in createCabin
  const imageName = `${Math.ceil(Math.random() * 5000000)}-${image.name}`;
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Upload the new image
  const { error: uploadError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, image);

  if (uploadError) {
    console.error(uploadError);
    throw new Error("Cabin image could not be uploaded");
  }

  // 2. Update cabin with new image path
  const { data, error } = await supabase
    .from("cabins")
    .update({ ...cabin, image: imagePath })
    .eq("id", cabin.id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be edited");
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
