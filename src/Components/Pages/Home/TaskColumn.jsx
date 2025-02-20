import { useContext, useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import axios from "axios";
import { AuthContext } from "../../Provider/Authprovider";

const TaskColumn = ({ column, userEmail }) => {
  const [tasks, setTasks] = useState([]);
  const {user} = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/tasks/${user.email}`)
      .then((response) => {
        const tasksData = response.data.filter(task => task.category === column.id); // Filter tasks based on category
        setTasks(tasksData);
        console.log(tasksData)
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [user.email, column.id]);

  return (
    <div className="bg-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[150px]">
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;