// Import Dependencies
import { Navigate } from "react-router";

// Local Imports
import { AppLayout } from "app/layouts/AppLayout";
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
      ],
    },
    // The app layout supports only the main layout. Avoid using it for other layouts.
    {
      Component: AppLayout,
      children: [
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("app/pages/settings/Layout")).default,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/settings/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (await import("app/pages/settings/sections/General"))
                  .default,
              }),
            },
            {
              path: "appearance",
              lazy: async () => ({
                Component: (
                  await import("app/pages/settings/sections/Appearance")
                ).default,
              }),
            },
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };
