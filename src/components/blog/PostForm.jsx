import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FaSave, FaEye, FaEyeSlash, FaTag, FaExclamationCircle } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import usePostsStore from '../../stores/usePostsStore';
import useAuthStore from '../../stores/useAuthStore';
import { APP_CONSTANTS } from '../../constants';

/**
 * PostForm component for creating and editing blog posts
 * @param {Object} props
 * @param {string} [props.postId] - ID of the post to edit
 * @param {function} [props.onSuccess] - Callback after successful submission
 * @param {function} [props.onCancel] - Callback when cancel button is clicked
 * @returns {React.ReactNode}
 */
function PostForm({ postId, onSuccess, onCancel }) {
  const { session } = useAuthStore();
  const { posts, currentPost, fetchPostById, createPost, updatePost, setCurrentPost, clearCurrentPost, isLoading, error, clearError } = usePostsStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPostById(postId);
    } else {
      clearCurrentPost();
    }
  }, [postId, fetchPostById, clearCurrentPost]);

  useEffect(() => {
    if (currentPost) {
      setTitle(currentPost.title);
      setContent(currentPost.content);
      setExcerpt(currentPost.excerpt || '');
      setTags(currentPost.tags ? currentPost.tags.join(', ') : '');
      setIsPublished(currentPost.isPublished);
    } else {
      setTitle('');
      setContent('');
      setExcerpt('');
      setTags('');
      setIsPublished(false);
    }
  }, [currentPost]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (title.length > APP_CONSTANTS.MAX_DOCUMENT_TITLE_LENGTH) {
      newErrors.title = `Title must be less than ${APP_CONSTANTS.MAX_DOCUMENT_TITLE_LENGTH} characters`;
    }
    if (!content.trim()) newErrors.content = 'Content is required';
    if (content.length > APP_CONSTANTS.MAX_DOCUMENT_CONTENT_LENGTH) {
      newErrors.content = `Content must be less than ${APP_CONSTANTS.MAX_DOCUMENT_CONTENT_LENGTH} characters`;
    }
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
      const postData = {
        title: title.trim(),
        content: DOMPurify.sanitize(content),
        excerpt: excerpt.trim() || content.substring(0, 150).replace(/<[^>]*>/g, '') + '...',
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isPublished,
        ownerId: session.user.id
      };

      if (postId) {
        await updatePost(postId, postData);
      } else {
        await createPost(postData);
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
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
            }}
            className={clsx(
              'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              errors.title
                ? 'border-red-300 text-red-900 dark:text-red-200 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            )}
            maxLength={APP_CONSTANTS.MAX_DOCUMENT_TITLE_LENGTH}
          />
          <div className="flex justify-between mt-1">
            {errors.title && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.title}
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {title.length}/{APP_CONSTANTS.MAX_DOCUMENT_TITLE_LENGTH}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value);
            }}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            placeholder="Brief summary of your post (optional)"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={10}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (errors.content) setErrors(prev => ({ ...prev, content: undefined }));
            }}
            className={clsx(
              'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              errors.content
                ? 'border-red-300 text-red-900 dark:text-red-200 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            )}
            placeholder="Write your post content here..."
          />
          <div className="flex justify-between mt-1">
            {errors.content && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.content}
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {content.length}/{APP_CONSTANTS.MAX_DOCUMENT_CONTENT_LENGTH}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaTag className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="tags"
              name="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="comma, separated, tags"
            />
          </div>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {isPublished ? (
              <>
                <FaEye className="text-green-500" />
                Published
              </>
            ) : (
              <>
                <FaEyeSlash className="text-gray-500" />
                Draft
              </>
            )}
          </button>
        </div>

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
                {postId ? 'Updating...' : 'Publishing...'}
              </>
            ) : (
              <>
                <FaSave />
                {postId ? 'Update Post' : 'Publish Post'}
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

PostForm.propTypes = {
  postId: PropTypes.string,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func
};

export default PostForm;