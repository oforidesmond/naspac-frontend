import React, { useState, useEffect } from 'react';
import { Table, Select, Button, Typography, Modal, Form, Input, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';
import '../components/PersonnelSelection.css';

const { Option } = Select;
const { Text } = Typography;

interface Department {
  id: number;
  name: string;
}

interface Staff {
  id: number;
  staffId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'SUPERVISOR';
  departmentsSupervised: Department[];
}

const StaffManagement: React.FC = () => {
  const { role } = useAuth();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [filteredStaffList, setFilteredStaffList] = useState<Staff[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch all staff
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/users/staff', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data: Staff[] = await response.json();
        if (response.ok) {
          setStaffList(data);
          setFilteredStaffList(data);
        } else {
          toast.error((data as any).message || 'Failed to load staff');
        }
      } catch (error) {
        toast.error('Failed to load staff');
      } finally {
        setLoading(false);
      }
    };
    if (role === 'ADMIN') {
      fetchStaff();
    }
  }, [role]);

  // Filter logic
  useEffect(() => {
    let filtered = staffList;
    if (roleFilter !== 'All') {
      filtered = staffList.filter((s) => s.role === roleFilter);
    }
    setFilteredStaffList(filtered);
  }, [roleFilter, staffList]);

  // Handle create user
  const handleCreateUser = async (values: { staffId: string; name: string; email: string; role: string }) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/auth/init-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
       setStaffList((prev) => [...prev, { ...data, departmentsSupervised: [] }]);
        setFilteredStaffList((prev) => [...prev, { ...data, departmentsSupervised: [] }]);
        setCreateModalVisible(false);
        form.resetFields();
        toast.success('User created successfully');
        window.location.reload();
      } else {
        toast.error(data.message || 'Failed to create user');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // Restrict to ADMIN
  if (!role || role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-full">
        <Text className="text-lg text-[#3C3939]">Access restricted.</Text>
      </div>
    );
  }

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: 'Staff ID',
      dataIndex: 'staffId',
      key: 'staffId',
      width: 100,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 160,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 70,
      render: (role: string) => (
        <span className={`status-${role.toLowerCase()}`}>
          {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
        </span>
      ),
    },
        {
      title: 'Department',
      dataIndex: 'departmentsSupervised',
      key: 'department',
      width: 160,
      render: (departments: Department[]) =>
        departments.length > 0
          ? departments.map((dept) => dept.name).join(', ')
          : '',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen px-2 py-4">
      <div className="w-full max-w-full mx-auto">
        <h2 className="text-xl font-bold text-[#3C3939] mb-4 text-center">Staff Management</h2>
        <div className="flex flex-col sm:flex-row justify-between mb-3 gap-2">
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
              className="!bg-[#5B3418] hover:!bg-[#4a2c1c] !border-0"
            >
              Create User
            </Button>
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              className="rounded-md w-fit sm:w-48"
              placeholder="Filter by role"
            >
              <Option value="All">All</Option>
              <Option value="ADMIN">Admin</Option>
              <Option value="STAFF">Staff</Option>
              <Option value="SUPERVISOR">Supervisor</Option>
            </Select>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={filteredStaffList}
          rowKey="id"
          loading={loading}
          className="rounded-md"
          scroll={{ x: 'max-content' }}
          size="small"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title="Create New User"
          open={createModalVisible}
          onCancel={() => {
            setCreateModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          className="centered-modal"
        >
          <Form
            form={form}
            onFinish={handleCreateUser}
            layout="vertical"
            className="mt-4"
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter full name' }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
            <Form.Item
              name="staffId"
              label="Staff ID"
              rules={[{ required: true, message: 'Please enter staff ID' }]}
            >
              <Input placeholder="Enter staff ID" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select placeholder="Select role">
                <Option value="ADMIN">Admin</Option>
                <Option value="STAFF">Staff</Option>
                <Option value="SUPERVISOR">Supervisor</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="!bg-[#5B3418] hover:!bg-[#4a2c1c] !border-0"
                >
                  Create
                </Button>
                <Button
                  className="!bg-[#c95757] !border-0"
                  onClick={() => {
                    setCreateModalVisible(false);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default StaffManagement;