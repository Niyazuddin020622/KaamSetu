import React, { useState, useEffect } from 'react';
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import WorkersHistoryLedger from './components/WorkersHistoryLedger';
import EmployersHistoryLedger from './components/EmployersHistoryLedger';
import MasterBookingsTable from './components/MasterBookingsTable';
import AddWorkerModal from './components/AddWorkerModal';
import { 
  getAdminStats, 
  getWorkersLedger, 
  getEmployersLedger, 
  getAllBookings, 
  updateWorker, 
  deleteWorker, 
  updateBookingStatus, 
  deleteBooking 
} from './api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('kaamsetu_admin_token'))
  );

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'workers' | 'employers' | 'bookings'
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);

  // App Data
  const [stats, setStats] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, workersRes, employersRes, bookingsRes] = await Promise.all([
        getAdminStats(),
        getWorkersLedger(),
        getEmployersLedger(),
        getAllBookings()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (workersRes.success) setWorkers(workersRes.data || []);
      if (employersRes.success) setEmployers(employersRes.data || []);
      if (bookingsRes.success) setBookings(bookingsRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      showToast('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('kaamsetu_admin_token');
    setIsAuthenticated(false);
  };

  // Worker Toggles
  const handleToggleVerified = async (worker) => {
    try {
      const updatedVerified = !worker.isVerified;
      const res = await updateWorker(worker._id, { isVerified: updatedVerified });
      if (res.success) {
        setWorkers(prev => prev.map(w => w._id === worker._id ? { ...w, isVerified: updatedVerified } : w));
        showToast(`${worker.name} status updated: ${updatedVerified ? 'Verified' : 'Unverified'}`);
      }
    } catch (err) {
      showToast('Update failed');
    }
  };

  const handleToggleAvailable = async (worker) => {
    try {
      const updatedAvailable = !worker.isAvailable;
      const res = await updateWorker(worker._id, { isAvailable: updatedAvailable });
      if (res.success) {
        setWorkers(prev => prev.map(w => w._id === worker._id ? { ...w, isAvailable: updatedAvailable } : w));
        showToast(`${worker.name} is now ${updatedAvailable ? 'Available' : 'Busy'}`);
      }
    } catch (err) {
      showToast('Update failed');
    }
  };

  const handleDeleteWorker = async (workerId) => {
    if (!window.confirm('Are you sure you want to delete this worker?')) return;
    try {
      const res = await deleteWorker(workerId);
      if (res.success) {
        setWorkers(prev => prev.filter(w => w._id !== workerId));
        showToast('Worker deleted successfully');
      }
    } catch (err) {
      showToast('Delete operation failed');
    }
  };

  // Booking Actions
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        getAdminStats().then(r => r.success && setStats(r.data));
        showToast(`Job status changed to '${newStatus}'`);
      }
    } catch (err) {
      showToast('Failed to update status');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await deleteBooking(bookingId);
      if (res.success) {
        setBookings(prev => prev.filter(b => b._id !== bookingId));
        showToast('Booking deleted successfully');
      }
    } catch (err) {
      showToast('Failed to delete booking');
    }
  };

  const handleWorkerCreated = (newWorker) => {
    setWorkers(prev => [newWorker, ...prev]);
    showToast(`${newWorker.name} registered successfully!`);
  };

  // If not logged in
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Fixed Sidebar Navigation - Does NOT scroll with content */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddWorker={() => setShowAddWorkerModal(true)}
        onLogout={handleLogout}
        workersCount={workers.length}
        employersCount={employers.length}
        bookingsCount={bookings.length}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area - Only this container scrolls */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        
        {/* Sticky Header */}
        <Header
          activeTab={activeTab}
          onRefresh={loadAllData}
          loading={loading}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          notification={notification}
        />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto min-h-0 bg-slate-950">
          {activeTab === 'overview' && (
            <DashboardOverview
              stats={stats}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'workers' && (
            <WorkersHistoryLedger
              workers={workers}
              onToggleVerified={handleToggleVerified}
              onToggleAvailable={handleToggleAvailable}
              onDeleteWorker={handleDeleteWorker}
              onOpenAddWorker={() => setShowAddWorkerModal(true)}
              onUpdateStatus={handleUpdateBookingStatus}
            />
          )}

          {activeTab === 'employers' && (
            <EmployersHistoryLedger
              employers={employers}
            />
          )}

          {activeTab === 'bookings' && (
            <MasterBookingsTable
              bookings={bookings}
              onUpdateStatus={handleUpdateBookingStatus}
              onDeleteBooking={handleDeleteBooking}
            />
          )}
        </main>
      </div>

      {/* Add Worker Modal */}
      {showAddWorkerModal && (
        <AddWorkerModal
          onClose={() => setShowAddWorkerModal(false)}
          onWorkerCreated={handleWorkerCreated}
        />
      )}

    </div>
  );
}
