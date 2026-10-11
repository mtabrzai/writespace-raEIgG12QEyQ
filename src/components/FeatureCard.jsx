import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FaRocket, FaLock, FaCloudUploadAlt, FaShareAlt, FaEdit, FaSearch } from 'react-icons/fa';

/**
 * FeatureCard component displaying a feature with icon, title, and description
 * @param {Object} props
 * @param {string} props.icon - Icon name (rocket, lock, cloud, share, edit, search)
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode}
 */
function FeatureCard({ icon, title, description, className }) {
  const iconMap = {
    rocket: FaRocket,
    lock: FaLock,
    cloud: FaCloudUploadAlt,
    share: FaShareAlt,
    edit: FaEdit,
    search: FaSearch
  };

  const IconComponent = iconMap[icon] || FaRocket;

  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg',
      className
    )}>
      <div className="flex items-center justify-center mb-4">
        <IconComponent className="text-blue-500 text-4xl" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        {description}
      </p>
    </div>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.oneOf(['rocket', 'lock', 'cloud', 'share', 'edit', 'search']).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default FeatureCard;