import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FaCalendarAlt, FaUser, FaTag, FaEye, FaEyeSlash } from 'react-icons/fa';
import DOMPurify from 'dompurify';

/**
 * PostCard component for displaying blog posts in lists
 * @param {Object} props
 * @param {string} props.id - Post ID
 * @param {string} props.title - Post title
 * @param {string} props.excerpt - Post excerpt
 * @param {string} props.content - Post content in HTML
 * @param {string} props.username - Username of post author
 * @param {Date} props.createdAt - Post creation date
 * @param {string[]} [props.tags=[]] - Array of tags
 * @param {boolean} [props.isPublished=true] - Whether post is published
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode}
 */
function PostCard({ id, title, excerpt, content, username, createdAt, tags = [], isPublished = true, className }) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const sanitizedExcerpt = excerpt || DOMPurify.sanitize(
    content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
  );

  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg',
      className
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            <Link
              to={`/posts/${id}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {title}
            </Link>
          </h3>
          {!isPublished && (
            <span className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              <FaEyeSlash className="text-xs" />
              Draft
            </span>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 space-x-4">
          <span className="flex items-center gap-1">
            <FaCalendarAlt className="text-xs" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <FaUser className="text-xs" />
            {username}
          </span>
          {tags.length > 0 && (
            <span className="flex items-center gap-1">
              <FaTag className="text-xs" />
              {tags.join(', ')}
            </span>
          )}
        </div>

        <p
          className="text-gray-600 dark:text-gray-300 mb-4"
          dangerouslySetInnerHTML={{ __html: sanitizedExcerpt }}
        />

        <div className="flex items-center justify-between">
          <Link
            to={`/posts/${id}`}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Read more
          </Link>
          {isPublished && (
            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <FaEye className="text-xs" />
              Published
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  excerpt: PropTypes.string,
  content: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  isPublished: PropTypes.bool,
  className: PropTypes.string
};

export default PostCard;