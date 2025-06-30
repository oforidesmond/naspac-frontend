// AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface AuthContextType {
  role: 'ADMIN' | 'STAFF' | 'PERSONNEL' | null;
  setRole: (role: 'ADMIN' | 'STAFF' | 'PERSONNEL' | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  setRole: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<'ADMIN' | 'STAFF' | 'PERSONNEL' | null>(null);
  // const navigate = useNavigate();

  const logout = async () => {
    // try {
    //   // Call logout API (adjust endpoint as needed)
    //   await fetch('/api/logout', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     credentials: 'include', // Include cookies if using session-based auth
    //   });
      // Clear role and any stored tokens
      setRole(null);
      localStorage.removeItem('token'); // Adjust if using a different storage method
      toast.success('Logged out successfully');
      // navigate('/login');
    // } catch (error) {
    //   toast.error('Logout failed');
    // }
  };

  return (
    <AuthContext.Provider value={{ role, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);