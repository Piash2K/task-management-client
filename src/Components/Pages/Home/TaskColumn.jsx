import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const TaskColumn = ({ column, queryClient, userEmail }) => {
  const handleTaskUpdate = () => {
    queryClient.invalidateQueries(["tasks", userEmail]);
  };

  const handleTaskDelete = () => {
    queryClient.invalidateQueries(["tasks", userEmail]);
  };
  // console.log(column.id)
  return (
    <div className="bg-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">{column.title}</h2>
      <Droppable 
        droppableId={column.id}
        isCombineEnabled={true}
        isDropDisabled={false}
        ignoreContainerClipping={true}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[150px] transition-all duration-200 ease-in-out ${
              snapshot.isDraggingOver ? 'bg-gray-300' : ''
            }`}
          >
            {Array.isArray(column.tasks) && column.tasks.map((task, index) => (
              <TaskCard 
                key={task._id} 
                task={task} 
                index={index}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;