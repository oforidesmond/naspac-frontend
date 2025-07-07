import React from 'react';
import { Card, Avatar, Typography } from 'antd';
import { BellFilled, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '../AuthContext';

const { Text } = Typography;

const Home: React.FC = () => {
  const { role } = useAuth();

  // Role-based dashboard content
  const renderDashboardContent = () => {
    if (role === 'ADMIN' || role === 'STAFF') {
      const dashboardTitle = role === 'ADMIN' ? 'Admin Dashboard' : 'Assistant Admin Dashboard';
      const cardTitles = role === 'ADMIN'
        ? ['Personnel', 'Staff', 'Endorsement', 'Department']
        : ['Onboard', 'Personnel', 'Manage', 'Department'];
      const cardIcons = [
        '/admin-hero-1.svg',
        '/admin-hero-2.svg',
        '/admin-hero-3.svg',
        '/admin-hero-4.svg',
      ];

        const cardGradients = [
    'bg-gradient-to-r from-[#8B5523] to-[#5B3418]',
    'bg-gradient-to-r from-[#C3C3C3] to-[#5E5E5E]',
    'bg-gradient-to-r from-[#CC6F22] to-[#940000]',
    'bg-gradient-to-r from-[#684A31] to-[#261700]',
  ];

      return (
        <>
          {/* Section 1: Admin/Assistant Admin Dashboard Cards */}
         <section className="mb-6 sm:mb-8">
  <h2 className="text-md sm:text-xl lg:text-2xl font-bold text-[#3C3939] mb-4">
    {dashboardTitle}
  </h2>
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
    {cardTitles.map((title, index) => (
      <div
        key={index}
        className={`w-[280px] h-[120px] sm:w-[230px] sm:h-[140px] p-4 sm:p-6 rounded-md shadow ${cardGradients[index]}`}
      >
        <div className="flex justify-between items-start h-full">
          <div className="flex flex-col justify-between">
            <img
              src={cardIcons[index]}
              alt={title}
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain mb-6"
            />
            <h4 className="text-base sm:text-md font-semibold text-white">
              {title}
            </h4>
          </div>
          <div className="text-right">
            <p className="text-sm sm:text-base text-white">Total</p>
            <p className="text-2xl sm:text-4xl font-bold text-white">0</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

         {/* Section 2: Four Cards in 2x2 Grid */}
      <section className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#3C3939] mb-4">
          System Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-xl">
          {[
            { title: 'Total Selections', value: 0 },
            { title: 'Pending Selection', value: 0 },
            { title: 'Total Endorsed', value: 0 },
            { title: 'Pending Endorsement', value: 0 },
          ].map((card, index) => (
            <div
              key={index}
              className="w-[200px] h-[120px] bg-white p-4 sm:p-5 rounded-lg shadow"
            >
              <h4 className="text-base sm:text-lg font-semibold text-[#625E5C] mb-2">
                {card.title}
              </h4>
              <p className="text-xl sm:text-2xl font-bold text-[#5B3418]">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Recent Activity with Notifications */}
      <section>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#3C3939] mb-4">
          Recent Activity
        </h3>
        <Card
          className="rounded-lg shadow-lg bg-white bg-[url('/background-pattern.svg')] bg-cover bg-center bg-no-repeat bg-opacity-10"
          bodyStyle={{ padding: '24px' }}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md transition">
              <Avatar
                size={40}
                style={{ backgroundColor: '#e6f7ff' }}
                icon={<BellFilled style={{ color: '#1890ff' }} />}
              />
              <div className="flex-1">
                <Text strong className="text-base">New Submission Received</Text>
                <Text type="secondary" className="text-sm block">
                  A new onboarding submission from Jane Smith is pending review.
                </Text>
                <Text type="secondary" className="text-xs">5 minutes ago</Text>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md transition">
              <Avatar
                size={40}
                style={{ backgroundColor: '#fff1f0' }}
                icon={<UserOutlined style={{ color: '#f5222d' }} />}
              />
              <div className="flex-1">
                <Text strong className="text-base">Profile Update Required</Text>
                <Text type="secondary" className="text-sm block">
                  Please update your NSS number in your profile.
                </Text>
                <Text type="secondary" className="text-xs">1 hour ago</Text>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md transition">
              <Avatar
                size={40}
                style={{ backgroundColor: '#f6ffed' }}
                icon={<SettingOutlined style={{ color: '#52c41a' }} />}
              />
              <div className="flex-1">
                <Text strong className="text-base">System Maintenance</Text>
                <Text type="secondary" className="text-sm block">
                  Scheduled maintenance on June 26, 2025, from 2 AM to 4 AM.
                </Text>
                <Text type="secondary" className="text-xs">Yesterday</Text>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Text type="secondary" className="text-sm cursor-pointer hover:text-blue-500">
              View all notifications
            </Text>
          </div>
        </Card>
      </section>
        </>
      );
    }

    // Personnel dashboard
    return (
      <>
        {/* Section 1: Horizontal Card */}
        <section className="mb-6 sm:mb-8">
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between p-6 sm:p-8 rounded-lg shadow-lg bg-gradient-to-r from-[#5b3418] to-[#754726] text-white overflow-hidden">
            <div className="flex-1 mb-4 sm:mb-0 sm:pr-6 z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">
                Welcome, Written-Right
              </h2>
              <p className="text-sm sm:text-base">
                Your service period has not yet started. Here is your dashboard overview.
              </p>
            </div>
            <div className="absolute top-0 right-0 bottom-0">
              <img
                src="/ghana-flag.svg"
                alt="Ghana Flag"
                className="h-full w-auto object-cover object-right"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Analytics */}
        <section className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#3C3939] mb-4">
            Analytics of the Overall Progress
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow relative bg-[url('/background-pattern.svg')] bg-cover bg-center bg-no-repeat bg-opacity-10">
              <div className="flex justify-between items-stretch h-full">
                <div className="flex flex-col justify-between">
                  <h4 className="text-lg sm:text-xl font-semibold text-[#625E5C]">
                    Status
                  </h4>
                  <p className="text-sm sm:text-base text-[#a59f9f]">Pending Review</p>
                </div>
                <img
                  src="/spinner.svg"
                  alt="Spinner"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain self-start"
                />
              </div>
            </div>
            <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow relative bg-[url('/background-pattern.svg')] bg-cover bg-center bg-no-repeat bg-opacity-10">
              <h4 className="text-lg sm:text-xl font-semibold text-[#625E5C] mb-2 text-left">
                Process Completion
              </h4>
              <img
                src="/progress.svg"
                alt="Progress"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
            </div>
            <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow relative bg-[url('/background-pattern.svg')] bg-cover bg-center bg-no-repeat bg-opacity-10">
              <h4 className="text-lg sm:text-xl font-semibold text-[#625E5C] mb-2 text-left">
                Service Days
              </h4>
              <p className="text-2xl sm:text-3xl font-bold text-[#5B3418]">0</p>
              <p className="text-sm sm:text-base text-[#5B3418]">completed</p>
            </div>
          </div>
        </section>

        {/* Section 3: Notifications */}
        <section>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#3C3939] mb-4">
            Notifications
          </h3>
          <Card
            className="rounded-lg shadow-lg bg-white bg-[url('/background-pattern.svg')] bg-cover bg-center bg-no-repeat bg-opacity-10"
            bodyStyle={{ padding: '24px' }}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md transition">
                <Avatar
                  size={40}
                  style={{ backgroundColor: '#e6f7ff' }}
                  icon={<BellFilled style={{ color: '#1890ff' }} />}
                />
                <div className="flex-1">
                  <Text strong className="text-base">New Submission Received</Text>
                  <Text type="secondary" className="text-sm block">
                    A new onboarding submission from Jane Smith is pending review.
                  </Text>
                  <Text type="secondary" className="text-xs">5 minutes ago</Text>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md transition">
                <Avatar
                  size={40}
                  style={{ backgroundColor: '#fff1f0' }}
                  icon={<UserOutlined style={{ color: '#f5222d' }} />}
                />
                <div className="flex-1">
                  <Text strong className="text-base">Profile Update Required</Text>
                  <Text type="secondary" className="text-sm block">
                    Please update your NSS number in your profile.
                  </Text>
                  <Text type="secondary" className="text-xs">1 hour ago</Text>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md transition">
                <Avatar
                  size={40}
                  style={{ backgroundColor: '#f6ffed' }}
                  icon={<SettingOutlined style={{ color: '#52c41a' }} />}
                />
                <div className="flex-1">
                  <Text strong className="text-base">System Maintenance</Text>
                  <Text type="secondary" className="text-sm block">
                    Scheduled maintenance on June 26, 2025, from 2 AM to 4 AM.
                  </Text>
                  <Text type="secondary" className="text-xs">Yesterday</Text>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Text type="secondary" className="text-sm cursor-pointer hover:text-blue-500">
                View all notifications
              </Text>
            </div>
          </Card>
        </section>
      </>
    );
  };

  return (
    <div className="bg-[#FCEEE9] h-full p-4 sm:p-6 lg:p-8">
      {renderDashboardContent()}
    </div>
  );
};

export default Home;