import {
    createBrowserRouter
} from "react-router-dom";
import HomeLayout from "../Layouts/HomeLayout/HomeLayout";
import Home from "../Pages/Home/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout></HomeLayout>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            }
        ]
    },
]);