import React from 'react';
import { Card, Avatar, Tag, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ReusableTable from '../table/index.js';
import './style.css';

const Table = ({
  patientsData,
  loading,
  currentPage,
  pageSize,
  totalPatients,
  onPaginationChange,
  onChatClick
}) => {
  console.log(patientsData,"patientsData")
  const patientsColumns = [
    {
      title: 'Profile',
      dataIndex: 'PATIENT_ID',
      key: 'PATIENT_ID',
      width: 80,
      render: (mrnNo, record) => (
        <div className="profile-cell">
          <Avatar 
            size={40} 
            icon={<UserOutlined />}
            className="patient-avatar"
          />
        </div>
      ),
    },
    {
      title: 'PATIENT NAME',
      dataIndex: 'PATIENT_NAME',
      key: 'PATIENT_NAME',
      render: (mrnNo) => (
        <div className="mrn-cell">
          {mrnNo || 'N/A'}
        </div>
      ),
    },
    {
      title: 'GENDER',
      dataIndex: 'GENDER',
      key: 'GENDER',
      render: (admNo) => (
        <div className="adm-cell">
          {admNo || 'N/A'}
        </div>
      ),
    },
    {
      title: 'AGE',
      dataIndex: 'AGE',
      key: 'AGE',
      render: (docCode) => (
        <Tag color="blue" className="doctor-tag">
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
          className="chat-button"
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
            `${record.PATIENT_ID}-${record.PATIENT_NAME}`
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
