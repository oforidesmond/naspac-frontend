// AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  role: 'ADMIN' | 'STAFF' | 'PERSONNEL' | null;
  setRole: (role: 'ADMIN' | 'STAFF' | 'PERSONNEL' | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  setRole: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<'ADMIN' | 'STAFF' | 'PERSONNEL' | null>(null);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);