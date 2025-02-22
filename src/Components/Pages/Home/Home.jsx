import { useContext } from "react";
import AddTaskForm from "./AddTaskForm";
import TaskBoard from "./TaskBoard";
import { AuthContext } from "../../Provider/Authprovider";
import { Helmet } from "react-helmet";

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <Helmet><title>Home | TaskManager</title></Helmet>
            <main className="py-6 sm:px-6 lg:px-8">
                {user ? (
                    <div>
                        <AddTaskForm onAddTask={(task) => console.log('New task:', task)} />
                        <div  className="w-9/12 mx-auto"><TaskBoard /></div>
                    </div>
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