import { useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../Provider/Authprovider";
import { io } from "socket.io-client";

const socket = io("https://task-management-server-o7it.onrender.com");

const AddTaskForm = ({ onAddTask, userEmail }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("to-do");
  const { user } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      timestamp: new Date().toISOString(),
      category,
      userEmail: user.email,
    };

    axios
      .post("https://task-management-server-o7it.onrender.com/tasks", newTask)
      .then((response) => {
        onAddTask(response.data);
        setTitle("");
        setDescription("");
        setCategory("to-do");

        socket.emit("taskAdded", response.data);

        Swal.fire({
          title: "Success!",
          text: "Task added successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      })
      .catch((error) => {
        console.error("Error adding task:", error);

        Swal.fire({
          title: "Error!",
          text: "There was an issue adding the task. Please try again.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Task Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Enter task title"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Enter task description"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md">
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;