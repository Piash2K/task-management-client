import { useContext, useEffect, useState, useMemo } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import TaskColumn from "./TaskColumn";
import { AuthContext } from "../../Provider/Authprovider";
import { RotatingLines } from "react-loader-spinner";

const fetchTasks = async (email) => {
  const res = await axios.get(`http://localhost:5000/tasks/${email}`);
  return res.data;
};

const updateTaskOrder = async (taskId, category, order) => {
  return axios.patch(`http://localhost:5000/tasks/category/${taskId}`, {
    category: category,
    order: order,
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
    if (tasks.length) {
      const groupedTasks = tasks.reduce((acc, task) => {
        acc[task.category] = acc[task.category] || { id: task.category, title: task.category.replace("-", " "), tasks: [] };
        acc[task.category].tasks.push(task);
        return acc;
      }, {});

      Object.values(groupedTasks).forEach(column => {
        column.tasks.sort((a, b) => a.order - b.order);
      });

      setColumns(groupedTasks);
    }
  }, [tasks]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceColumn = { ...columns[source.droppableId], tasks: [...columns[source.droppableId].tasks] };
    const destColumn = { ...columns[destination.droppableId], tasks: [...columns[destination.droppableId].tasks] };

    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
    destColumn.tasks.splice(destination.index, 0, movedTask);

    const updatedColumns = {
      ...columns,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    };

    setColumns(updatedColumns);

    try {
      await updateTaskOrder(draggableId, destination.droppableId, destination.index);
      queryClient.invalidateQueries(["tasks", user.email]);
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
              {Object.values(memoizedColumns).map((column) => (
                <TaskColumn key={column.id} column={column} queryClient={queryClient} userEmail={user?.email} />
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;