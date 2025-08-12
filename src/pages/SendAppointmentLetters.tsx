import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Button, Typography, Space, Modal, Upload, message } from 'antd';
import { SearchOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';
import '../components/PersonnelSelection.css';

const { Option } = Select;
const { Text } = Typography;

interface Submission {
  id: number;
  fullName: string;
  nssNumber: string;
  email: string;
  phoneNumber: string;
  universityAttended: string;
  yearOfNSS: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  programStudied: string;
  jobConfirmationLetterUrl: string | null;
}

const SendAppointmentLetters: React.FC = () => {
  const { role } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('SEND_LETTER');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{ url: string; submissionId: number } | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [sentLettersCount, setSentLettersCount] = useState<number>(0);

  // Fetch sent letters count
  useEffect(() => {
    const fetchSentLettersCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/users/submission-status-counts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            statuses: ['COMPLETED'],
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setSentLettersCount(data.COMPLETED || 0);
        } else {
          toast.error(data.message || 'Failed to load sent letters count');
        }
      } catch (error) {
        toast.error('Failed to load sent letters count');
      }
    };
    if (role && ['ADMIN', 'STAFF'].includes(role)) {
      fetchSentLettersCount();
    }
  }, [role]);

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
          const filteredSubmissions = data.filter((s) =>
            ['VALIDATED', 'COMPLETED'].includes(s.status)
          );
          setSubmissions(filteredSubmissions);
          setFilteredSubmissions(
            statusFilter === 'SEND_LETTER'
              ? filteredSubmissions.filter((s) => ['VALIDATED'].includes(s.status))
              : filteredSubmissions.filter((s) => s.status === 'COMPLETED')
          );
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

  // Filter submissions
  useEffect(() => {
    let filtered = submissions;
    if (statusFilter === 'SEND_LETTER') {
      filtered = filtered.filter((s) => ['VALIDATED'].includes(s.status));
    } else if (statusFilter === 'SENT_LETTERS') {
      filtered = filtered.filter((s) => s.status === 'COMPLETED');
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.fullName.toLowerCase().includes(lowerSearch) ||
          s.nssNumber.toLowerCase().includes(lowerSearch) ||
          s.email.toLowerCase().includes(lowerSearch) ||
          s.universityAttended.toLowerCase().includes(lowerSearch)
      );
    }
    setFilteredSubmissions(filtered);
    setSelectedRow(null);
  }, [statusFilter, searchTerm, submissions]);

  // Handle row selection
  const handleRowSelect = (id: number) => {
    setSelectedRow(selectedRow === id ? null : id);
  };

  // Handle file upload and send letter
  const handleSendLetter = async (submissionId: number, file?: File) => {
    if (!submissionId || (!file && !fileList.length)) return;
    setLoading(true);
    try {
      const selectedFile = file || fileList[0].originFileObj;
      if (!selectedFile || selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a valid PDF file');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('status', 'COMPLETED');

      const response = await fetch(`http://localhost:3000/documents/send-appointment-letter/${submissionId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
        setFilteredSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
        setSentLettersCount((prev) => prev + 1);
        setSelectedRow(null);
        setUploadModalVisible(false);
        setFileList([]);
        toast.success('Appointment letter sent successfully');
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to send appointment letter');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send appointment letter');
    } finally {
      setLoading(false);
    }
  };

  // Handle view letter
  const handleViewLetter = (url: string, submissionId: number) => {
    setModalContent({ url, submissionId });
    setViewModalVisible(true);
  };

  // Handle direct file input change
  const handleFileInputChange = (submissionId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSendLetter(submissionId, file);
    }
  };

  // Upload props for modal
  const uploadProps = {
    accept: '.pdf',
    fileList,
    beforeUpload: (file: any) => {
      if (file.type !== 'application/pdf') {
        message.error('You can only upload PDF files!');
        return false;
      }
      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  if (!role || (role !== 'ADMIN' && role !== 'STAFF')) {
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
      dataIndex: 'fullName',
      key: 'fullName',
      width: 120,
      ellipsis: true,
    },
    {
      title: 'NSS No.',
      dataIndex: 'nssNumber',
      key: 'nssNumber',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 110,
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      ellipsis: true,
      render: (status: string) => (
        <span className={`status-${status.toLowerCase()}`}>
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_: any, record: Submission) => (
        <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
          {statusFilter === 'SEND_LETTER' ? (
            <>
              <input
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                id={`file-input-${record.id}`}
                onChange={handleFileInputChange(record.id)}
              />
              <Button
                type="default"
                onClick={() => document.getElementById(`file-input-${record.id}`)?.click()}
                className="!border-0 !bg-[#5B3418] hover:!bg-[#5B3418] !text-white"
              >
                Send Letter
              </Button>
            </>
          ) : (
            record.jobConfirmationLetterUrl && (
              <Button
                type="link"
                onClick={() => handleViewLetter(record.jobConfirmationLetterUrl!, record.id)}
                icon={<EyeOutlined style={{ fontSize: '16px', color: '#5B3418' }} />}
              />
            )
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen px-2 py-4">
      <div className="w-full max-w-full mx-auto">
        <h2 className="text-xl font-bold text-[#3C3939] mb-4 text-center">Send Appointment Letters</h2>
        <div className="flex flex-col sm:flex-row justify-between mb-3 gap-2">
          <Space>
            <Text className="text-base font-semibold text-[#5B3418] bg-amber-100 px-3 py-1 rounded-md">
              Total Sent: {sentLettersCount}
            </Text>
            {selectedRow && statusFilter === 'SEND_LETTER' && (
              <Space>
                <Text>1 selected</Text>
                <Button
                  type="primary"
                  onClick={() => setUploadModalVisible(true)}
                  className="!bg-[#5B3418] hover:!bg-[#4a2c1c] !border-0"
                >
                  Send Letter
                </Button>
              </Space>
            )}
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="rounded-md w-fit sm:w-48"
              placeholder="Filter by status"
            >
              <Option value="SEND_LETTER">Send Letter</Option>
              <Option value="SENT_LETTERS">Sent Letters</Option>
            </Select>
          </Space>
          <Space className="w-full sm:w-auto">
            <Input
              placeholder="Search by name, NSS, email, or university"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              className="rounded-md border-[#a9a7a7] w-full sm:w-auto"
            />
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={filteredSubmissions}
          rowKey="id"
          loading={loading}
          className="rounded-md"
          scroll={{ x: 'max-content' }}
          size="large"
          pagination={{ pageSize: 10 }}
          rowClassName={(record) => (selectedRow === record.id ? 'ant-table-row-selected' : '')}
          onRow={(record) => ({
            onClick: () => {
              if (statusFilter === 'SEND_LETTER') {
                handleRowSelect(record.id);
              }
            },
          })}
        />
        <Modal
          title="Upload Appointment Letter"
          open={uploadModalVisible}
          onCancel={() => {
            setUploadModalVisible(false);
            setFileList([]);
          }}
          footer={[
            <Button
              key="cancel"
              className="!bg-[#c95757] !border-0"
              onClick={() => {
                setUploadModalVisible(false);
                setFileList([]);
              }}
            >
              Cancel
            </Button>,
            <Button
              key="send"
              type="primary"
              className="!bg-[#5B3418] !text-white !border-0"
              onClick={() => selectedRow && handleSendLetter(selectedRow)}
              disabled={fileList.length === 0}
              loading={loading}
            >
              Send
            </Button>,
          ]}
        >
          <Upload {...uploadProps} maxCount={1}>
            <Button className='!bg-[#5B3418] hover:!bg-[#4a2c1c] !border-0' icon={<UploadOutlined />}>Select PDF File</Button>
          </Upload>
          {fileList.length > 0 && (
            <p style={{ marginTop: 16 }}>Selected file: {fileList[0].name}</p>
          )}
        </Modal>
        <Modal
          title="View Appointment Letter"
          open={viewModalVisible}
          onCancel={() => {
            setViewModalVisible(false);
            setModalContent(null);
          }}
          footer={[
            <Button
              key="resend"
              className="!bg-[#5B3418] !border-0"
              onClick={() => {
                setViewModalVisible(false);
                setUploadModalVisible(true);
                setSelectedRow(modalContent?.submissionId || null);
              }}
            >
              Resend Letter
            </Button>,
            <Button
              key="close"
              className="!bg-[#696767] !border-0"
              onClick={() => {
                setViewModalVisible(false);
                setModalContent(null);
              }}
            >
              Close
            </Button>,
          ]}
          width={800}
          className="centered-modal"
        >
          {modalContent?.url && (
            <iframe
              src={modalContent.url}
              style={{ width: '100%', height: '80vh', border: 'none' }}
              title="Appointment Letter"
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default SendAppointmentLetters;