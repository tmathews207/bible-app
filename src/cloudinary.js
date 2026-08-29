// Unsigned upload straight from the browser — there is no backend server to
// sign requests. Create an "unsigned" upload preset in your Cloudinary
// console (Settings -> Upload -> Upload presets) and set the two env vars
// below. See README.md for the walkthrough.
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImage(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary is not configured yet. Set VITE_CLOUDINARY_CLOUD_NAME and ' +
        'VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.secure_url;
}
