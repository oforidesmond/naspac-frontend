import React, { useState } from 'react';
import { Card, Typography, Form, Upload, Button, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import type { UploadFile, UploadProps } from 'antd';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [signatureFile, setSignatureFile] = useState<UploadFile | null>(null);
  const [stampFile, setStampFile] = useState<UploadFile | null>(null);

  // Handle file changes for signature
  const handleSignatureChange: UploadProps['onChange'] = ({ file }) => {
    console.log('Signature onChange:', file.name, file.status);
    if (file.status === 'done' || file.status === 'uploading') {
      setSignatureFile(file);
    } else if (file.status === 'error') {
      console.error('Signature upload error:', file.error);
      message.error('Failed to process signature file.');
    }
  };

  // Handle file changes for stamp
  const handleStampChange: UploadProps['onChange'] = ({ file }) => {
    console.log('Stamp onChange:', file.name, file.status);
    if (file.status === 'done' || file.status === 'uploading') {
      setStampFile(file);
    } else if (file.status === 'error') {
      console.error('Stamp upload error:', file.error);
      message.error('Failed to process stamp file.');
    }
  };

  // Handle form submission
  const handleUpload = async () => {
    console.log('handleUpload triggered');

    // Validate files
    if (!signatureFile || !stampFile) {
      console.error('Validation failed: Missing signature or stamp file', {
        signatureFile,
        stampFile,
      });
      message.error('Please upload both a signature and a stamp.');
      return;
    }

    if (!signatureFile.originFileObj || !stampFile.originFileObj) {
      console.error('Validation failed: Missing originFileObj', {
        signatureOriginFileObj: signatureFile.originFileObj,
        stampOriginFileObj: stampFile.originFileObj,
      });
      message.error('Invalid file selection. Please re-upload signature and stamp.');
      return;
    }

    if (!(signatureFile.originFileObj instanceof File) || !(stampFile.originFileObj instanceof File)) {
      console.error('Validation failed: originFileObj is not a File', {
        signatureType: typeof signatureFile.originFileObj,
        stampType: typeof stampFile.originFileObj,
      });
      message.error('Invalid file format. Please upload valid PNG or JPEG files.');
      return;
    }

    // Create FormData
    const formData = new FormData();
    try {
      formData.append('files', signatureFile.originFileObj, `signature-${signatureFile.name}`);
      formData.append('files', stampFile.originFileObj, `stamp-${stampFile.name}`);
      console.log('FormData created with files:', {
        signatureName: signatureFile.name,
        stampName: stampFile.name,
      });
    } catch (error) {
      console.error('Error creating FormData:', error);
      message.error('Failed to prepare files for upload.');
      return;
    }

    // Validate token
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      message.error('Please log in to upload files.');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending axios POST request to /users/upload-signage');
      const response = await axios.post(
        'http://localhost:3000/users/upload-signage',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Upload successful, response:', response.data);
      message.success(response.data.message || 'Signature and stamp uploaded successfully.');
      form.resetFields();
      setSignatureFile(null);
      setStampFile(null);
    } catch (error: any) {
      console.error('Upload failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to upload files. Please try again.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
      console.log('Upload process completed, loading set to false');
    }
  };

  // Handle form submission failure
  const onFinishFailed = (errorInfo: any) => {
    console.error('Form validation failed:', errorInfo);
    message.error('Form submission failed. Please ensure both files are uploaded.');
  };

  // Custom upload props
  const uploadProps: UploadProps = {
    accept: 'image/png,image/jpeg',
    beforeUpload: (file: File): boolean => {
      console.log('Validating file:', file.name, { type: file.type, size: file.size });
      const isValidType = ['image/png', 'image/jpeg'].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB limit
      if (!isValidType) {
        console.error('Invalid file type:', file.type);
        message.error('Only PNG or JPEG files are allowed!');
        return false;
      }
      if (!isValidSize) {
        console.error('File too large:', file.size);
        message.error('File must be smaller than 2MB!');
        return false;
      }
      console.log('File validation passed:', file.name);
      return true;
    },
    maxCount: 1,
    customRequest: ({ onSuccess }) => {
      // Prevent default upload behavior
      console.log('customRequest called, bypassing default upload');
      onSuccess?.('ok');
    },
  };

  // Only render upload form for admins
  if (role !== 'ADMIN') {
    console.log('Non-admin user, role:', role);
    return (
      <div className="bg-[#FCEEE9] h-full p-4 sm:p-6 lg:p-8">
        <Row justify="center">
          <Col xs={24} lg={12}>
            <Card className="rounded-lg shadow-lg bg-white">
              <Title level={4} className="text-[#3C3939]">
                Access Denied
              </Title>
              <Text>Only admins can upload signature and stamp images.</Text>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="bg-[#FCEEE9] h-full p-4 sm:p-6 lg:p-8">
      <Row justify="center">
        <Col xs={24} lg={12}>
          <Card
            className="rounded-lg shadow-lg bg-white bg-[url('/background-pattern.svg')] bg-cover bg-center bg-no-repeat bg-opacity-10"
            bodyStyle={{ padding: '24px' }}
            title={<Title level={4} className="text-[#3C3939">Upload Signature & Stamp</Title>}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpload}
              onFinishFailed={onFinishFailed}
              className="space-y-4"
            >
              <Form.Item
                name="signature"
                label={
                  <>
                    <Text strong>Signature (PNG/JPEG, Max 2MB)</Text>
                    <Text type="secondary" className="block">
                      File name should include "signature" (e.g., signature.png)
                    </Text>
                  </>
                }
                rules={[{ required: true, message: 'Please upload a signature!' }]}
              >
                <Upload
                  {...uploadProps}
                  listType="picture"
                  name="signature"
                  onChange={handleSignatureChange}
                  fileList={signatureFile ? [signatureFile] : []}
                >
                  <Button
                    className="!bg-[#5B3418] hover:!bg-[#754726] border-none"
                    icon={<UploadOutlined />}
                  >
                    Upload Signature
                  </Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="stamp"
                label={
                  <>
                    <Text strong>Stamp (PNG/JPEG, Max 2MB)</Text>
                    <Text type="secondary" className="block">
                      File name should include "stamp" (e.g., stamp.png)
                    </Text>
                  </>
                }
                rules={[{ required: true, message: 'Please upload a stamp!' }]}
              >
                <Upload
                  {...uploadProps}
                  listType="picture"
                  name="stamp"
                  onChange={handleStampChange}
                  fileList={stampFile ? [stampFile] : []}
                >
                  <Button
                    className="!bg-[#5B3418] hover:!bg-[#754726] border-none"
                    icon={<UploadOutlined />}
                  >
                    Upload Stamp
                  </Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="!bg-[#5B3418] hover:!bg-[#754726] border-none"
                  onClick={() => console.log('Submit button clicked')}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;