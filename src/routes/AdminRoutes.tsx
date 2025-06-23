import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminLayout from '../layouts/admin/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage';
import SettingsPage from '../pages/admin/settings/SettingsPage';
import LoginPage from '../pages/auth/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import AllFeedbackPage from '../pages/admin/feedback/AllFeedbackPage';
import ExportDataPage from '../pages/admin/feedback/ExportDataPage';
import FeedbackOffersPage from '../pages/admin/offers/FeedbackOffersPage';
import OfferRedeemPage from '../pages/admin/offers/OfferRedeemPage';
import OfferSettingsPage from '../pages/admin/offers/OfferSettingsPage';
import RatingDistributionPage from '../pages/admin/analytics/RatingDistributionPage';
import FeedbackTrendsPage from '../pages/admin/analytics/FeedbackTrendsPage';
import EmailStatsPage from '../pages/admin/analytics/EmailStatsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'feedback', element: <AllFeedbackPage /> },
          { path: 'feedback/export', element: <ExportDataPage /> },
          { path: 'offers', element: <FeedbackOffersPage /> },
          { path: 'offers/redeem', element: <OfferRedeemPage /> },
          { path: 'offers/settings', element: <OfferSettingsPage /> },
          { path: 'analytics/ratings', element: <RatingDistributionPage /> },
          { path: 'analytics/trends', element: <FeedbackTrendsPage /> },
          { path: 'analytics/emails', element: <EmailStatsPage /> },
        ],
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter; 