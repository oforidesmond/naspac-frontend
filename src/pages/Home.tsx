import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="bg-gray-100 h-full p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-['Kumbh_Sans',Helvetica] font-semibold">
        Dashboard
      </h2>
      <p className="mt-4 text-sm sm:text-base">
        Welcome to your dashboard. This content adjusts to the sidebar’s width and
        screen size.
      </p>
      {/* Add more content as needed */}
    </div>
  );
};

export default Home;