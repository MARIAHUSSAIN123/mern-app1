import mongoose from "mongoose";

const MONGO_URI = "YOUR_MONGO_URL";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(MONGO_URI);
  isConnected = true;
};

const taskSchema = new mongoose.Schema({
  title: String,
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const tasks = await Task.find();
    return res.status(200).json(tasks);
  }

  if (req.method === "POST") {
    const task = await Task.create(req.body);
    return res.status(201).json(task);
  }

  if (req.method === "PUT") {
    const { id } = req.query;
    const updated = await Task.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await Task.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted" });
  }
}