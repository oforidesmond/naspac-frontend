import { BellFilled, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const Home: React.FC = () => {
  return (
    <div className="bg-gray-100 h-full p-4 sm:p-6 lg:p-8">
      {/* Section 1: Horizontal Card */}
      <section className="mb-6 sm:mb-8">
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between p-6 sm:p-8 rounded-lg shadow-lg bg-gradient-to-r from-[#5b3418] to-[#754726] text-white overflow-hidden">
          {/* Text Content */}
          <div className="flex-1 mb-4 sm:mb-0 sm:pr-6 z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">
              Welcome, Written-Right
            </h2>
            <p className="text-sm sm:text-base">
              Your service period has not yet started. Here is your dashboard overview.
            </p>
          </div>
          {/* SVG Image (Ghana Flag) */}
          <div className="absolute top-0 right-0 bottom-0">
            <img
              src="/ghana-flag.svg"
              alt="Ghana Flag"
              className="h-full w-auto object-cover object-right"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Placeholder */}
     <section className="mb-6 sm:mb-8">
        <h3 className="text-lg text-[#3C3939] sm:text-xl lg:text-2xl font-semibold mb-4">
          Analytics of the Overall Progress
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Card 1: Status */}
          <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow relative bg-[url('/background-pattern.svg')] bg-cover bg-center bg-no-repeat bg-opacity-10">
            <div className="flex justify-between items-stretch h-full">
              <div className="flex flex-col justify-between">
                <h4 className="text-lg text-[#625E5C] sm:text-xl font-semibold">
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
          {/* Card 2: Process Completion */}
          <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow relative bg-[url('/background-pattern.svg')] bg-cover bg-center bg-no-repeat bg-opacity-10">
            <h4 className="text-lg text-[#625E5C] sm:text-xl font-semibold mb-2 text-left">
              Process Completion
            </h4>
            <img
              src="/progress.svg"
              alt="Progress"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
          </div>
          {/* Card 3: Service Days */}
          <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow relative bg-[url('/background-pattern.svg')] bg-cover bg-center bg-no-repeat bg-opacity-10">
            <h4 className="text-lg text-[#625E5C] sm:text-xl font-semibold mb-2 text-left">
              Service Days
            </h4>
            <p className="text-2xl sm:text-3xl font-bold text-[#5B3418]">0</p>
            <p className="text-sm sm:text-base text-[#5B3418]">completed</p>
          </div>
        </div>
      </section>

      {/* Section 3: Notifications */}
      <section>
        <h3 className="text-lg text-[#3C3939] sm:text-xl lg:text-2xl font-semibold mb-4">
          Notifications
        </h3>
        <Card
          className="rounded-lg shadow-lg bg-white bg-[url('/background-pattern.svg')] bg-cover bg-center bg-no-repeat bg-opacity-10"
          bodyStyle={{ padding: '24px' }}
        >
          <div className="space-y-4">
            {/* Notification 1 */}
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
            {/* Notification 2 */}
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
            {/* miserable hack to fix the Ascending text issue */}
            {/* Notification 3 */}
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
    </div>
  );
};

export default Home;