import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FaUsers, FaPen, FaChartBar, FaUserPlus, FaPlus, FaExclamationCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import UserList from '../components/admin/UserList';
import UserForm from '../components/admin/UserForm';
import PostCard from '../components/PostCard';
import useAuthStore from '../stores/useAuthStore';
import useUsersStore from '../stores/useUsersStore';
import usePostsStore from '../stores/usePostsStore';

function AdminDashboard() {
  const { session, isLoading: authLoading } = useAuthStore();
  const { users, fetchAllUsers, isLoading: usersLoading, error: usersError, clearError: clearUsersError } = useUsersStore();
  const { posts, fetchAllPosts, isLoading: postsLoading, error: postsError, clearError: clearPostsError } = usePostsStore();

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    if (session?.user.username === 'admin') {
      fetchAllUsers();
      fetchAllPosts();
    }
  }, [session, fetchAllUsers, fetchAllPosts]);

  if (authLoading) {
    return null;
  }

  if (!session || session.user.username !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  const handleUserCreated = () => {
    setShowUserForm(false);
    setEditingUserId(null);
    fetchAllUsers();
  };

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    setShowUserForm(true);
  };

  const handleCancel = () => {
    setShowUserForm(false);
    setEditingUserId(null);
  };

  const publishedPosts = posts.filter(post => post.isPublished);
  const draftPosts = posts.filter(post => !post.isPublished);
  const adminPosts = posts.filter(post => post.ownerId === session.user.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage users, posts, and view statistics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {users.length}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <FaUsers className="text-blue-600 dark:text-blue-400 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Published Posts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {publishedPosts.length}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <FaPen className="text-green-600 dark:text-green-400 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Draft Posts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {draftPosts.length}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                <FaPen className="text-yellow-600 dark:text-yellow-400 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Posts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {adminPosts.length}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <FaChartBar className="text-purple-600 dark:text-purple-400 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {usersError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-200">
                  {usersError.message}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={clearUsersError}
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

        {postsError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-200">
                  {postsError.message}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={clearPostsError}
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

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
            <button
              onClick={() => {
                setEditingUserId(null);
                setShowUserForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaUserPlus />
              Add User
            </button>
          </div>

          {showUserForm ? (
            <UserForm
              userId={editingUserId}
              onSuccess={handleUserCreated}
              onCancel={handleCancel}
            />
          ) : (
            <UserList />
          )}
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Posts</h2>
            <Link
              to="/new"
              className="flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus />
              Create Post
            </Link>
          </div>

          {postsLoading ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              {publishedPosts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {publishedPosts
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3)
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
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaPen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No posts found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Create your first post to get started.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

AdminDashboard.propTypes = {
  className: PropTypes.string
};

export default AdminDashboard;