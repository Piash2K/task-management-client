import { useContext } from "react";
import AddTaskForm from "./AddTaskForm";
import TaskBoard from "./TaskBoard";
import { AuthContext } from "../../Provider/Authprovider";

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <main className="w-9/12 mx-auto py-6 sm:px-6 lg:px-8">
                {user ? (
                    <>
                        <AddTaskForm onAddTask={(task) => console.log('New task:', task)} />
                        <TaskBoard />
                    </>
                ) : (
                    <p className="text-center text-lg text-gray-600 mt-10">
                        Please <span className="font-semibold text-blue-500">log in</span> to manage your tasks.
                    </p>
                )}
            </main>
        </div>
    );
};

export default Home;