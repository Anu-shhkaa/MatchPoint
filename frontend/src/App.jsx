import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import Layouts
import AdminLayout from './components/layout/AdminLayout';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ControlLiveMatchPage from './pages/admin/ControlLiveMatchPage';
//import AdminMatchPage from './pages/admin/AdminMatchPage'; // Add this import
// Import Contexts
import  {useAuth}  from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Import Viewer Pages
import HomePage from './pages/viewer/HomePage';
import EventsPage from './pages/viewer/EventsPage';
import LivePage from './pages/viewer/LivePage';
import MorePage from './pages/viewer/MorePage';
import EventDetailPage from './pages/viewer/EventDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Import Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEventListPage from './pages/admin/AdminEventListPage';
import AdminEventCreatePage from './pages/admin/AdminEventCreatePage';
import AdminEventDetailPage from './pages/admin/AdminEventDetailPage';
import AdminManageDataPage from './pages/admin/AdminManageDataPage';
import AdminMatchPage from './pages/admin/AdminMatchPage';
import AdminJokerLogicPage from './pages/admin/AdminJokerLogicPage';

/**
 * A layout for all public-facing viewer pages.
 * Includes the top Navbar and bottom Footer (navigation).
 */
const ViewerLayout = () => {
  return (
    <SocketProvider> {/* Socket connection for viewers */}
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary">
        {/* <Navbar /> */}
        <main className="flex-1 container mx-auto p-4">
          <Outlet /> {/* This renders the specific viewer page */}
        </main>
        <Footer />
      </div>
    </SocketProvider>
  );
};

/**
 * A wrapper to protect admin routes.
 * If the admin is logged in (token exists), it shows the <AdminLayout />.
 * If not, it redirects them to the /admin/login page.
 */
const ProtectedAdminLayout = () => {
  const { token } = useAuth();
  
  if (!token) {
    // Redirect to login page if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <SocketProvider> {/* Socket connection for admins */}
      <AdminLayout /> {/* This layout has its own <Outlet /> */}
    </SocketProvider>
  );
};

function App() {
  return (
    <Routes>
      {/* --- Viewer Routes --- */}
      <Route element={<ViewerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/more" element={<MorePage />} />
        <Route path="/admin/match/:matchId/control" element={<ControlLiveMatchPage />} />
        <Route path="/admin/matches" element={<AdminMatchPage />} />
        
      </Route>

      {/* --- Admin Routes --- */}
      {/* The login page is public and has no layout */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* All other admin pages are protected */}
      <Route element={<ProtectedAdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<AdminEventListPage />} />
        <Route path="/admin/events/create" element={<AdminEventCreatePage />} />
        <Route path="/admin/events/:eventId" element={<AdminEventDetailPage />} />
        <Route path="/admin/match/:matchId" element={<AdminMatchPage />} />
        <Route path="/admin/joker/:eventId" element={<AdminJokerLogicPage />} />
        <Route path="/admin/manage-data" element={<AdminManageDataPage />} />
      </Route>

      {/* --- Not Found Route --- */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

