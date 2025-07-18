import React, { useState } from 'react';
import Card from '../components/Card';
import CardContent from '../components/CardContent';
import Input from '../components/Input';
import Button from '../components/Button';
import Carousel from '../components/Carousel';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../AuthContext';

const PersonnelLogin: React.FC = () => {
  const [nssNumber, setNssNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setRole } = useAuth();
  const navigate = useNavigate();

  // Define carousel images
  const images: string[] = ["/carousel-image-1.jpg", "/carousel-image-2.jpg", "/carousel-image-3.jpg", "/carousel-image-4.png", "/carousel-image-5.jpg", "/carousel-image-6.jpg", "/carousel-image-7.jpg"];

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const checkOnboardingStatus = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3000/users/onboarding-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check onboarding status');
      }
      return data.hasSubmitted;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      toast.error('Failed to verify onboarding status. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return null; // Return null to indicate failure
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!nssNumber.trim() || !password.trim()) {
      toast.error('Please enter both NSS number and Password', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/login-personnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nssNumber, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        setRole('PERSONNEL');

        // Check onboarding status
        const hasSubmitted = await checkOnboardingStatus(data.accessToken);
        if (hasSubmitted === null) {
          // Status check failed, do not proceed with redirection
          return;
        }

        toast.success('Login successful!', {
          position: 'top-right',
          autoClose: 2000,
        });

        // Redirect based on onboarding status
        if (hasSubmitted) {
          navigate('/'); // Redirect to homepage if submitted
        } else {
          navigate('/onboarding-form'); // Redirect to onboarding form if not submitted
        }
      } else {
        toast.error(data.message || 'Invalid credentials. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Login failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click on camouflaged button
  const handleStaffLoginRedirect = () => {
    navigate('/staff-login');
  };

  return (
    <div className="flex flex-row justify-center w-full min-h-screen relative">
      <button
        onClick={handleStaffLoginRedirect}
        className="absolute z-50 top-2 left-2 w-10 h-10 opacity-30 hover:opacity-50 focus:outline-none"
        aria-label="Staff Login"
      >
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>

      {/* Toast Container */}
      <ToastContainer />

      {/* Background Image Carousel */}
      <Carousel images={images} />

      {/* Login Card */}
      <Card className="max-h-[420px]">
        <CardContent className="p-4 sm:p-5 md:p-6">
          {/* Logos and Welcome Text */}
          <div className="flex flex-col items-center mb-3 sm:mb-3 md:mb-4">
            <div className="flex justify-center gap-1 sm:gap-1.5 mb-1 sm:mb-2 md:mb-3">
              <img
                className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] object-cover"
                alt="Naspac LOGO"
                src="/naspac-logo.png"
              />
              <img
                className="w-[38px] h-[36px] sm:w-[48px] sm:h-[46px] md:w-[58px] md:h-[56px] mt-[1px] sm:mt-[2px]"
                alt="NSS logo"
                src="/nss-logo.png"
              />
            </div>
            <h1 className="font-['Poppins',Helvetica] font-semibold text-black text-xl sm:text-2xl md:text-[28px] tracking-[-0.3px] sm:tracking-[-0.36px] md:tracking-[-0.42px]">
              Welcome Back
            </h1>
          </div>

          {/* Login Form */}
          <form className="flex flex-col gap-3 sm:gap-4 md:gap-5" onSubmit={handleSubmit}>
            <Input
              className="text-black font-normal"
              placeholder="NSS Number*"
              type="text"
              value={nssNumber}
              onChange={(e) => setNssNumber(e.target.value)}
              icon={
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[#7c838d]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />
            <div className="relative">
              <Input
                className="text-black font-normal"
                placeholder="Password*"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#7c838d]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-5 2-5 2 3.896 2 5zm0 0c0 1.104-.896 2-2 2s-2-.896-2-2m2 2v7m7-7c0 1.104-.896 2-2 2s-2-.896-2-2 2-5 2-5 2 3.896 2 5zm0 0c0 1.104-.896 2-2 2s-2-.896-2-2m2 2v7"
                    />
                  </svg>
                }
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7c838d] cursor-pointer"
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="font-['Poppins',Helvetica] text-xs sm:text-sm text-[#5b3418] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <Button className="cursor-pointer" type="submit" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
};

export default PersonnelLogin;