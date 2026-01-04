export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserState {
  user: User | null;
}

export interface UserActions {
  setUser: (user: User) => void;
  clearUser: () => void;
}

export type UserStore = UserState & UserActions;
