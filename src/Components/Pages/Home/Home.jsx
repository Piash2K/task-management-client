import AddTaskForm from "./AddTaskForm";
import TaskBoard from "./TaskBoard";

const Home = () => {
    return (
        <div>
            
            <main className="w-9/12 mx-auto py-6 sm:px-6 lg:px-8">
                <AddTaskForm onAddTask={(task) => console.log('New task:', task)} />
                <TaskBoard />
            </main>
        </div>
    );
};

export default Home;