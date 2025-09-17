import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI missing in .env");

  mongoose.set("strictQuery", false);

  let tries = 0;
  const max = 5;
  while (tries < max) {
    try {
      await mongoose.connect(uri, {
        family: 4,                 // prefer IPv4
        tls: true,                 // Atlas requires TLS
        serverSelectionTimeoutMS: 20000,
        socketTimeoutMS: 45000
      });
      console.log("✅ MongoDB connected");
      return;
    } catch (err) {
      tries++;
      console.error(`❌ Mongo connect failed (${tries}/${max})`, err.message);
      if (tries >= max) throw err;
      await new Promise(r => setTimeout(r, 2000 * tries));
    }
  }
}