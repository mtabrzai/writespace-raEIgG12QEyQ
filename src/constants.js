export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'writespace:authToken',
  USER_PREFERENCES: 'writespace:userPreferences',
  DOCUMENT_CONTENT: 'writespace:documentContent',
  DOCUMENT_METADATA: 'writespace:documentMetadata'
};

export const DEFAULT_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'SecurePassword123!'
};

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh',
  DOCUMENTS: '/api/documents',
  USER_PREFERENCES: '/api/user/preferences'
};

export const APP_CONSTANTS = {
  MAX_DOCUMENT_TITLE_LENGTH: 100,
  MAX_DOCUMENT_CONTENT_LENGTH: 100000,
  DEFAULT_DOCUMENT_TITLE: 'Untitled Document',
  AUTO_SAVE_INTERVAL_MS: 30000,
  SESSION_TIMEOUT_MS: 1800000
};