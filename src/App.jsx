import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  // 📥 GET
  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ➕ ADD / ✏️ UPDATE
  const handleSubmit = async () => {
    if (!task) return alert("Enter task");

    if (editId) {
      // ✏️ UPDATE
      await fetch(`/api/tasks?id=${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: task }),
      });

      setEditId(null);
    } else {
      // ➕ ADD
      await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: task }),
      });
    }

    setTask("");
    fetchTasks();
  };

  // ❌ DELETE
  const deleteTask = async (id) => {
    await fetch(`/api/tasks?id=${id}`, {
      method: "DELETE",
    });
    fetchTasks();
  };

  // ✏️ EDIT CLICK
  const editTask = (t) => {
    setTask(t.title);
    setEditId(t._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 flex flex-col items-center p-6">
      
      <h1 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">
        🍦 Ice Task Manager
      </h1>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl flex gap-2 w-full max-w-md">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter your task..."
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button
          onClick={handleSubmit}
          className={`px-4 py-2 rounded-lg text-white transition ${
            editId
              ? "bg-green-500 hover:bg-green-600"
              : "bg-purple-500 hover:bg-purple-600"
          }`}
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* Tasks */}
      <div className="mt-6 w-full max-w-md space-y-3">
        {tasks.map((t) => (
          <div
            key={t._id}
            className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow flex justify-between items-center hover:scale-[1.02] transition"
          >
            <span className="text-gray-800 font-medium">{t.title}</span>

            <div className="flex gap-2">
              <button
                onClick={() => editTask(t)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
              >
                ✏️
              </button>

              <button
                onClick={() => deleteTask(t._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;