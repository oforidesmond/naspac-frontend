// PersonnelSelection.tsx
import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Button, Typography, Space } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useAuth } from '../AuthContext';

const { Option } = Select;
const { Text } = Typography;

interface Submission {
  id: number;
  fullName: string;
  nssNumber: string;
  gender: string;
  email: string;
  placeOfResidence: string;
  phoneNumber: string;
  universityAttended: string;
  regionOfSchool: string;
  yearOfNss: number;
  programStudied: string;
  divisionPostedTo: string;
  postingLetterUrl: string;
  appointmentLetterUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const PersonnelSelection: React.FC = () => {
  const { role } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [programFilter, setProgramFilter] = useState<string>('All courses');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [programs, setPrograms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/users/submissions', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data: Submission[] = await response.json();
        if (response.ok) {
          setSubmissions(data);
          setFilteredSubmissions(data);
          // Extract unique programs for filter
          const uniquePrograms = Array.from(new Set(data.map((s: Submission) => s.programStudied)));
          setPrograms(['All courses', ...uniquePrograms]);
        } else {
          toast.error((data as any).message || 'Failed to load submissions');
        }
      } catch (error) {
        toast.error('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = submissions;
    // Apply program filter
    if (programFilter !== 'All courses') {
      filtered = filtered.filter((s) => s.programStudied === programFilter);
    }
    // Apply search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.fullName.toLowerCase().includes(lowerSearch) ||
          s.nssNumber.toLowerCase().includes(lowerSearch) ||
          s.email.toLowerCase().includes(lowerSearch) ||
          s.universityAttended.toLowerCase().includes(lowerSearch) ||
          s.programStudied.toLowerCase().includes(lowerSearch),
      );
    }
    setFilteredSubmissions(filtered);
  }, [programFilter, searchTerm, submissions]);

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredSubmissions.map((s) => ({
      'Full Name': s.fullName,
      'NSS Number': s.nssNumber,
      'Email': s.email,
      'Gender': s.gender,
      'Place of Residence': s.placeOfResidence,
      'Phone Number': s.phoneNumber,
      'University Attended': s.universityAttended,
      'Region of School': s.regionOfSchool,
      'Year of NSS': s.yearOfNss,
      'Program Studied': s.programStudied,
      'Division Posted To': s.divisionPostedTo,
      'Status': s.status,
      'Created At': s.createdAt,
      'Updated At': s.updatedAt,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'personnel_submissions.xlsx');
  };

  // Restrict to ADMIN or STAFF
  if (role !== 'ADMIN' && role !== 'STAFF') {
    return (
      <div className="flex items-center justify-center h-full">
        <Text className="text-lg text-[#3C3939]">
          Access restricted to admin and staff users.
        </Text>
      </div>
    );
  }

  // Table columns
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'NSS Number',
      dataIndex: 'nssNumber',
      key: 'nssNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'University Attended',
      dataIndex: 'universityAttended',
      key: 'universityAttended',
    },
    {
      title: 'Region of School',
      dataIndex: 'regionOfSchool',
      key: 'regionOfSchool',
    },
    {
      title: 'Year of NSS',
      dataIndex: 'yearOfNss',
      key: 'yearOfNss',
    },
    {
      title: 'Program Studied',
      dataIndex: 'programStudied',
      key: 'programStudied',
    },
    {
      title: 'Division Posted To',
      dataIndex: 'divisionPostedTo',
      key: 'divisionPostedTo',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Posting Letter',
      key: 'postingLetterUrl',
      render: (_: any, record: Submission) =>
        record.postingLetterUrl ? (
          <a href={record.postingLetterUrl} target="_blank" rel="noopener noreferrer">
            View
          </a>
        ) : (
          'N/A'
        ),
    },
    {
      title: 'Appointment Letter',
      key: 'appointmentLetterUrl',
      render: (_: any, record: Submission) =>
        record.appointmentLetterUrl ? (
          <a href={record.appointmentLetterUrl} target="_blank" rel="noopener noreferrer">
            View
          </a>
        ) : (
          'N/A'
        ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 px-4 py-6">
      <div className="w-full max-w-full mx-auto">
        <h2 className="text-2xl font-bold text-[#3C3939] mb-6 text-center">
          Personnel Selection
        </h2>
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <Select
            value={programFilter}
            onChange={setProgramFilter}
            className="w-full sm:w-1/4 rounded-md"
            placeholder="Filter by program"
          >
            {programs.map((program) => (
              <Option key={program} value={program}>
                {program}
              </Option>
            ))}
          </Select>
          <Space>
            <Input
              placeholder="Search by name, NSS, email, university, or program"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              className="rounded-md border-[#a9a7a7]"
            />
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={exportToExcel}
              className="bg-[#5B3418]"
            >
              Export to Excel
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={filteredSubmissions}
          rowKey="id"
          loading={loading}
          className="rounded-md"
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};

export default PersonnelSelection;