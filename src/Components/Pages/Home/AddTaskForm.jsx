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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 mb-8 w-full sm:w-11/12 md:w-3/4 lg:w-9/12  mx-auto">
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-800 mb-2">Task Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50}
          className="mt-1 block w-full rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-teal-500 focus:border-teal-500 shadow-md focus:outline-none px-4 py-2 text-gray-700 placeholder-gray-500"
          placeholder="Enter task title"
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-800 mb-2">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
          rows={4}
          className="mt-1 block w-full rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-teal-500 focus:border-teal-500 shadow-md focus:outline-none px-4 py-2 text-gray-700 placeholder-gray-500"
          placeholder="Enter task description"
        />
      </div>
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-800 mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-teal-500 focus:border-teal-500 shadow-md focus:outline-none px-4 py-2 text-gray-700"
        >
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-lg hover:bg-teal-700 transition duration-300">
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;