import type { UserStore } from './user.types';

/**
 * Selectors for optimal re-rendering
 * Use these in components to subscribe only to needed state
 */

export const selectUser = (state: UserStore) => state.user;
export const selectUserId = (state: UserStore) => state.user?.id;
export const selectUserName = (state: UserStore) => `${state.user?.firstName} ${state.user?.lastName}`;
export const selectUserEmail = (state: UserStore) => state.user?.email;
export const selectUserRole = (state: UserStore) => state.user?.role;
export const selectIsAdmin = (state: UserStore) => state.user?.role === 'ADMIN';

export const selectUserActions = (state: UserStore) => state;
