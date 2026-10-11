import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Avatar from './Avatar';
import useAuthStore from '../stores/useAuthStore';

/**
 * Navbar component with logo, navigation links, and user avatar
 * @param {Object} props
 * @param {string} [props.logoText='writespace'] - Text to display as logo
 * @param {string} [props.logoTo='/'] - Navigation link for logo
 * @returns {React.ReactNode}
 */
function Navbar({ logoText = 'writespace', logoTo = '/' }) {
  const { session } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to={logoTo}
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              {logoText}
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  clsx(
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                    isActive
                      ? 'border-blue-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                  )
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/posts"
                className={({ isActive }) =>
                  clsx(
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                    isActive
                      ? 'border-blue-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                  )
                }
              >
                Posts
              </NavLink>
              {session && (
                <NavLink
                  to="/new"
                  className={({ isActive }) =>
                    clsx(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                      isActive
                        ? 'border-blue-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                    )
                  }
                >
                  New Post
                </NavLink>
              )}
            </div>

            <div className="flex items-center">
              {session ? (
                <Avatar
                  username={session.user.username}
                  size="small"
                  role={session.user.username === 'admin' ? 'admin' : undefined}
                />
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  logoText: PropTypes.string,
  logoTo: PropTypes.string
};

export default Navbar;