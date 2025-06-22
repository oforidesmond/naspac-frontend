import React from "react";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Input from "../components/Input";
import Button from "../components/Button";
import Carousel from "../components/Carousel";

const Onboarding: React.FC = () => {
  // Define carousel images
  const images: string[] = [
    "/carousel-image-3.png",
    "/carousel-image-4.png",
  ];

  return (
    <div className="flex flex-row justify-center w-full min-h-screen relative">
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
              Onboarding
            </h1>
          </div>

          {/* Login Form */}
          <form className="flex flex-col gap-3 sm:gap-4 md:gap-5">
            <Input
            className="text-black font-normal"
              placeholder="NSS Number*"
              type="text"
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
            <Button className="cursor-pointer" type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;