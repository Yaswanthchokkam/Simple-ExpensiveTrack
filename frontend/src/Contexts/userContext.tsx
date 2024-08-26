import { createContext } from 'react';

export interface User {
  name: string;
  email: string;
  // Additional fields as needed
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

