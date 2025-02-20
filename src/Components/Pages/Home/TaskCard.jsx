import { Draggable } from "react-beautiful-dnd";
import { format } from "date-fns";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const TaskCard = ({ task, index }) => {
  const handleDelete = () => {
    axios.delete(`http://localhost:5000/tasks/${task.id}`).then(() => {
      window.location.reload();
    });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg shadow-sm p-4 mb-2 ${snapshot.isDragging ? "shadow-lg" : ""}`}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-blue-500">
                <PencilIcon className="h-4 w-4" />
              </button>
              <button onClick={handleDelete} className="text-gray-400 hover:text-red-500">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          {task.description && <p className="text-sm text-gray-600 mt-2">{task.description}</p>}
          <div className="mt-4 text-xs text-gray-500">Created: {format(new Date(task.timestamp), "MMM d, yyyy")}</div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;