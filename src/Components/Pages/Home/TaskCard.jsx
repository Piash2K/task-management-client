import { useState, useEffect } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { format } from "date-fns";
import { PencilIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

const socket = io("https://task-management-server-o7it.onrender.com");

const TaskCard = ({ task, index, setTasks }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({
    title: task.title,
    description: task.description,
    category: task.category,
    order: task.order,
  });

  useEffect(() => {
    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    });
  
    socket.on("taskDeleted", (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));
    });
  
    socket.on("taskAdded", (newTask) => {
      setTasks((prevTasks) => {
        if (!prevTasks.some((task) => task._id === newTask._id)) {
          return [...prevTasks, newTask];
        }
        return prevTasks;
      });
    });
  
    return () => {
      socket.off("taskUpdated");
      socket.off("taskDeleted");
      socket.off("taskAdded");
    };
  }, [setTasks]);
  

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`https://task-management-server-o7it.onrender.com/tasks/${task._id}`);
    },
    onSuccess: () => {
      socket.emit("deleteTask", task._id);
      queryClient.invalidateQueries(["tasks"]);
      Swal.fire({
        title: "Deleted!",
        text: "Task has been deleted successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.patch(
        `https://task-management-server-o7it.onrender.com/tasks/${task._id}`,
        updatedTask
      );
      return response.data;
    },
    onSuccess: (data) => {
      socket.emit("updateTask", data);
      queryClient.invalidateQueries(["tasks"]);
      setIsEditing(false);
      Swal.fire({
        title: "Updated!",
        text: "Task has been updated successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    },
  });

  return (
    <>
      {task?._id && (
        <Draggable draggableId={task._id.toString()} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`bg-white rounded-lg shadow-sm p-4 mb-2 ${
                snapshot.isDragging ? "shadow-lg" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-500">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isLoading}
                    className="text-gray-400 hover:text-red-500"
                  >
                    {deleteMutation.isLoading ? (
                      <Oval height={20} width={20} color="#ff6347" />
                    ) : (
                      <TrashIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {task.description && <p className="text-sm text-gray-600 mt-2">{task.description}</p>}
              <div className="mt-4 text-xs text-gray-500">
                Created: {format(new Date(task.timestamp), "MMM d, yyyy")}
              </div>
            </div>
          )}
        </Draggable>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Edit Task</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-red-500">
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={updatedTask.title}
                onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                maxLength={50}
              />
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={updatedTask.description}
                onChange={(e) => setUpdatedTask({ ...updatedTask, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                maxLength={200}
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button
                onClick={() => updateMutation.mutate()}
                disabled={updateMutation.isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {updateMutation.isLoading ? (
                  <Oval height={20} width={20} color="#fff" />
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;