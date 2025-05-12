import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import Dashboard from './admin/Dashboard';
import UserDetails from './admin/UserDetails';
import BugReports from './admin/BugReports';

const Admin = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    // Check if user is admin
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
      navigate('/login');
    }
  }, [navigate]);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'user-details':
        return <UserDetails />;
      case 'bug-reports':
        return <BugReports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderSection()}
    </AdminLayout>
  );
};

export default Admin;