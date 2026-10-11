import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuthStore from '../stores/useAuthStore';

/**
 * ProtectedRoute component for role-based access control
 * @param {Object} props
 * @param {string[]} [props.allowedRoles] - Array of roles allowed to access the route
 * @param {React.ReactNode} [props.children] - Children to render if access is allowed
 * @returns {React.ReactNode}
 */
function ProtectedRoute({ allowedRoles, children }) {
  const { session, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.user.username)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
}

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node
};

export default ProtectedRoute;