// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface AuthContextType {
  role: 'ADMIN' | 'STAFF' | 'PERSONNEL' | null;
  setRole: (role: 'ADMIN' | 'STAFF' | 'PERSONNEL' | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  setRole: () => {},
  logout: () => {},
  isLoading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<'ADMIN' | 'STAFF' | 'PERSONNEL' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
       if (!token) {
        setIsLoading(false);
        return;
      }
        try {
          const response = await fetch('http://localhost:3000/auth/validate', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          });
          const data = await response.json();
         if (response.ok && data.success && data.role) {
            setRole(data.role);
          } else {
            localStorage.removeItem('token');
            setRole(null);
          }
        } catch (error) {
          localStorage.removeItem('token');
          setRole(null);
      }finally {
        setIsLoading(false);
      }
    };
    validateToken();
  }, []);

  const logout = async () => {
    try {
      await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      localStorage.removeItem('token');
      setRole(null);
      toast.success('Logged out successfully');
      window.history.back();
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ role, setRole, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);