import React, { useState } from "react";
import { Table, Button, Progress, Popconfirm, Space, Flex, ConfigProvider } from "antd/lib";
import Data from "./data.json";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState(Data.content || []);
  const pageSize = 10;
  const totalPages = Math.ceil(tableData.length / pageSize);

  const handleEdit = (record) => {
    console.log("Edit", record);
  };

  const handleDelete = (recordId) => {
    setTableData(prev => prev.filter(item => item.id !== recordId));
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
      render: (name) => `${name?.firstName ?? ""} ${name?.lastName ?? ""}`,
    },
    { title: "MBI", dataIndex: "mbi" },
    { title: "Gender", dataIndex: "gender" },
    { title: "DOB", dataIndex: "dob" },
    { title: "TIN Name", dataIndex: ["tinDto", "tinName"] },
    { title: "Practice Name", dataIndex: ["practiceDto", "practiceName"] },
    {
      title: "Coder 1 Allocated To",
      dataIndex: ["coder1AllocatedToUserNameDto", "nameDetail"],
      render: (name) => (name ? `${name.firstName} ${name.lastName}` : "-"),
    },
    { title: "Status", dataIndex: "processedStatus" },
    {
      title: "Progress",
      render: () => (
        <Progress percent={Math.floor(Math.random() * 50) + 50} size="small" />
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Flex vertical gap="middle">
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize,
          total: tableData.length,
          position: ["bottomCenter"],
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: false,
          itemRender: (page, type, originalElement) => {
            if (type === 'prev') return <span className="custom-pagination-btn">←</span>;
            if (type === 'next') return <span className="custom-pagination-btn">→</span>;
            return <span className="custom-pagination-number">{page}</span>;
          }
        }}
      />
    </Flex>
  );
};

export default App;
