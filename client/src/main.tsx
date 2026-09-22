import ReactDOM from "react-dom/client";
import {createBrowserRouter, Navigate} from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css"
import Frame from "./Frame.tsx";
import FretboardDemo from "./FretboardDemo.tsx";
import {AuthPage} from "./components/auth/AuthPage.tsx";
import {AuthProvider} from "./contexts/auth/AuthProvider.tsx";
import {ChordDemo} from "./ChordDemo.tsx";
import {App} from "./App.tsx";
import {CustomScale} from "./components/CustomScale/CustomScale.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Frame></Frame>,
        children: [
            {
                index: true,
                element: <Navigate to={"/scale"} />
            },
            {
                path: "/scale",
                element: <App><FretboardDemo /></App>,
            },
            {
                path: "/scale/new",
                element: <CustomScale />
            },
            {
                path: "/chord",
                element: <App><ChordDemo /></App>
            },
            {
                path: "/login",
                element: <AuthPage mode={"login"}/>
            },
            {
                path: "/register",
                element: <AuthPage mode={"register"}/>
            }
        ]
    },
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>,
);
