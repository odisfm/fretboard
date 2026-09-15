import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css"
import App from "./App.tsx";
import FretboardDemo from "./FretboardDemo.tsx";
import {AuthPage} from "./components/auth/AuthPage.tsx";
import {AuthProvider} from "./contexts/auth/AuthProvider.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App></App>,
        children: [
            {
                index: true,
                element: <FretboardDemo />
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
