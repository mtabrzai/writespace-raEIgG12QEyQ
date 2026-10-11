import { create } from 'zustand';
import { LOCAL_STORAGE_KEYS } from '../constants';
import PropTypes from 'prop-types';

/**
 * @typedef {import('../types').Session} Session
 * @typedef {import('../types').User} User
 */

/**
 * @typedef {Object} AuthState
 * @property {Session|null} session - Current authentication session
 * @property {boolean} isLoading - Whether authentication state is being loaded
 * @property {Error|null} error - Last authentication error
 */

/**
 * @typedef {Object} AuthActions
 * @property {function(User): Promise<void>} login - Authenticate user and set session
 * @property {function(): Promise<void>} logout - Clear current session
 * @property {function(): Promise<void>} checkAuth - Verify current session validity
 * @property {function(): void} clearError - Clear authentication error
 */

/** @type {AuthState} */
const initialState = {
  session: null,
  isLoading: true,
  error: null
};

/**
 * Zustand store for authentication state and operations
 * @returns {AuthState & AuthActions}
 */
const useAuthStore = create((set) => ({
  ...initialState,

  /**
   * Authenticate user and set session
   * @param {User} user
   * @returns {Promise<void>}
   */
  async login(user) {
    try {
      set({ isLoading: true, error: null });

      // Simulate API call
      const mockToken = 'mock-jwt-token';
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

      const session = {
        token: mockToken,
        user,
        expiresAt
      };

      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, mockToken);
      set({ session, isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  /**
   * Clear current session
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      set({ isLoading: true, error: null });
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      set({ session: null, isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  /**
   * Verify current session validity
   * @returns {Promise<void>}
   */
  async checkAuth() {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);

      if (token) {
        // In a real app, we would verify the token with the backend
        // For now, we'll assume it's valid
        const mockUser = {
          id: 'user-1',
          username: 'admin',
          email: 'admin@example.com',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const expiresAt = new Date(Date.now() + 3600000);
        set({
          session: {
            token,
            user: mockUser,
            expiresAt
          },
          isLoading: false
        });
      } else {
        set({ session: null, isLoading: false });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  /**
   * Clear authentication error
   */
  clearError() {
    set({ error: null });
  }
}));

useAuthStore.propTypes = {
  session: PropTypes.shape({
    token: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string,
      email: PropTypes.string,
      createdAt: PropTypes.instanceOf(Date),
      updatedAt: PropTypes.instanceOf(Date)
    }),
    expiresAt: PropTypes.instanceOf(Date)
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.instanceOf(Error)
};

export default useAuthStore;