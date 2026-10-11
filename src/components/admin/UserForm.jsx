import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FaUser, FaEnvelope, FaLock, FaExclamationCircle, FaUserShield } from 'react-icons/fa';
import useUsersStore from '../../stores/useUsersStore';
import useAuthStore from '../../stores/useAuthStore';

/**
 * UserForm component for creating and editing users (admin-only)
 * @param {Object} props
 * @param {string} [props.userId] - ID of the user to edit
 * @param {function} [props.onSuccess] - Callback after successful submission
 * @param {function} [props.onCancel] - Callback when cancel button is clicked
 * @returns {React.ReactNode}
 */
function UserForm({ userId, onSuccess, onCancel }) {
  const { session } = useAuthStore();
  const {
    users,
    currentUser,
    fetchUserById,
    createUser,
    updateUser,
    setCurrentUser,
    clearCurrentUser,
    isLoading,
    error,
    clearError
  } = useUsersStore();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    } else {
      clearCurrentUser();
    }
  }, [userId, fetchUserById, clearCurrentUser]);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      setIsAdmin(currentUser.username === 'admin');
    } else {
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsAdmin(false);
    }
  }, [currentUser]);

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!email) newErrors.email = 'Email is required';
    if (!userId && !password) newErrors.password = 'Password is required';
    if (!userId && password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const userData = {
        username: username.trim(),
        email: email.trim(),
        ...(!userId && { password })
      };

      if (userId) {
        await updateUser(userId, userData);
      } else {
        await createUser(userData);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {errors.form && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">
                {errors.form}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
              }}
              className={clsx(
                'appearance-none block w-full px-3 py-2 pl-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                errors.username
                  ? 'border-red-300 text-red-900 dark:text-red-200 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              )}
            />
          </div>
          {errors.username && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="username-error">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email address
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
              }}
              className={clsx(
                'appearance-none block w-full px-3 py-2 pl-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                errors.email
                  ? 'border-red-300 text-red-900 dark:text-red-200 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              )}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="email-error">
              {errors.email}
            </p>
          )}
        </div>

        {!userId && (
          <>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  className={clsx(
                    'appearance-none block w-full px-3 py-2 pl-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                    errors.password
                      ? 'border-red-300 text-red-900 dark:text-red-200 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  )}
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="password-error">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }}
                  className={clsx(
                    'appearance-none block w-full px-3 py-2 pl-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                    errors.confirmPassword
                      ? 'border-red-300 text-red-900 dark:text-red-200 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  )}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="confirmPassword-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </>
        )}

        {session?.user.username === 'admin' && (
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsAdmin(!isAdmin)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {isAdmin ? (
                <>
                  <FaUserShield className="text-blue-500" />
                  Admin
                </>
              ) : (
                <>
                  <FaUserShield className="text-gray-500" />
                  Regular User
                </>
              )}
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={clsx(
              'flex-1 flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              (isSubmitting || isLoading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isSubmitting || isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {userId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <FaUser />
                {userId ? 'Update User' : 'Create User'}
              </>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

UserForm.propTypes = {
  userId: PropTypes.string,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func
};

export default UserForm;