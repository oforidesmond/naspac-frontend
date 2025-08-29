import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Typography,
  AutoComplete,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';

const { Option } = Select;
const { Text } = Typography;

interface University {
  name: string;
}

const programsStudied = [
  'Computer Science',
  'Business Administration',
  'Engineering',
  'Medicine',
  'Law',
  'Education',
  'Nursing',
  'Accounting',
  'Agriculture',
  'Economics',
];

const OnboardingForm: React.FC = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  // Fetch user data from JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // console.log('JWT Payload:', payload);
        form.setFieldsValue({
          nssNumber: payload.identifier,
          email: payload.email || '',
          phoneNumber: payload.phoneNumber || '',
        });
      } catch (error) {
        // console.error('Failed to decode JWT:', error);
        toast.error('Failed to load user data');
      }
    }
  }, [form]);

  // Fetch universities
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const apiBase = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${apiBase}/users/ghana-universities`, {
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setUniversities(data);
      } catch (error) {
        console.error('Failed to fetch universities:', error);
        toast.error('Failed to load universities');
      }
    };
    fetchUniversities();
  }, []);

  // Check onboarding status on page load
  useEffect(() => {
    const checkStatusOnLoad = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication token missing. Please log in again.');
          navigate('/login'); // Redirect to login if no token
          return;
        }
        const apiBase = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${apiBase}/users/onboarding-status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to check onboarding status');
        }
        if (data.hasSubmitted) {
          toast.error('Form already submitted.');
          navigate('/'); // Redirect to home if already submitted
        } else {
          setCanSubmit(true); // Allow submission only if no prior submission
        }
      } catch (error) {
        // console.error('Error checking onboarding status:', error);
        toast.error(
          'Failed to verify onboarding status. Submission is not allowed.'
        );
        setCanSubmit(false);
        navigate('/login');
      }
    };
    checkStatusOnLoad();
  }, [navigate]);

  // Restrict to PERSONNEL
  if (role !== 'PERSONNEL') {
    return (
      <div className="flex items-center justify-center h-full">
        <Text className="text-lg text-[#3C3939]">
          Access restricted to personnel users.
        </Text>
      </div>
    );
  }

  // Check onboarding status
  const checkOnboardingStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_BASE_URL;
      const response = await fetch(`${apiBase}/users/onboarding-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check onboarding status');
      }
      return data.hasSubmitted;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      toast.error('Failed to verify onboarding status. Please try again.');
      return false; // Allow submission if check fails to avoid blocking user
    }
  };

  const onFinish = async (values: any) => {
    const hasSubmitted = await checkOnboardingStatus();
    if (hasSubmitted) {
      toast.error('Already submitted.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('fullName', values.fullName);
    formData.append('nssNumber', values.nssNumber);
    formData.append('gender', values.gender);
    formData.append('email', values.email);
    formData.append('placeOfResidence', values.placeOfResidence);
    formData.append('phoneNumber', values.phoneNumber);
    formData.append('universityAttended', values.universityAttended);
    formData.append('regionOfSchool', values.regionOfSchool);
    formData.append('yearOfNss', values.yearOfNss);
    formData.append('programStudied', values.programStudied);
    formData.append('divisionPostedTo', values.divisionPostedTo);

    if (values.postingLetter) {
      formData.append('files', values.postingLetter, 'postingLetter');
    } else {
      console.log('No postingLetter file found');
    }
    if (values.appointmentLetter) {
      formData.append('files', values.appointmentLetter, 'appointmentLetter');
    } else {
      console.log('No appointmentLetter file found');
    }

    try {
      const apiBase = import.meta.env.VITE_BASE_URL;
      const response = await fetch(`${apiBase}/users/submit-onboarding`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Submitted successfully!');
        navigate('/');
      } else {
        console.error('Server response:', data);
        toast.error(data.message || 'Failed to submit');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-[#3C3939] mb-6 text-center">
          NSS Onboarding Form
        </h2>
        <Form
          form={form}
          name="onboarding-form"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[
              { required: true, message: 'Please input your full name!' },
            ]}
          >
            <Input className="rounded-md border-[#a9a7a7]" />
          </Form.Item>
          <Form.Item
            name="nssNumber"
            label="NSS Number"
            rules={[
              { required: true, message: 'Please input your NSS number!' },
            ]}
          >
            <Input className="rounded-md border-[#a9a7a7]" disabled />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please input a valid email!',
              },
            ]}
          >
            <Input className="rounded-md border-[#a9a7a7]" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select your gender!' }]}
          >
            <Select className="rounded-md">
              <Option value="MALE">Male</Option>
              <Option value="FEMALE">Female</Option>
              {/* <Option value="OTHER">Other</Option> */}
            </Select>
          </Form.Item>
          <Form.Item
            name="placeOfResidence"
            label="Place of Residence"
            rules={[
              {
                required: true,
                message: 'Please input your place of residence!',
              },
            ]}
          >
            <Input className="rounded-md border-[#a9a7a7]" />
          </Form.Item>
          {/* <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input className="rounded-md border-[#a9a7a7]" disabled/>
          </Form.Item> */}
          <Form.Item
            name="universityAttended"
            label="University Attended"
            rules={[
              {
                required: true,
                message: 'Please select or input your university!',
              },
            ]}
          >
            <AutoComplete
              className="rounded-md w-full"
              placeholder="Select or type university"
              options={universities.map((uni) => ({
                value: uni.name,
              }))}
              filterOption={(inputValue, option) =>
                option!.value.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            name="regionOfSchool"
            label="Region of School"
            rules={[
              { required: true, message: 'Please select or input the region!' },
            ]}
          >
            <AutoComplete
              className="rounded-md w-full"
              placeholder="Select or type region"
              options={[
                { value: 'ASHANTI' },
                { value: 'GREATER_ACCRA' },
                { value: 'CENTRAL' },
                { value: 'WESTERN' },
                { value: 'EASTERN' },
                { value: 'NORTHERN' },
                { value: 'VOLTA' },
                { value: 'UPPER_EAST' },
                { value: 'UPPER_WEST' },
                { value: 'BONO' },
                { value: 'BONO_EAST' },
                { value: 'AHAFO' },
                { value: 'NORTH_EAST' },
                { value: 'OTI' },
                { value: 'SAVANNAH' },
                { value: 'WESTERN_NORTH' },
              ]}
              filterOption={(inputValue, option) =>
                option!.value.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            name="yearOfNss"
            label="Year of NSS"
            initialValue={new Date().getFullYear()}
            rules={[{ required: true, message: 'Please input the NSS year!' }]}
          >
            <Input
              type="number"
              disabled
              className="rounded-md border-[#a9a7a7]"
            />
          </Form.Item>
          <Form.Item
            name="programStudied"
            label="Program Studied"
            rules={[
              {
                required: true,
                message: 'Please select or input your program studied!',
              },
            ]}
          >
            <AutoComplete
              className="rounded-md w-full"
              placeholder="Select or type program"
              options={programsStudied.map((program) => ({
                value: program,
              }))}
              filterOption={(inputValue, option) =>
                option!.value.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            name="divisionPostedTo"
            label="Division Posted To"
            rules={[
              {
                required: true,
                message: 'Please input your division posted to!',
              },
            ]}
          >
            <Input className="rounded-md border-[#a9a7a7]" />
          </Form.Item>
          <div className="flex space-x-4">
            <Form.Item
              name="postingLetter"
              label="Posting Letter (PDF)"
              valuePropName="file"
              getValueFromEvent={(e) => e?.file}
              rules={[
                {
                  required: true,
                  message: 'Please upload your posting letter!',
                },
              ]}
              className="flex-1"
            >
              <Upload
                accept=".pdf"
                beforeUpload={() => false}
                maxCount={1}
                className="rounded-md w-full"
              >
                <Button
                  icon={<UploadOutlined />}
                  className="!border-[#6b3e1d] !bg-[#ffffff] !text-[#5B3418] hover:!bg-[#6b3e1d] hover:!text-white w-full"
                >
                  Upload Posting Letter
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="appointmentLetter"
              label="Appointment Letter (PDF)"
              valuePropName="file"
              getValueFromEvent={(e) => e?.file}
              rules={[
                {
                  required: true,
                  message: 'Please upload your appointment letter!',
                },
              ]}
              className="flex-1"
            >
              <Upload
                accept=".pdf"
                beforeUpload={() => false}
                maxCount={1}
                className="rounded-md w-full"
              >
                <Button
                  icon={<UploadOutlined />}
                  className="!border-[#6b3e1d] !bg-[#ffffff] !text-[#5B3418] hover:!bg-[#6b3e1d] hover:!text-white w-full"
                >
                  Upload Appointment Letter
                </Button>
              </Upload>
            </Form.Item>
          </div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={!canSubmit}
              className="w-full !bg-[#5B3418] hover:!bg-[#6b3e1d]"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default OnboardingForm;
