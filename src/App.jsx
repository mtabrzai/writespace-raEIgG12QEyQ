import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuthStore from './stores/useAuthStore';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogList from './pages/BlogList';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { checkAuth, session } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/posts',
      element: <BlogList />,
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: '/new',
      element: (
        <ProtectedRoute>
          <div>New Post Page</div>
        </ProtectedRoute>
      ),
    },
    {
      path: '/edit/:id',
      element: (
        <ProtectedRoute>
          <div>Edit Post Page</div>
        </ProtectedRoute>
      ),
    },
    {
      path: '/posts/:id',
      element: <div>Post Detail Page</div>,
    },
    {
      path: '/unauthorized',
      element: <div>Unauthorized Page</div>,
    },
  ]);

  return <RouterProvider router={router} />;
}

App.propTypes = {
  children: PropTypes.node,
};

export default App;