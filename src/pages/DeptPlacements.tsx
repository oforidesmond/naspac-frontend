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
  supervisorId: number;
  supervisorName: string;
}

interface Personnel {
  id: number;
  name: string;
  nssNumber: string;
  department: { id: number; name: string } | null;
  submissions: {
    id: number;
    fullName: string;
    nssNumber: string;
    programStudied: string;
    divisionPostedTo: string;
    status: string;
  }[];
  supervisor: { id: number; name: string } | null;
}

interface Supervisor {
  id: number;
  name: string;
  role: 'ADMIN' | 'STAFF' | 'SUPERVISOR';
}

const DepartmentPlacements: React.FC = () => {
  const { role } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState<Personnel[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch departments and personnel
  useEffect(() => {
    const fetchDepartmentsAndPersonnel = async () => {
      setLoading(true);
      try {
        // Fetch departments
        const deptResponse = await fetch('http://localhost:3000/users/departments', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const deptData: Department[] = await deptResponse.json();
        if (!deptResponse.ok) {
          throw new Error((deptData as any).message || 'Failed to load departments');
        }

        // Fetch personnel
       const personnelResponse = await fetch('http://localhost:3000/users/personnel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ statuses: ['VALIDATED', 'COMPLETED'] }),
      });
      const personnelData: Personnel[] = await personnelResponse.json();
      if (!personnelResponse.ok) {
        throw new Error((personnelData as any).message || 'Failed to load personnel');
      }

         setDepartments(deptData);
      setPersonnel(personnelData);
      setFilteredPersonnel(personnelData);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    // Fetch supervisors for the modal
    const fetchSupervisors = async () => {
      try {
        const response = await fetch('http://localhost:3000/users/staff', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data: Supervisor[] = await response.json();
        if (response.ok) {
          setSupervisors(data.filter((s) => s.role === 'SUPERVISOR'));
        } else {
          toast.error((data as any).message || 'Failed to load supervisors');
        }
      } catch (error) {
        toast.error('Failed to load supervisors');
      }
    };

    if (role && ['ADMIN', 'STAFF'].includes(role)) {
      fetchDepartmentsAndPersonnel();
      fetchSupervisors();
    }
  }, [role]);

  // Filter logic
  useEffect(() => {
  let filtered = personnel;
  if (departmentFilter !== 'All') {
    filtered = personnel.filter((p) => p.department?.name === departmentFilter);
  }
    setFilteredPersonnel(filtered);
  }, [departmentFilter, personnel]);

  // Handle create department
  const handleCreateDepartment = async (values: { name: string; supervisorId: number }) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/users/create-department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: values.name,
          supervisorId: Number(values.supervisorId), // Ensure supervisorId is a number
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setDepartments((prev) => [...prev, { ...data, supervisorName: supervisors.find((s) => s.id === data.supervisorId)?.name || 'Unknown' }]);
        setCreateModalVisible(false);
        form.resetFields();
        toast.success('Department created successfully');
      } else {
        toast.error(data.message || 'Failed to create department');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create department');
    } finally {
      setLoading(false);
    }
  };

  // Restrict to ADMIN or STAFF
  if (!role || !['ADMIN', 'STAFF'].includes(role)) {
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
      width: 180,
    },
    {
      title: 'NSS No.',
      dataIndex: 'nssNumber',
      key: 'nssNumber',
      width: 150,
    },
    {
    title: 'Department',
    dataIndex: ['department', 'name'],
    key: 'department',
    width: 200,
    render: (name: string | undefined) => name || 'Unassigned',
    },
    {
    title: 'Program Studied',
    key: 'programStudied',
    width: 180,
    render: (record: Personnel) => record.submissions[0]?.programStudied || 'N/A',
  },
  {
    title: 'Supervisor',
    dataIndex: ['supervisor', 'name'],
    key: 'supervisor',
    width: 200,
    render: (name: string | undefined) => name || 'Unassigned',
    },
      {
    title: 'Status',
    key: 'status',
    width: 150,
    render: (record: Personnel) => (
      <span className={`status-${record.submissions[0]?.status.toLowerCase()}`}>
        {record.submissions[0]?.status.charAt(0).toUpperCase() + record.submissions[0]?.status.slice(1).toLowerCase()}
      </span>
    ),
  },
  ];

  return (
    <div className="flex flex-col min-h-screen px-2 py-4">
      <div className="w-full max-w-full mx-auto">
        <h2 className="text-xl font-bold text-[#3C3939] mb-4 text-center">Department Placements</h2>
        <div className="flex flex-col sm:flex-row justify-between mb-3 gap-2">
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
              className="!bg-[#5B3418] hover:!bg-[#4a2c1c] !border-0"
            >
              Create Department
            </Button>
            <Select
              value={departmentFilter}
              onChange={setDepartmentFilter}
              className="rounded-md w-fit sm:w-48"
              placeholder="Filter by department"
            >
              <Option value="All">All</Option>
              {departments.map((dept) => (
                <Option key={dept.id} value={dept.name}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={filteredPersonnel}
          rowKey="id"
          loading={loading}
          className="rounded-md"
          scroll={{ x: 'max-content' }}
          size="small"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title="Create New Department"
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
            onFinish={handleCreateDepartment}
            layout="vertical"
            className="mt-4"
          >
            <Form.Item
              name="name"
              label="Department Name"
              rules={[{ required: true, message: 'Please enter department name' }]}
            >
              <Input placeholder="Enter department name" />
            </Form.Item>
            <Form.Item
              name="supervisorId"
              label="Supervisor"
              rules={[{ required: true, message: 'Please select a supervisor' }]}
            >
              <Select placeholder="Select supervisor">
                {supervisors.map((supervisor) => (
                  <Option key={supervisor.id} value={supervisor.id}>
                    {supervisor.name}
                  </Option>
                ))}
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

export default DepartmentPlacements;