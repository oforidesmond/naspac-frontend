import React from 'react';
import Notifications from '../components/Notifications';

const NotificationsPage: React.FC = () => {
  return (
    <div className="bg-[#FCEEE9] h-full p-4 sm:p-6 lg:p-8">
      <Notifications displayMode="full" />
    </div>
  );
};

export default NotificationsPage;