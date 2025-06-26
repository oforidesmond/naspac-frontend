import React, { useState } from 'react';
import { Layout, Menu, Button, Tooltip } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  PrinterOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import './Sidebar.css';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Navigation menu items data with standardized labels
  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined className="sidebar-icon" />,
      label: 'Dashboard',
      isActive: true,
    },
    {
      key: '2',
      icon: <UserOutlined className="sidebar-icon" />,
      label: 'My Details',
      isActive: false,
    },
    {
      key: '3',
      icon: <PrinterOutlined className="sidebar-icon" />,
      label: 'Endorsed Posting Letter',
      isActive: false,
    },
    {
      key: '4',
      icon: <PrinterOutlined className="sidebar-icon" />,
      label: 'Upload NSS Document',
      isActive: false,
    },
    {
      key: '5',
      icon: <PrinterOutlined className="sidebar-icon" />,
      label: 'Appointment Letter',
      isActive: false,
    },
  ];

  // Settings menu items data
  const settingsItems = [
    {
      key: '6',
      icon: <UserOutlined className="sidebar-icon" />,
      label: 'Profile',
    },
    {
      key: '7',
      icon: <BellOutlined className="sidebar-icon" />,
      label: 'Notices',
    },
  ];

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      width={240}
      collapsedWidth={80}
      collapsible
      collapsed={collapsed}
      trigger={null}
      className="sidebar-container bg-[#5b3418] rounded-tr-[25px] overflow-hidden z-40"
      breakpoint="lg"
      onBreakpoint={(broken) => setCollapsed(broken)}
    >
      {/* Header */}
      <header className="flex justify-between items-center pt-4 px-4">
        {!collapsed && (
          <h1 className="font-medium text-white text-xl md:text-2xl">
            NSP-Portal
          </h1>
        )}
        <Button
          type="text"
          icon={<MenuOutlined className="text-lg" style={{ color: '#FFFFFF' }} />}
          onClick={toggleCollapse}
          className="text-white"
        />
      </header>

      {/* Navigation Menu */}
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: (
            <Tooltip title={item.label} placement="right">
        <span className="font-medium text-white text-sm truncate">
          {item.label}
        </span>
          </Tooltip>
          ),
        }))}
        className="bg-transparent border-0 nav-menu"
      />

      {/* Settings Section */}
      <Menu
        mode="inline"
        items={settingsItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: (
              <Tooltip title={item.label} placement="right">
        <span className="font-medium text-white text-sm truncate">
          {item.label}
        </span>
      </Tooltip>
          ),
        }))}
        className="bg-transparent border-0 settings-menu"
      />

      {/* Logout Button */}
      <Button
        type="default"
        className="flex items-center gap-2 md:gap-3 logout-button px-4 py-2 rounded-[5px] border-[#a9a7a7] text-white bg-transparent hover:bg-[#6b3e1d] hover:text-white hover:border-[#a9a7a7]"
      >
        <LogoutOutlined className="sidebar-icon" />
        {!collapsed && (
          <span className="font-medium text-sm truncate">Logout</span>
        )}
      </Button>
    </Sider>
  );
};

export default Sidebar;