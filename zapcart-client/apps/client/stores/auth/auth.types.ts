export interface AuthState {
  isAuthenticated: boolean;
}

export interface AuthActions {
  login: () => void;
  logout: () => void;
}

export type AuthStore = AuthState & AuthActions;
