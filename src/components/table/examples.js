import React from 'react';
import { Card, Space, Tag, Avatar, Button, Rate, Progress } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

// Example data for different use cases
export const sampleUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-01-15',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
    department: 'Engineering',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '2024-01-14',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
    department: 'Marketing',
    joinDate: '2023-03-20',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Moderator',
    status: 'Inactive',
    lastLogin: '2024-01-10',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
    department: 'Sales',
    joinDate: '2023-02-10',
  },
];

export const sampleProducts = [
  {
    id: '1',
    name: 'Laptop Pro',
    category: 'Electronics',
    price: 1299.99,
    stock: 25,
    status: 'In Stock',
    rating: 4.5,
    description: 'High-performance laptop for professionals',
    sku: 'LP-001',
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    category: 'Accessories',
    price: 29.99,
    stock: 150,
    status: 'In Stock',
    rating: 4.2,
    description: 'Ergonomic wireless mouse',
    sku: 'WM-002',
  },
  {
    id: '3',
    name: 'Gaming Keyboard',
    category: 'Accessories',
    price: 89.99,
    stock: 0,
    status: 'Out of Stock',
    rating: 4.8,
    description: 'Mechanical gaming keyboard',
    sku: 'GK-003',
  },
];

export const sampleOrders = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customer: 'Alice Brown',
    product: 'Laptop Pro',
    quantity: 1,
    total: 1299.99,
    status: 'Completed',
    date: '2024-01-15',
    priority: 'High',
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customer: 'Charlie Wilson',
    product: 'Wireless Mouse',
    quantity: 2,
    total: 59.98,
    status: 'Processing',
    date: '2024-01-16',
    priority: 'Medium',
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customer: 'David Lee',
    product: 'Gaming Keyboard',
    quantity: 1,
    total: 89.99,
    status: 'Pending',
    date: '2024-01-17',
    priority: 'Low',
  },
];

// Column configurations for different table types
export const userColumns = [
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
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
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

export const productColumns = [
  {
    title: 'Product',
    dataIndex: 'name',
    key: 'name',
    render: (name, record) => (
      <div>
        <div style={{ fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>SKU: {record.sku}</div>
      </div>
    ),
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    render: (category) => <Tag>{category}</Tag>,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (price) => `$${price.toFixed(2)}`,
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
    key: 'stock',
    render: (stock) => (
      <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
        {stock} units
      </Tag>
    ),
    sorter: (a, b) => a.stock - b.stock,
  },
  {
    title: 'Rating',
    dataIndex: 'rating',
    key: 'rating',
    render: (rating) => <Rate disabled defaultValue={rating} />,
    sorter: (a, b) => a.rating - b.rating,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const color = status === 'In Stock' ? 'green' : status === 'Low Stock' ? 'orange' : 'red';
      return <Tag color={color}>{status}</Tag>;
    },
  },
];

export const orderColumns = [
  {
    title: 'Order #',
    dataIndex: 'orderNumber',
    key: 'orderNumber',
    render: (orderNumber) => (
      <Button type="link" size="small">
        {orderNumber}
      </Button>
    ),
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
  },
  {
    title: 'Product',
    dataIndex: 'product',
    key: 'product',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (quantity) => <Tag>{quantity}</Tag>,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: (total) => `$${total.toFixed(2)}`,
    sorter: (a, b) => a.total - b.total,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const color = status === 'Completed' ? 'green' : status === 'Processing' ? 'blue' : 'orange';
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    render: (priority) => {
      const color = priority === 'High' ? 'red' : priority === 'Medium' ? 'orange' : 'green';
      return <Tag color={color}>{priority}</Tag>;
    },
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    sorter: (a, b) => new Date(a.date) - new Date(b.date),
  },
];

// Action configurations
export const userActions = [
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
  {
    key: 'delete',
    label: 'Delete',
    icon: <DeleteOutlined />,
    danger: true,
    confirm: {
      title: 'Delete User',
      description: `Are you sure you want to delete ${record => record.name}?`,
    },
    onClick: (record) => console.log('Delete user:', record.name),
  },
];

export const productActions = [
  {
    key: 'edit',
    label: 'Edit',
    icon: <EditOutlined />,
    onClick: (record) => console.log('Edit product:', record.name),
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: <DeleteOutlined />,
    danger: true,
    onClick: (record) => console.log('Delete product:', record.name),
  },
];

// Expandable row renderer for orders
export const expandedOrderRow = (record) => (
  <Card size="small" title={`Order Details - ${record.orderNumber}`}>
    <Space direction="vertical" style={{ width: '100%' }}>
      <div><strong>Customer:</strong> {record.customer}</div>
      <div><strong>Product:</strong> {record.product}</div>
      <div><strong>Quantity:</strong> {record.quantity}</div>
      <div><strong>Total:</strong> ${record.total.toFixed(2)}</div>
      <div><strong>Date:</strong> {record.date}</div>
      <div><strong>Priority:</strong> {record.priority}</div>
    </Space>
  </Card>
);

// Table configuration presets
export const tablePresets = {
  basic: {
    pagination: true,
    pageSize: 10,
    bordered: false,
    hoverable: true,
  },
  detailed: {
    pagination: true,
    pageSize: 5,
    bordered: true,
    hoverable: true,
    striped: true,
    searchable: true,
    filterable: true,
  },
  compact: {
    pagination: false,
    bordered: false,
    hoverable: false,
    size: 'small',
  },
  selectable: {
    selectable: true,
    pagination: true,
    pageSize: 10,
    bordered: true,
    hoverable: true,
  },
  expandable: {
    expandable: true,
    pagination: true,
    pageSize: 10,
    bordered: true,
    hoverable: true,
  },
};
