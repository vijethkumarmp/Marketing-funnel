import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import JourneyDetailPage from '@/components/pages/JourneyDetailPage';
import VisualizationPage from '@/components/pages/VisualizationPage';
import ReportsPage from '@/components/pages/ReportsPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
        routeMetadata: {
          pageIdentifier: 'dashboard',
        },
      },
      {
        path: "journey/:id",
        element: <JourneyDetailPage />,
        routeMetadata: {
          pageIdentifier: 'journey-detail',
        },
      },
      {
        path: "visualization",
        element: <VisualizationPage />,
        routeMetadata: {
          pageIdentifier: 'visualization',
        },
      },
      {
        path: "reports",
        element: <ReportsPage />,
        routeMetadata: {
          pageIdentifier: 'reports',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
