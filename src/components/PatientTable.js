import React from 'react';
import { Card, Avatar, Tag, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ReusableTable from './table/index.js';

const Table = ({
  patientsData,
  loading,
  currentPage,
  pageSize,
  totalPatients,
  onPaginationChange,
  onChatClick
}) => {
  const patientsColumns = [
    {
      title: 'Profile',
      dataIndex: 'mrnNo',
      key: 'profile',
      width: 80,
      render: (mrnNo, record) => (
        <div style={{ textAlign: 'center' }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </div>
      ),
    },
    {
      title: 'MRN No',
      dataIndex: 'mrnNo',
      key: 'mrnNo',
      render: (mrnNo) => (
        <div style={{ fontWeight: 500 }}>
          {mrnNo || 'N/A'}
        </div>
      ),
    },
    {
      title: 'Admission No',
      dataIndex: 'admNo',
      key: 'admNo',
      render: (admNo) => (
        <div style={{ fontWeight: 500 }}>
          {admNo || 'N/A'}
        </div>
      ),
    },
    {
      title: 'Doctor Code',
      dataIndex: 'docCode',
      key: 'docCode',
      render: (docCode) => (
        <Tag color="blue">
          {docCode || 'N/A'}
        </Tag>
      ),
    },
    {
      title: "Chat Bot",
      key: "chatBot",
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small"
          onClick={() => onChatClick(record)}
        >
          Chat
        </Button>
      ),
    }
  ];

  return (
    <div className="table-container">
      <Card className="table-card">
        <ReusableTable
          data={patientsData}
          columns={patientsColumns}
          rowKey={(record) =>
            `${record.mrnNo}-${record.admNo}-${record.docCode}`
          }
          loading={loading}
          selectable={false}
          searchable={false}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalPatients,
            onChange: onPaginationChange,
            showSizeChanger: false,
            showTotal: (total, range) => {
              return `${range[0]}-${range[1]} of ${total} patients`;
            },
          }}
          totalText="patients"
          striped={true}
          hoverable={true}
          size="small"
          style={{
            "--ant-table-row-height": "25px",
          }}
          className="compact-table"
        />
      </Card>
    </div>
  );
};

export default Table;
