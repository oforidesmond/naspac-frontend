import React from 'react';
import { BellFilled, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Menu, Avatar, Typography } from 'antd';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const Header: React.FC = () => {
  const { name, email, role, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  // Handle logout action
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      // Error is handled in useAuth.logout with toast
    }
  };

  // Notification Dropdown Content
  const notificationMenu = (
    <div className="w-80 bg-white shadow-lg rounded-lg p-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <Text strong>Notifications</Text>
        <Text type="secondary" className="text-xs cursor-pointer hover:text-blue-500">
          Mark all as read
        </Text>
      </div>
      <div className="space-y-3">
        {/* Notification Item 1 */}
        <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
          <Avatar
            size={32}
            style={{ backgroundColor: '#e6f7ff' }}
            icon={<BellFilled style={{ color: '#1890ff' }} />}
          />
          <div>
            <Text className="text-sm">New Submission Received</Text>
            <Text type="secondary" className="text-xs block">
              A new onboarding submission from Jane Smith is pending review.
            </Text>
            <Text type="secondary" className="text-xs">5 minutes ago</Text>
          </div>
        </div>
        {/* Notification Item 2 */}
        <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
          <Avatar
            size={32}
            style={{ backgroundColor: '#fff1f0' }}
            icon={<UserOutlined style={{ color: '#f5222d' }} />}
          />
          <div>
            <Text className="text-sm">Profile Update Required</Text>
            <Text type="secondary" className="text-xs block">
              Please update your NSS number in your profile.
            </Text>
            <Text type="secondary" className="text-xs">1 hour ago</Text>
          </div>
        </div>
        {/* Notification Item 3 */}
        <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
          <Avatar
            size={32}
            style={{ backgroundColor: '#f6ffed' }}
            icon={<SettingOutlined style={{ color: '#52c41a' }} />}
          />
          <div>
            <Text className="text-sm">System Maintenance</Text>
            <Text type="secondary" className="text-xs block">
              Scheduled maintenance on June 26, 2025, from 2 AM to 4 AM.
            </Text>
            <Text type="secondary" className="text-xs">Yesterday</Text>
          </div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <Text type="secondary" className="text-xs cursor-pointer hover:text-blue-500">
          View all notifications
        </Text>
      </div>
    </div>
  );

  // Profile Dropdown Content
  const profileMenu = (
    <div className="w-70 bg-white shadow-lg rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <Avatar size={40} icon={<UserOutlined />} />
        <div>
          <Text strong className="text-sm">
            {isLoading ? 'Loading...' : name || 'User'}
          </Text>
          <Text type="secondary" className="text-xs block">
            {isLoading ? 'Loading...' : email || ''}
          </Text>
          <Text type="secondary" className="text-xs capitalize">
            {isLoading ? 'Loading...' : role || 'Guest'}
          </Text>
        </div>
      </div>
      <Menu selectable={false}>
        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md text-stone-600 font-semibold">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 max-w-7xl mx-auto">
        {/* Logo or Left Side */}
        <div className="flex items-center">
          <span className="text-xl font-bold"></span>
        </div>

        {/* Right Side: Profile, Name, Notifications */}
        <div className="flex items-center gap-3 sm:gap-5 lg:gap-7">
          {/* Profile Icon and User Name */}
          <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
              <UserOutlined className="text-base sm:text-lg" />
              <span className="hidden sm:inline text-sm">
                {isLoading ? 'Loading...' : name || 'User'}
              </span>
            </div>
          </Dropdown>

          {/* Notification Bell with Badge */}
          <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
            <div className="cursor-pointer hover:bg-gray-100 p-1 rounded">
              <Badge
                count={5}
                offset={[0, 0]}
                className="flex items-center"
                style={{
                  fontSize: '10px',
                  height: '16px',
                  minWidth: '16px',
                  lineHeight: '16px',
                  padding: '0 4px',
                  backgroundColor: '#ff4d4f',
                  color: '#fff',
                }}
              >
                <BellFilled className="text-base sm:text-lg" />
              </Badge>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;