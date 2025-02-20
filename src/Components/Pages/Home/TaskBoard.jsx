import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext } from "react-beautiful-dnd";
import TaskColumn from "./TaskColumn";

const TaskBoard = ({ userEmail }) => {
  const [columns, setColumns] = useState({
    "to-do": { id: "to-do", title: "To Do", tasks: [] },
    "in-progress": { id: "in-progress", title: "In Progress", tasks: [] },
    "done": { id: "done", title: "Done", tasks: [] },
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/tasks/${userEmail}`).then((response) => {
      const tasks = response.data;
      setColumns({
        "to-do": { id: "to-do", title: "To Do", tasks: tasks.filter((t) => t.category === "to-do") },
        "in-progress": { id: "in-progress", title: "In Progress", tasks: tasks.filter((t) => t.category === "in-progress") },
        "done": { id: "done", title: "Done", tasks: tasks.filter((t) => t.category === "done") },
      });
    });
  }, [userEmail]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = [...destColumn.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: { ...destColumn, tasks: destTasks },
    });

    axios.patch(`http://localhost:5000/tasks/category/${movedTask.id}`, { category: destination.droppableId });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Board</h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(columns).map((column) => (
              <TaskColumn key={column.id} column={column} />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TaskBoard;