import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Input from "../components/Input";
import Button from "../components/Button";
import Carousel from "../components/Carousel";

const Onboarding: React.FC = () => {
  const [nssNumber, setNssNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Security features to restrict navigation
  useEffect(() => {
    // 1. Enter full-screen mode to hide browser controls
    const goFullScreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log("Fullscreen request failed:", err);
        });
      }
    };
    goFullScreen();

    // 2. Trap navigation with popstate to prevent back/forward
    const trapNavigation = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href); // Initial state
    window.addEventListener("popstate", trapNavigation);

    // 3. Disable right-click (context menu)
    const preventContextMenu = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", preventContextMenu);

    // 4. Block keyboard shortcuts
    const preventShortcuts = (e: KeyboardEvent) => {
      if (
        e.ctrlKey || // Ctrl+anything (e.g., Ctrl+T, Ctrl+R)
        e.altKey || // Alt+anything (e.g., Alt+Left for back)
        ["F12", "Escape"].includes(e.key) || // Dev tools, Escape
        (e.metaKey && ["t", "n", "r"].includes(e.key.toLowerCase())) // Cmd+T, Cmd+N, Cmd+R (Mac)
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", preventShortcuts);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("popstate", trapNavigation);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventShortcuts);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => console.log("Exit fullscreen failed:", err));
      }
    };
  }, []);

  // Define carousel images
  const images: string[] = ["/carousel-image-1.jpg", "/carousel-image-2.jpg", "/carousel-image-3.jpg", "/carousel-image-4.png", "/carousel-image-5.jpg", "/carousel-image-6.jpg", "/carousel-image-7.jpg"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!nssNumber.trim()) {
      toast.error("Please enter an NSS Number", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Check for valid token
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to initiate onboarding", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/staff-login");
      return;
    }
    // Show confirmation modal
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setShowModal(false);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/auth/init-onboarding",
        { nssNumber, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Onboarding link sent successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      // Clear form fields
      setNssNumber("");
      setEmail("");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to initiate onboarding. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });

      // Handle unauthorized (401) without redirect
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        localStorage.removeItem("token");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-row justify-center w-full min-h-screen relative onboarding-container">
      <ToastContainer />
      <Carousel images={images} />
      <Card className="max-h-[420px]">
        <CardContent className="p-4 sm:p-5 md:p-6">
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
              Onboarding
            </h1>
          </div>
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
            <Input
              className="text-black font-normal"
              placeholder="Email*"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                    d="M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M22 6l-10 7L2 6"
                  />
                </svg>
              }
            />
            <Button className="cursor-pointer" type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-[30px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="font-['Poppins',Helvetica] font-semibold text-black text-xl text-center mb-4">
              Confirm Details
            </h2>
            <p className="text-black mb-2">
              <strong>NSS Number:</strong> {nssNumber}
            </p>
            <p className="text-black mb-6">
              <strong>Email:</strong> {email}
            </p>
            <p className="text-black mb-6">
              Are you sure you want to proceed with these details?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="font-['Poppins',Helvetica] text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="font-['Poppins',Helvetica] text-sm bg-[#5b3418] text-white px-4 py-2 rounded hover:bg-[#7c838d] cursor-pointer"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;