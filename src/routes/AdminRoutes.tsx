import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/admin/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage';
import AllFeedbackPage from '../pages/admin/feedback/AllFeedbackPage';
import ExportDataPage from '../pages/admin/feedback/ExportDataPage';
import OfferManagementPage from '../pages/admin/offers/OfferManagementPage';
import RatingDistributionPage from '../pages/admin/analytics/RatingDistributionPage';
import FeedbackTrendsPage from '../pages/admin/analytics/FeedbackTrendsPage';
import EmailStatsPage from '../pages/admin/analytics/EmailStatsPage';
import SettingsPage from '../pages/admin/settings/SettingsPage';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="feedback" element={<AllFeedbackPage />} />
        <Route path="feedback/export" element={<ExportDataPage />} />
        <Route path="offers" element={<OfferManagementPage />} />
        <Route path="analytics/ratings" element={<RatingDistributionPage />} />
        <Route path="analytics/trends" element={<FeedbackTrendsPage />} />
        <Route path="analytics/emails" element={<EmailStatsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes; 