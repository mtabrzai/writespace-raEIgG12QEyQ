/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user
 * @property {string} username - User's username
 * @property {string} email - User's email address
 * @property {string} [avatarUrl] - URL to user's avatar image
 * @property {Date} createdAt - When the user account was created
 * @property {Date} updatedAt - When the user account was last updated
 */

/**
 * @typedef {Object} Document
 * @property {string} id - Unique identifier for the document
 * @property {string} title - Document title
 * @property {string} content - Document content in HTML
 * @property {string} ownerId - ID of the user who owns this document
 * @property {boolean} isPublic - Whether the document is publicly accessible
 * @property {Date} createdAt - When the document was created
 * @property {Date} updatedAt - When the document was last updated
 */

/**
 * @typedef {Object} Session
 * @property {string} token - JWT token for authentication
 * @property {User} user - User associated with this session
 * @property {Date} expiresAt - When the session expires
 */

/**
 * @typedef {Object} UserPreferences
 * @property {string} [theme] - User's preferred theme (light/dark/system)
 * @property {string} [fontSize] - User's preferred font size
 * @property {string} [fontFamily] - User's preferred font family
 * @property {boolean} [autoSaveEnabled] - Whether auto-save is enabled
 * @property {number} [autoSaveInterval] - Auto-save interval in milliseconds
 */