import api from "../api";

export default function useCloudinaryUpload(folder = "nodecart") {
  async function sign() {
    const { data } = await api.get(`/api/upload/sign?folder=${encodeURIComponent(folder)}`);
    return data; // { cloudName, apiKey, timestamp, folder, signature }
  }

  async function upload(file) {
    const s = await sign();
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", s.apiKey);
    form.append("timestamp", s.timestamp);
    form.append("folder", s.folder);
    form.append("signature", s.signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${s.cloudName}/auto/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error("Upload failed");
    const json = await res.json();
    return { url: json.secure_url, publicId: json.public_id };
  }

  return { upload };
}