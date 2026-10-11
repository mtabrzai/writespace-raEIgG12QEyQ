import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FaUserCircle } from 'react-icons/fa';

/**
 * Avatar component displaying user role and navigation link
 * @param {Object} props
 * @param {string} props.username - User's username
 * @param {string} [props.avatarUrl] - URL to user's avatar image
 * @param {string} [props.size='medium'] - Size of the avatar (small, medium, large)
 * @param {string} [props.to='/profile'] - Navigation link destination
 * @param {string} [props.role] - User's role (displayed as badge)
 * @returns {React.ReactNode}
 */
function Avatar({ username, avatarUrl, size = 'medium', to = '/profile', role }) {
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg'
  };

  const containerSizeClasses = {
    small: 'gap-1',
    medium: 'gap-2',
    large: 'gap-2'
  };

  return (
    <Link
      to={to}
      className={clsx(
        'flex items-center',
        containerSizeClasses[size]
      )}
      aria-label={`User profile for ${username}`}
    >
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${username}'s avatar`}
            className={clsx(
              'rounded-full object-cover border-2 border-gray-300 dark:border-gray-600',
              sizeClasses[size]
            )}
          />
        ) : (
          <FaUserCircle
            className={clsx(
              'text-gray-500 dark:text-gray-400',
              sizeClasses[size]
            )}
          />
        )}
        {role && (
          <span
            className={clsx(
              'absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full',
              {
                'text-xs': size === 'small',
                'text-sm': size === 'medium' || size === 'large'
              }
            )}
          >
            {role}
          </span>
        )}
      </div>
      {size !== 'small' && (
        <span className="text-gray-800 dark:text-gray-200 font-medium truncate">
          {username}
        </span>
      )}
    </Link>
  );
}

Avatar.propTypes = {
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  to: PropTypes.string,
  role: PropTypes.string
};

export default Avatar;