import React from 'react';
import { Card, Space, Button, Tag, Avatar, Rate } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import ReusableTable from './index.js';

// Example 1: Basic Table
export const BasicTableExample = () => {
  const data = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
  ];

  return (
    <Card title="Basic Table Example">
      <ReusableTable
        data={data}
        columns={columns}
        rowKey="id"
      />
    </Card>
  );
};

// Example 2: Table with Actions
export const ActionsTableExample = () => {
  const data = [
    { id: '1', name: 'Product A', price: 29.99, category: 'Electronics' },
    { id: '2', name: 'Product B', price: 49.99, category: 'Clothing' },
    { id: '3', name: 'Product C', price: 19.99, category: 'Books' },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `$${price}` },
    { title: 'Category', dataIndex: 'category', key: 'category' },
  ];

  const actions = [
    {
      key: 'view',
      label: 'View',
      icon: <EyeOutlined />,
      onClick: (record) => console.log('View:', record.name),
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: (record) => console.log('Edit:', record.name),
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      confirm: {
        title: 'Delete Product',
        description: `Are you sure you want to delete ${record => record.name}?`,
      },
      onClick: (record) => console.log('Delete:', record.name),
    },
  ];

  return (
    <Card title="Table with Actions Example">
      <ReusableTable
        data={data}
        columns={columns}
        rowKey="id"
        actions={actions}
        selectable={true}
        searchable={true}
      />
    </Card>
  );
};

// Example 3: Advanced Table with Custom Renderers
export const AdvancedTableExample = () => {
  const data = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      rating: 4.5,
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'Inactive',
      rating: 4.2,
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
    },
  ];

  const columns = [
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
        const color = role === 'Admin' ? 'red' : 'green';
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Active' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
  ];

  const actions = [
    {
      key: 'view',
      label: 'View',
      icon: <EyeOutlined />,
      onClick: (record) => console.log('View user:', record.name),
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: (record) => console.log('Edit user:', record.name),
    },
  ];

  return (
    <Card title="Advanced Table Example">
      <ReusableTable
        data={data}
        columns={columns}
        rowKey="id"
        actions={actions}
        selectable={true}
        searchable={true}
        filterable={true}
        bordered={true}
        striped={true}
        hoverable={true}
        pagination={true}
        pageSize={5}
      />
    </Card>
  );
};

// Example 4: Compact Table
export const CompactTableExample = () => {
  const data = [
    { id: '1', name: 'Item 1', value: 100 },
    { id: '2', name: 'Item 2', value: 200 },
    { id: '3', name: 'Item 3', value: 300 },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Value', dataIndex: 'value', key: 'value', render: (value) => `$${value}` },
  ];

  return (
    <Card title="Compact Table Example">
      <ReusableTable
        data={data}
        columns={columns}
        rowKey="id"
        pagination={false}
        size="small"
        bordered={false}
        hoverable={false}
      />
    </Card>
  );
};

// Example 5: Table with Expandable Rows
export const ExpandableTableExample = () => {
  const data = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      customer: 'John Doe',
      total: 299.99,
      status: 'Completed',
      details: {
        items: ['Laptop', 'Mouse'],
        shipping: 'Express',
        notes: 'Handle with care',
      },
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customer: 'Jane Smith',
      total: 149.99,
      status: 'Processing',
      details: {
        items: ['Keyboard', 'Monitor'],
        shipping: 'Standard',
        notes: 'Fragile items',
      },
    },
  ];

  const columns = [
    { title: 'Order #', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (total) => `$${total}` },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Completed' ? 'green' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const expandedRowRender = (record) => (
    <div style={{ padding: '16px', background: '#f5f5f5' }}>
      <h4>Order Details</h4>
      <p><strong>Items:</strong> {record.details.items.join(', ')}</p>
      <p><strong>Shipping:</strong> {record.details.shipping}</p>
      <p><strong>Notes:</strong> {record.details.notes}</p>
    </div>
  );

  return (
    <Card title="Expandable Table Example">
      <ReusableTable
        data={data}
        columns={columns}
        rowKey="id"
        expandable={true}
        expandedRowRender={expandedRowRender}
        pagination={false}
        bordered={true}
      />
    </Card>
  );
};

// Main component that shows all examples
export const AllTableExamples = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1>Reusable Table Component Examples</h1>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <BasicTableExample />
        <ActionsTableExample />
        <AdvancedTableExample />
        <CompactTableExample />
        <ExpandableTableExample />
      </Space>
    </div>
  );
};

export default AllTableExamples;
