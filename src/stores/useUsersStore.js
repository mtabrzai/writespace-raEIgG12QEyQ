import { create } from 'zustand';
import PropTypes from 'prop-types';
import { LOCAL_STORAGE_KEYS } from '../constants';

/**
 * @typedef {import('../types').User} User
 */

/**
 * @typedef {Object} UsersState
 * @property {User[]} users - Array of all users
 * @property {User|null} currentUser - Currently selected user
 * @property {boolean} isLoading - Whether users are being loaded
 * @property {Error|null} error - Last error encountered
 * @property {string} searchQuery - Current search query
 */

/**
 * @typedef {Object} UsersActions
 * @property {function(User): Promise<void>} createUser - Create a new user
 * @property {function(string, Partial<User>): Promise<void>} updateUser - Update an existing user
 * @property {function(string): Promise<void>} deleteUser - Delete a user
 * @property {function(string): Promise<void>} fetchUserById - Fetch a single user by ID
 * @property {function(): Promise<void>} fetchAllUsers - Fetch all users
 * @property {function(User): void} setCurrentUser - Set the current user
 * @property {function(): void} clearCurrentUser - Clear the current user
 * @property {function(string): void} setSearchQuery - Set the search query
 * @property {function(): void} clearError - Clear the error state
 */

/** @type {UsersState} */
const initialState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  searchQuery: ''
};

/**
 * Zustand store for user management state and operations
 * @returns {UsersState & UsersActions}
 */
const useUsersStore = create((set, get) => ({
  ...initialState,

  /**
   * Create a new user
   * @param {User} user
   * @returns {Promise<void>}
   */
  async createUser(user) {
    try {
      set({ isLoading: true, error: null });
      const newUser = {
        ...user,
        id: `user-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedUsers = [newUser, ...get().users];
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedUsers));
      set({
        users: updatedUsers,
        currentUser: newUser,
        isLoading: false
      });
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  /**
   * Update an existing user
   * @param {string} id
   * @param {Partial<User>} updates
   * @returns {Promise<void>}
   */
  async updateUser(id, updates) {
    try {
      set({ isLoading: true, error: null });
      const updatedUsers = get().users.map(user =>
        user.id === id ? {
          ...user,
          ...updates,
          updatedAt: new Date()
        } : user
      );

      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedUsers));
      set({
        users: updatedUsers,
        currentUser: updatedUsers.find(user => user.id === id) || null,
        isLoading: false
      });
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  /**
   * Delete a user
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteUser(id) {
    try {
      set({ isLoading: true, error: null });
      const updatedUsers = get().users.filter(user => user.id !== id);

      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedUsers));
      set({
        users: updatedUsers,
        currentUser: get().currentUser?.id === id ? null : get().currentUser,
        isLoading: false
      });
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  /**
   * Fetch a single user by ID
   * @param {string} id
   * @returns {Promise<void>}
   */
  async fetchUserById(id) {
    try {
      set({ isLoading: true, error: null });
      const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES) || '[]');
      const user = users.find(u => u.id === id);

      if (user) {
        set({
          currentUser: user,
          isLoading: false
        });
      } else {
        set({
          error: new Error('User not found'),
          isLoading: false
        });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  /**
   * Fetch all users
   * @returns {Promise<void>}
   */
  async fetchAllUsers() {
    try {
      set({ isLoading: true, error: null });
      const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES) || '[]');
      set({
        users,
        isLoading: false
      });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  /**
   * Set the current user
   * @param {User} user
   */
  setCurrentUser(user) {
    set({ currentUser: user });
  },

  /**
   * Clear the current user
   */
  clearCurrentUser() {
    set({ currentUser: null });
  },

  /**
   * Set the search query
   * @param {string} query
   */
  setSearchQuery(query) {
    set({ searchQuery: query });
  },

  /**
   * Clear the error state
   */
  clearError() {
    set({ error: null });
  }
}));

useUsersStore.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string,
      createdAt: PropTypes.instanceOf(Date).isRequired,
      updatedAt: PropTypes.instanceOf(Date).isRequired
    })
  ),
  currentUser: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    avatarUrl: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    updatedAt: PropTypes.instanceOf(Date)
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.instanceOf(Error),
  searchQuery: PropTypes.string
};

export default useUsersStore;