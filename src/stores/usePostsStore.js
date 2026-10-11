import { create } from 'zustand';
import PropTypes from 'prop-types';
import { LOCAL_STORAGE_KEYS } from '../constants';

/**
 * @typedef {Object} Post
 * @property {string} id - Unique identifier for the post
 * @property {string} title - Post title
 * @property {string} content - Post content in HTML
 * @property {string} excerpt - Short summary of the post
 * @property {string} ownerId - ID of the user who owns this post
 * @property {string[]} tags - Array of tags associated with the post
 * @property {boolean} isPublished - Whether the post is published
 * @property {Date} createdAt - When the post was created
 * @property {Date} updatedAt - When the post was last updated
 * @property {Date} [publishedAt] - When the post was published (optional)
 */

/**
 * @typedef {Object} PostsState
 * @property {Post[]} posts - Array of all posts
 * @property {Post|null} currentPost - Currently selected/edited post
 * @property {boolean} isLoading - Whether posts are being loaded
 * @property {Error|null} error - Last error encountered
 * @property {string} searchQuery - Current search query
 * @property {string[]} selectedTags - Currently selected tags for filtering
 */

/**
 * @typedef {Object} PostsActions
 * @property {function(Post): Promise<void>} createPost - Create a new post
 * @property {function(string, Partial<Post>): Promise<void>} updatePost - Update an existing post
 * @property {function(string): Promise<void>} deletePost - Delete a post
 * @property {function(string): Promise<void>} fetchPostById - Fetch a single post by ID
 * @property {function(): Promise<void>} fetchAllPosts - Fetch all posts
 * @property {function(Post): void} setCurrentPost - Set the current post for editing
 * @property {function(): void} clearCurrentPost - Clear the current post
 * @property {function(string): void} setSearchQuery - Set the search query
 * @property {function(string[]): void} setSelectedTags - Set the selected tags for filtering
 * @property {function(): void} clearError - Clear the error state
 */

/** @type {PostsState} */
const initialState = {
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedTags: []
};

/**
 * Zustand store for blog post state and operations
 * @returns {PostsState & PostsActions}
 */
const usePostsStore = create((set) => ({
  ...initialState,

  /**
   * Create a new post
   * @param {Post} post
   * @returns {Promise<void>}
   */
  async createPost(post) {
    try {
      set({ isLoading: true, error: null });
      const newPost = {
        ...post,
        id: `post-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedPosts = [newPost, ...get().posts];
      localStorage.setItem(LOCAL_STORAGE_KEYS.DOCUMENT_METADATA, JSON.stringify(updatedPosts));
      set({
        posts: updatedPosts,
        currentPost: newPost,
        isLoading: false
      });
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  /**
   * Update an existing post
   * @param {string} id
   * @param {Partial<Post>} updates
   * @returns {Promise<void>}
   */
  async updatePost(id, updates) {
    try {
      set({ isLoading: true, error: null });
      const updatedPosts = get().posts.map(post =>
        post.id === id ? {
          ...post,
          ...updates,
          updatedAt: new Date()
        } : post
      );

      localStorage.setItem(LOCAL_STORAGE_KEYS.DOCUMENT_METADATA, JSON.stringify(updatedPosts));
      set({
        posts: updatedPosts,
        currentPost: updatedPosts.find(post => post.id === id) || null,
        isLoading: false
      });
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  /**
   * Delete a post
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deletePost(id) {
    try {
      set({ isLoading: true, error: null });
      const updatedPosts = get().posts.filter(post => post.id !== id);

      localStorage.setItem(LOCAL_STORAGE_KEYS.DOCUMENT_METADATA, JSON.stringify(updatedPosts));
      set({
        posts: updatedPosts,
        currentPost: get().currentPost?.id === id ? null : get().currentPost,
        isLoading: false
      });
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  /**
   * Fetch a single post by ID
   * @param {string} id
   * @returns {Promise<void>}
   */
  async fetchPostById(id) {
    try {
      set({ isLoading: true, error: null });
      const posts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENT_METADATA) || '[]');
      const post = posts.find(p => p.id === id);

      if (post) {
        set({
          currentPost: post,
          isLoading: false
        });
      } else {
        set({
          error: new Error('Post not found'),
          isLoading: false
        });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  /**
   * Fetch all posts
   * @returns {Promise<void>}
   */
  async fetchAllPosts() {
    try {
      set({ isLoading: true, error: null });
      const posts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENT_METADATA) || '[]');
      set({
        posts,
        isLoading: false
      });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  /**
   * Set the current post for editing
   * @param {Post} post
   */
  setCurrentPost(post) {
    set({ currentPost: post });
  },

  /**
   * Clear the current post
   */
  clearCurrentPost() {
    set({ currentPost: null });
  },

  /**
   * Set the search query
   * @param {string} query
   */
  setSearchQuery(query) {
    set({ searchQuery: query });
  },

  /**
   * Set the selected tags for filtering
   * @param {string[]} tags
   */
  setSelectedTags(tags) {
    set({ selectedTags: tags });
  },

  /**
   * Clear the error state
   */
  clearError() {
    set({ error: null });
  }
}));

const { get } = usePostsStore;

usePostsStore.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      ownerId: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
      isPublished: PropTypes.bool.isRequired,
      createdAt: PropTypes.instanceOf(Date).isRequired,
      updatedAt: PropTypes.instanceOf(Date).isRequired,
      publishedAt: PropTypes.instanceOf(Date)
    })
  ),
  currentPost: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    excerpt: PropTypes.string,
    ownerId: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    isPublished: PropTypes.bool,
    createdAt: PropTypes.instanceOf(Date),
    updatedAt: PropTypes.instanceOf(Date),
    publishedAt: PropTypes.instanceOf(Date)
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.instanceOf(Error),
  searchQuery: PropTypes.string,
  selectedTags: PropTypes.arrayOf(PropTypes.string)
};

export default usePostsStore;