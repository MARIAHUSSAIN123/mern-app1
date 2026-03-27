import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

const connectDB = async () => {
  try {
    if (isConnected) return;

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Error ❌", error);
    throw new Error("DB connection failed");
  }
};

// Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

// Prevent model overwrite (Vercel fix)
const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

// API handler
export default async function handler(req, res) {
  await connectDB();

  try {
    // 📥 GET
    if (req.method === "GET") {
      const tasks = await Task.find();
      return res.status(200).json(tasks);
    }

    // ➕ POST
    if (req.method === "POST") {
      const task = await Task.create(req.body);
      return res.status(201).json(task);
    }

    // ✏️ PUT
    if (req.method === "PUT") {
      const { id } = req.query;
      const updated = await Task.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json(updated);
    }

    // ❌ DELETE
    if (req.method === "DELETE") {
      const { id } = req.query;
      await Task.findByIdAndDelete(id);
      return res.status(200).json({ message: "Deleted" });
    }

    // 🚫 Method not allowed
    return res.status(405).json({ message: "Method Not Allowed" });

  } catch (error) {
    console.error("API Error ❌", error);
    return res.status(500).json({ message: "Server Error" });
  }
}
