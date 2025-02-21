import { useContext, useEffect, useState, useMemo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import TaskColumn from "./TaskColumn";
import { AuthContext } from "../../Provider/Authprovider";
import { RotatingLines } from "react-loader-spinner";
import { io } from "socket.io-client";

const socket = io("https://task-management-server-o7it.onrender.com", {
  transports: ["websocket"],
  secure: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

const COLUMN_ORDER = ['to-do', 'in-progress', 'done'];

const fetchTasks = async (email) => {
  const res = await axios.get(`https://task-management-server-o7it.onrender.com/tasks/${email}`);
  return res.data;
};

const updateTaskOrder = async (taskId, category, order) => {
  return axios.patch(`https://task-management-server-o7it.onrender.com/tasks/category/${taskId}`, {
    category,
    order,
  });
};

const TaskBoard = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: () => fetchTasks(user.email),
    enabled: !!user?.email,
  });

  const [columns, setColumns] = useState({});

  useEffect(() => {
    const initializeColumns = () => {
      return COLUMN_ORDER.reduce((acc, category) => {
        acc[category] = { id: category, title: category.replace("-", " "), tasks: [] };
        return acc;
      }, {});
    };

    if (tasks.length) {
      const groupedTasks = tasks.reduce((acc, task) => {
        if (!acc[task.category]) {
          acc[task.category] = { id: task.category, title: task.category.replace("-", " "), tasks: [] };
        }
        acc[task.category].tasks.push(task);
        return acc;
      }, initializeColumns());

      Object.values(groupedTasks).forEach(column => {
        column.tasks.sort((a, b) => a.order - b.order);
      });

      setColumns(groupedTasks);
    } else {
      setColumns(initializeColumns());
    }
  }, [tasks]);

  useEffect(() => {
    if (!user?.email) return;

    socket.on("taskAdded", (newTask) => {
      if (newTask.userEmail === user.email) {
        setColumns((prevColumns) => {
          const updatedColumns = { ...prevColumns };
          const column = updatedColumns[newTask.category];
          if (column && !column.tasks.find((task) => task._id === newTask._id)) {
            column.tasks.push(newTask);
            column.tasks.sort((a, b) => a.order - b.order);
          }
          return updatedColumns;
        });
      }
    });

    socket.on("taskDeleted", (taskId) => {
      setColumns((prevColumns) => {
        const updatedColumns = { ...prevColumns };
        Object.values(updatedColumns).forEach((column) => {
          column.tasks = column.tasks.filter((task) => task._id !== taskId);
        });
        return updatedColumns;
      });
    });

    socket.on("taskUpdated", (updatedTask) => {
      if (updatedTask.userEmail === user.email) {
        setColumns((prevColumns) => {
          const updatedColumns = { ...prevColumns };
          const column = updatedColumns[updatedTask.category];
          if (column) {
            column.tasks = column.tasks.map((task) =>
              task._id === updatedTask._id ? updatedTask : task
            );
          }
          return updatedColumns;
        });
      }
    });

    socket.on("taskCategoryUpdated", ({ _id, category, userEmail }) => {
      if (userEmail === user.email) {
        setColumns((prevColumns) => {
          const updatedColumns = { ...prevColumns };
          let movedTask = null;

          Object.values(updatedColumns).forEach((column) => {
            const index = column.tasks.findIndex((task) => task._id === _id);
            if (index !== -1) {
              movedTask = column.tasks.splice(index, 1)[0];
            }
          });

          if (movedTask) {
            movedTask.category = category;
            updatedColumns[category].tasks.push(movedTask);
            updatedColumns[category].tasks.sort((a, b) => a.order - b.order);
          }

          return updatedColumns;
        });
      }
    });

    socket.on("tasksReordered", (updatedTasks) => {
      updatedTasks.forEach((task) => {
        if (task.userEmail === user.email) {
          setColumns((prevColumns) => {
            const updatedColumns = { ...prevColumns };

            const column = updatedColumns[task.category];
            if (column) {
              const index = column.tasks.findIndex((t) => t._id === task._id);
              if (index !== -1) {
                column.tasks[index] = task;
              }
            }

            return updatedColumns;
          });
        }
      });
    });

    return () => {
      socket.off("taskAdded");
      socket.off("taskDeleted");
      socket.off("taskUpdated");
      socket.off("taskCategoryUpdated");
      socket.off("tasksReordered");
    };
  }, [user?.email]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const updatedColumns = { ...columns };

    const [movedTask] = updatedColumns[source.droppableId].tasks.splice(source.index, 1);

    updatedColumns[destination.droppableId].tasks.splice(destination.index, 0, movedTask);

    movedTask.category = destination.droppableId;
    movedTask.order = destination.index;

    setColumns(updatedColumns);

    try {
      await updateTaskOrder(draggableId, destination.droppableId, destination.index);
      queryClient.invalidateQueries(["tasks", user.email]);
      socket.emit("taskCategoryUpdated", { _id: draggableId, category: destination.droppableId, userEmail: user.email });

    } catch (error) {
      console.error("Failed to update task order:", error);
      setColumns(columns);
    }
  };

  const memoizedColumns = useMemo(() => columns, [columns]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Board</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <RotatingLines strokeColor="gray" strokeWidth="5" animationDuration="0.75" width="50" visible={true} />
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COLUMN_ORDER.map((columnId) => (
                <TaskColumn key={columnId} column={memoizedColumns[columnId]} queryClient={queryClient} userEmail={user?.email} />
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;