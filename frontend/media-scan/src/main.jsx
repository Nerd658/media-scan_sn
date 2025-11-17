import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Analyze from "./pages/Analyze";
import MediaDetails from "./pages/MediaDetails";
import Alerts from "./pages/Alerts";
import MediaComparison from "./pages/MediaComparison";
import SourceManagement from "./pages/SourceManagement";
import AllMedia from "./pages/AllMedia"; // Import the new component

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/analyze",
        element: <Analyze />,
      },
      {
        path: "/media/:mediaName",
        element: <MediaDetails />,
      },
      {
        path: "/alerts",
        element: <Alerts />,
      },
      {
        path: "/compare-media",
        element: <MediaComparison />,
      },
      {
        path: "/sources",
        element: <SourceManagement />,
      },
      {
        path: "/all-media", // New route for all media
        element: <AllMedia />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);