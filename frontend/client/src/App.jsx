import { useState, useEffect } from 'react';
import AdminSignUp from './components/AdminSignUp';
import AdminSignIn from './components/AdminSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import CourseForm from './components/CourseForm';
import CourseList from './components/CourseList';
import CoursePreview from './components/CoursePreview';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('userType');
    if (token && type) {
      setUserType(type);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setUserType(null);
    setIsAuthenticated(false);
    setCurrentView('home');
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setUserType(localStorage.getItem('userType'));
    setCurrentView(userType === 'admin' ? 'admin-dashboard' : 'user-dashboard');
  };

  const renderView = () => {
    if (!isAuthenticated) {
      switch (currentView) {
        case 'admin-signup':
          return <AdminSignUp onSuccess={() => setCurrentView('admin-signin')} />;
        case 'admin-signin':
          return <AdminSignIn onSuccess={handleAuthSuccess} />;
        case 'user-signup':
          return <UserSignUp onSuccess={() => setCurrentView('user-signin')} />;
        case 'user-signin':
          return <UserSignIn onSuccess={handleAuthSuccess} />;
        default:
          return (
            <div>
              <h1>CourseIt - Learning Platform</h1>
              <div>
                <h2>Admin</h2>
                <button onClick={() => setCurrentView('admin-signup')}>Admin Sign Up</button>
                <button onClick={() => setCurrentView('admin-signin')}>Admin Sign In</button>
              </div>
              <div>
                <h2>User</h2>
                <button onClick={() => setCurrentView('user-signup')}>User Sign Up</button>
                <button onClick={() => setCurrentView('user-signin')}>User Sign In</button>
              </div>
            </div>
          );
      }
    }

    if (userType === 'admin') {
      switch (currentView) {
        case 'create-course':
          return <CourseForm onCourseCreated={() => setCurrentView('admin-dashboard')} />;
        case 'my-courses':
          return <CourseList />;
        default:
          return (
            <div>
              <h1>Admin Dashboard</h1>
              <button onClick={handleLogout}>Logout</button>
              <div>
                <button onClick={() => setCurrentView('create-course')}>Create Course</button>
                <button onClick={() => setCurrentView('my-courses')}>My Courses</button>
              </div>
            </div>
          );
      }
    }

    if (userType === 'user') {
      switch (currentView) {
        case 'my-purchases':
          return <CoursePreview />;
        default:
          return (
            <div>
              <h1>User Dashboard</h1>
              <button onClick={handleLogout}>Logout</button>
              <div>
                <button onClick={() => setCurrentView('my-purchases')}>Browse Courses</button>
              </div>
            </div>
          );
      }
    }

    return null;
  };

  return (
    <div>
      {renderView()}
    </div>
  );
}

export default App;
