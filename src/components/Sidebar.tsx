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
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../AuthContext';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const { role, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Define route mappings for menu items
  const routeMap: { [key: string]: string } = {
    '1': '/',
    '2': role === 'PERSONNEL' ? '/my-details' : '/可可入职用户入门指南',
    '3': role === 'PERSONNEL' ? '/endorsed-posting-letter' : '/personnel-selection',
    '4': role === 'PERSONNEL' ? '/upload-nss-document' : role === 'ADMIN' ? '/endorsement' : '/manage-personnel',
    '5': role === 'PERSONNEL' ? '/appointment-letter' : role === 'ADMIN' ? '/manage-personnel' : '/dept-placements',
    '6': role === 'ADMIN' ? '/staff-management' : '/profile',
    '7': role === 'ADMIN' ? '/dept-placements' : '/notices',
  };

  // Role-based menu items
  const getMenuItems = () => {
    if (role === 'ADMIN') {
      return [
        { key: '1', icon: <DashboardOutlined className="sidebar-icon" />, label: 'Dashboard' },
        { key: '2', icon: <UserOutlined className="sidebar-icon" />, label: 'Onboard Personnel' },
        {
          key: '3',
          icon: <img src="/select-personnel.svg" alt="Personnel Selection" className="sidebar-icon" />,
          label: 'Personnel Selection',
        },
        {
          key: '4',
          icon: <img src="/endorse.svg" alt="Endorsement" className="sidebar-icon" />,
          label: 'Endorsement',
        },
        {
          key: '5',
          icon: <img src="/manage.svg" alt="Manage Personnel" className="sidebar-icon" />,
          label: 'Manage Personnel',
        },
        {
          key: '6',
          icon: <img src="/admin.svg" alt="Staff Management" className="sidebar-icon" />,
          label: 'Staff Management',
        },
        {
          key: '7',
          icon: <img src="/bank.svg" alt="Dept. Placements" className="sidebar-icon" />,
          label: 'Dept. Placements',
        },
      ];
    } else if (role === 'STAFF') {
      return [
        { key: '1', icon: <DashboardOutlined className="sidebar-icon" />, label: 'Dashboard' },
        { key: '2', icon: <UserOutlined className="sidebar-icon" />, label: 'Onboard Personnel' },
        {
          key: '3',
          icon: <img src="/select-personnel.svg" alt="Personnel Selection" className="sidebar-icon" />,
          label: 'Personnel Selection',
        },
        {
          key: '4',
          icon: <img src="/manage.svg" alt="Manage Personnel" className="sidebar-icon" />,
          label: 'Manage Personnel',
        },
        {
          key: '5',
          icon: <img src="/bank.svg" alt="Dept. Placements" className="sidebar-icon" />,
          label: 'Dept. Placements',
        },
      ];
    }
    // Personnel menu
    return [
      { key: '1', icon: <DashboardOutlined className="sidebar-icon" />, label: 'Dashboard' },
      { key: '2', icon: <UserOutlined className="sidebar-icon" />, label: 'My Details' },
      {
        key: '3',
        icon: <PrinterOutlined className="sidebar-icon" />,
        label: 'Endorsed Posting Letter',
      },
      {
        key: '4',
        icon: <PrinterOutlined className="sidebar-icon" />,
        label: 'Upload NSS Document',
      },
      {
        key: '5',
        icon: <PrinterOutlined className="sidebar-icon" />,
        label: 'Appointment Letter',
      },
    ];
  };

  // Settings menu (same for all roles)
  const settingsItems = [
    { key: '6', icon: <UserOutlined className="sidebar-icon" />, label: 'Profile' },
    { key: '7', icon: <BellOutlined className="sidebar-icon" />, label: 'Notices' },
  ];

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    const path = routeMap[key];
    if (path) {
      navigate(path);
    }
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
      <header className="flex justify-between items-center pt-4 px-4">
        {!collapsed && (
          <h1 className="font-medium text-white text-xl sm:text-2xl">
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

      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        onClick={handleMenuClick}
        items={getMenuItems().map((item) => ({
          key: item.key,
          icon: item.icon,
          label: (
            <Tooltip title={collapsed ? item.label : ''} placement="right">
              <span className="font-medium text-white text-sm truncate">
                {item.label}
              </span>
            </Tooltip>
          ),
        }))}
        className="bg-transparent border-0 nav-menu"
      />

      <Menu
        mode="inline"
        onClick={handleMenuClick}
        items={settingsItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: (
            <Tooltip title={collapsed ? item.label : ''} placement="right">
              <span className="font-medium text-white text-sm truncate">
                {item.label}
              </span>
            </Tooltip>
          ),
        }))}
        className="bg-transparent border-0 settings-menu"
      />

      <Button
        type="default"
        onClick={logout}
        className="flex items-center gap-2 sm:gap-3 logout-button px-4 py-2 rounded-[5px] border-[#a9a7a7] text-white bg-transparent hover:bg-[#6b3e1d] hover:text-white hover:border-[#a9a7a7]"
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