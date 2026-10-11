import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FaPlus, FaPen, FaTrash, FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import usePostsStore from '../stores/usePostsStore';
import useAuthStore from '../stores/useAuthStore';

function BlogList() {
  const { session } = useAuthStore();
  const { posts, isLoading, error, fetchAllPosts, deletePost, clearError } = usePostsStore();

  const publishedPosts = posts.filter(post => post.isPublished);
  const draftPosts = posts.filter(post => !post.isPublished);
  const userPosts = posts.filter(post => post.ownerId === session?.user.id);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Browse all published posts or create your own
            </p>
          </div>
          {session && (
            <Link
              to="/new"
              className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus />
              Create Post
            </Link>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
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
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <>
            {publishedPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Published Posts</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {publishedPosts
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((post) => (
                      <PostCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        excerpt={post.excerpt}
                        content={post.content}
                        username={post.username || 'Anonymous'}
                        createdAt={post.createdAt}
                        tags={post.tags}
                        isPublished={post.isPublished}
                        className={clsx(
                          session?.user.id === post.ownerId && 'border-2 border-blue-500'
                        )}
                      >
                        {session?.user.id === post.ownerId && (
                          <div className="flex items-center justify-end space-x-2 mt-4">
                            <Link
                              to={`/edit/${post.id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                              aria-label={`Edit post ${post.title}`}
                            >
                              <FaPen className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                              aria-label={`Delete post ${post.title}`}
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </PostCard>
                    ))}
                </div>
              </div>
            )}

            {session && draftPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Drafts</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {draftPosts
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((post) => (
                      <PostCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        excerpt={post.excerpt}
                        content={post.content}
                        username={post.username || 'Anonymous'}
                        createdAt={post.createdAt}
                        tags={post.tags}
                        isPublished={post.isPublished}
                        className="border-2 border-yellow-500"
                      >
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/edit/${post.id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                              aria-label={`Edit post ${post.title}`}
                            >
                              <FaPen className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                              aria-label={`Delete post ${post.title}`}
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            <FaEyeSlash className="text-xs" />
                            Draft
                          </span>
                        </div>
                      </PostCard>
                    ))}
                </div>
              </div>
            )}

            {publishedPosts.length === 0 && draftPosts.length === 0 && (
              <div className="text-center py-12">
                <FaPen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No posts found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {session ? 'Create your first post to get started.' : 'Sign in to create and view your posts.'}
                </p>
                {session && (
                  <div className="mt-6">
                    <Link
                      to="/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaPlus className="mr-2" />
                      Create Post
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

BlogList.propTypes = {
  className: PropTypes.string
};

export default BlogList;