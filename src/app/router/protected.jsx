// Import Dependencies
import { Navigate } from "react-router";

// Local Imports
import MainLayout from "app/layouts/MainLayout";
import AuthGuard from "middleware/AuthGuard";

// ----------------------------------------------------------------------

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    {
      Component: MainLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/flight" />,
        },
        {
          path: "flight",
          lazy: async () => ({
            Component: (await import("app/pages/flight")).default,
          }),
        },
        {
          path: "usermanagement",
          lazy: async () => ({
            Component: (await import("app/pages/usermanagement")).default,
          }),
        },
        {
          path: "profile",
          lazy: async () => ({
            Component: (await import("app/pages/profile")).default,
          }),
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="/flight" />,
            },
            {
              path: "home",
              element: <Navigate to="/flight" />,
            },
          ],
        },
        {
          path: "settings/*",
          element: <Navigate to="/flight" replace />,
        },
      ],
    },
  ],
};

export { protectedRoutes };
