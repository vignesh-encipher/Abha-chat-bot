import React from 'react';
import { Card } from 'antd';
import ReusableTable from './index.js';

// Simple test data
const testData = [
  { id: '1', name: 'Test User 1', email: 'test1@example.com' },
  { id: '2', name: 'Test User 2', email: 'test2@example.com' },
];

const testColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
];

const TestTable = () => {
  return (
    <Card title="Test Table Component">
      <ReusableTable
        data={testData}
        columns={testColumns}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
};

export default TestTable;
