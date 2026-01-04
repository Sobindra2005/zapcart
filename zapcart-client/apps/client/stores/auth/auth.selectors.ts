import type { AuthStore } from './auth.types';

/**
 * Selectors for optimal re-rendering
 * Use these in components to subscribe only to needed state
 */

export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;

// Return entire state for stable reference - access methods directly in components
export const selectAuthActions = (state: AuthStore) => state;
