import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DrawingCanvas from "./Pages/DrawingCanvas.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "",
        element: <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <DrawingCanvas />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </StrictMode>
);
