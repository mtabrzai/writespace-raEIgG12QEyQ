import { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FaTrash, FaUserShield, FaUser, FaExclamationCircle } from 'react-icons/fa';
import Avatar from '../Avatar';
import useUsersStore from '../../stores/useUsersStore';
import useAuthStore from '../../stores/useAuthStore';

function UserList() {
  const { session } = useAuthStore();
  const {
    users,
    isLoading,
    error,
    fetchAllUsers,
    deleteUser,
    clearError
  } = useUsersStore();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleDelete = async (userId) => {
    if (userId === session.user.id) {
      return;
    }
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-200">
              {error.message}
            </p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={clearError}
                className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-800/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Users</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Manage user accounts
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <li key={user.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar
                    username={user.username}
                    size="medium"
                    role={user.username === 'admin' ? 'admin' : undefined}
                  />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.username}
                      {user.username === 'admin' && (
                        <FaUserShield className="ml-2 inline text-blue-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {user.id !== session.user.id && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      aria-label={`Delete user ${user.username}`}
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  )}
                  {user.id === session.user.id && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">(You)</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {users.length === 0 && (
          <div className="px-4 py-12 text-center">
            <FaUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new user.</p>
          </div>
        )}
      </div>
    </div>
  );
}

UserList.propTypes = {
  className: PropTypes.string
};

export default UserList;