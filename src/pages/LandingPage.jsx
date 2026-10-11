import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FaPenNib, FaArrowRight } from 'react-icons/fa';
import FeatureCard from '../components/FeatureCard';
import PostCard from '../components/PostCard';
import usePostsStore from '../stores/usePostsStore';
import { useEffect } from 'react';

function LandingPage() {
  const { posts, fetchAllPosts, isLoading, error } = usePostsStore();
  const publishedPosts = posts.filter(post => post.isPublished);
  const latestPosts = publishedPosts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Write your thoughts</span>
                <span className="block text-blue-600 dark:text-blue-400">in writespace</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                A simple, powerful writing platform for bloggers, journalists, and content creators.
                Share your ideas with the world or keep them private.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/new"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      <FaPenNib className="mr-2" />
                      Start Writing
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/posts"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      Explore Posts
                      <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">writespace</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              A better way to write
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              Everything you need to create, publish, and share your content.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon="edit"
                title="Rich Text Editing"
                description="Powerful editor with formatting options, images, and embeds."
              />
              <FeatureCard
                icon="cloud"
                title="Auto-save"
                description="Your work is automatically saved as you type."
              />
              <FeatureCard
                icon="share"
                title="Easy Sharing"
                description="Publish your posts with a single click or share privately."
              />
              <FeatureCard
                icon="lock"
                title="Privacy Controls"
                description="Keep your drafts private or make them public."
              />
              <FeatureCard
                icon="search"
                title="Discover Content"
                description="Browse and read posts from other writers."
              />
              <FeatureCard
                icon="rocket"
                title="Fast Performance"
                description="Lightweight and optimized for speed."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">
              Latest Posts
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Read what's new
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              Discover the most recent content from our community.
            </p>
          </div>

          {isLoading ? (
            <div className="mt-12 flex justify-center items-center">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="mt-12 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-200">
                    Failed to load posts: {error.message}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {latestPosts.length > 0 ? (
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {latestPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      excerpt={post.excerpt}
                      content={post.content}
                      username="Community Writer"
                      createdAt={post.createdAt}
                      tags={post.tags}
                      isPublished={post.isPublished}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-12 text-center">
                  <FaPenNib className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No posts yet</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Be the first to share your thoughts.</p>
                </div>
              )}
              <div className="mt-12 text-center">
                <Link
                  to="/posts"
                  className="text-base font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
                >
                  View all posts <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

LandingPage.propTypes = {
  className: PropTypes.string
};

export default LandingPage;