"use client";

import React, { useState } from 'react';
import { Card, Row, Col, Typography, Space, Button, Tag, Avatar, message } from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';
import ReusableTable from '../components/table/index.js';

const { Title, Paragraph } = Typography;

export default function Home() {
  const [loading, setLoading] = useState(false);

  // Sample data for different table examples
  const usersData = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-01-15',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'Active',
      lastLogin: '2024-01-14',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Moderator',
      status: 'Inactive',
      lastLogin: '2024-01-10',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
    },
  ];

  // Users table columns
  const usersColumns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const color = role === 'Admin' ? 'red' : role === 'Moderator' ? 'blue' : 'green';
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Active' ? 'green' : status === 'Inactive' ? 'red' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
  ];

  // Custom actions for users table
  const userActions = [
    {
      key: 'view',
      label: 'View',
      icon: <EyeOutlined />,
      onClick: (record) => message.info(`Viewing user: ${record.name}`),
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: (record) => message.info(`Editing user: ${record.name}`),
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      confirm: {
        title: 'Delete User',
        description: `Are you sure you want to delete ${record.name}?`,
      },
      onClick: (record) => message.error(`Deleted user: ${record.name}`),
    },
  ];

  // Handle row selection
  const handleUserSelection = (selectedRowKeys, selectedRows) => {
    console.log('Selected users:', selectedRowKeys, selectedRows);
    message.info(`Selected ${selectedRowKeys.length} user(s)`);
  };

  // Handle row click
  const handleRowClick = (record) => {
    message.info(`Clicked on: ${record.name}`);
  };

  // Handle search
  const handleSearch = (searchText) => {
    console.log('Searching for:', searchText);
  };

  // Handle filter
  const handleFilter = () => {
    message.info('Filter functionality triggered');
  };

  // Simulate loading
  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Data refreshed!');
    }, 2000);
  };

  return (
    <div className="container-fluid p-4">
      <div className="row mb-4">
        <div className="col-12">
          <Title level={1} className="text-center">
            Reusable Ant Design Table Examples
          </Title>
          <Paragraph className="text-center text-muted">
            Comprehensive examples of the reusable table component with various configurations
          </Paragraph>
        </div>
      </div>

      {/* Users Table Example */}
      <div className="row mb-5">
        <div className="col-12">
          <Card 
            title="Users Management Table" 
            extra={
              <Space>
                <Button icon={<PlusOutlined />} type="primary">
                  Add User
                </Button>
                <Button icon={<DownloadOutlined />}>
                  Export
                </Button>
                <Button icon={<UploadOutlined />}>
                  Import
                </Button>
                <Button onClick={simulateLoading}>
                  Refresh
                </Button>
              </Space>
            }
          >
            <ReusableTable
              data={usersData}
              columns={usersColumns}
              loading={loading}
              rowKey="id"
              selectable={true}
              onRowSelect={handleUserSelection}
              onRowClick={handleRowClick}
              actions={userActions}
              searchable={true}
              onSearch={handleSearch}
              filterable={true}
              onFilter={handleFilter}
              pagination={true}
              pageSize={5}
              bordered={true}
              hoverable={true}
              size="middle"
            />
          </Card>
        </div>
      </div>

      {/* Features Documentation */}
      <div className="row">
        <div className="col-12">
          <Card title="Table Features">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" title="Basic Features">
                  <ul>
                    <li>Pagination with customizable page sizes</li>
                    <li>Search functionality</li>
                    <li>Row selection (single/multiple)</li>
                    <li>Sorting on columns</li>
                    <li>Loading states</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" title="Advanced Features">
                  <ul>
                    <li>Custom actions with confirmations</li>
                    <li>Expandable rows</li>
                    <li>Row click handlers</li>
                    <li>Custom styling options</li>
                    <li>Responsive design</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" title="Customization">
                  <ul>
                    <li>Custom column renderers</li>
                    <li>Flexible data sources</li>
                    <li>Configurable pagination</li>
                    <li>Custom CSS classes</li>
                    <li>Event handlers</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </div>
  );
}
