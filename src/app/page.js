"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Tag,
  Avatar,
  message,
  Drawer,
  Input,
  List,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  SendOutlined,
  RobotOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

// Import the table component
import ReusableTable from "../components/table/index.js";
// Import the API utility
import { requestPortal } from "../utils/index.js";

const { Title, Paragraph } = Typography;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [chatDrawerVisible, setChatDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [patientsData, setPatientsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const chatContainerRef = useRef(null);

  // Function to scroll to bottom of chat
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  // Cleanup streaming on unmount
  useEffect(() => {
    return () => {
      setStreamingMessageId(null);
    };
  }, []);

  // Function to stream text like ChatGPT
  const streamText = useCallback(
    (messageId, fullText, onComplete) => {
      setStreamingMessageId(messageId);
      let currentIndex = 0;
      const words = fullText.split(" ");
      let currentText = "";

      const streamInterval = setInterval(() => {
        if (currentIndex < words.length) {
          currentText += (currentIndex > 0 ? " " : "") + words[currentIndex];
          currentIndex++;

          // Update the message with current text
          setChatMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, message: currentText } : msg
            )
          );

          // Scroll to bottom during streaming
          setTimeout(() => {
            scrollToBottom();
          }, 50);
        } else {
          clearInterval(streamInterval);
          setStreamingMessageId(null);
          if (onComplete) onComplete();
        }
      }, 10); // Adjust speed here (lower = faster)

      return streamInterval;
    },
    [scrollToBottom]
  );

  const fetchPatients = async (start, end) => {
    setLoading(true);
    try {
      const url = `/api/patient-list?start=${start}&end=${end}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      if (data && data.response) {
        // Handle both array and single object responses
        const patientsArray = data.response.admissionPatientList;
        setPatientsData(patientsArray);

        // Set total count and calculate total pages
        const totalRecords = data.response.totalNoOfRecord;
        setPageSize(20);
        setTotalPatients(totalRecords);
        setTotalPages(Math.ceil(totalRecords / 30));
      }
    } catch (error) {
      console.error("Error fetching patients:", error);

      // More specific error messages
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        message.error(
          "Network error: Unable to connect to the server. Please check your internet connection and try again."
        );
      } else if (error.message.includes("CORS")) {
        message.error(
          "CORS error: The server is not allowing requests from this domain."
        );
      } else if (error.message.includes("HTTP error")) {
        message.error(`Server error: ${error.message}`);
      } else {
        message.error(`Failed to fetch patient data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPatients(1, 20);
  }, []);

  const patientsColumns = [
    {
      title: "Profile",
      dataIndex: "mrnNo",
      key: "profile",
      width: 80,
      render: (mrnNo, record) => (
        <div style={{ textAlign: "center" }}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{
              backgroundColor: "#1890ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>
      ),
    },
    {
      title: "MRN No",
      dataIndex: "mrnNo",
      key: "mrnNo",
      render: (mrnNo) => (
        <div style={{ fontWeight: 500 }}>{mrnNo || "N/A"}</div>
      ),
    },
    {
      title: "Admission No",
      dataIndex: "admNo",
      key: "admNo",
      render: (admNo) => (
        <div style={{ fontWeight: 500 }}>{admNo || "N/A"}</div>
      ),
    },
    {
      title: "Doctor Code",
      dataIndex: "docCode",
      key: "docCode",
      render: (docCode) => <Tag color="blue">{docCode || "N/A"}</Tag>,
    },
    {
      title: "Chat Bot",
      key: "chatBot",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleChatClick(record)}
        >
          Chat
        </Button>
      ),
    },
  ];

  // Custom actions for patients table
  const handleProductSelection = (selectedRowKeys, selectedRows) => {
    console.log("Selected patients:", selectedRowKeys, selectedRows);
    message.info(`Selected ${selectedRowKeys.length} patient(s)`);
  };

  // Handle search
  const handleSearch = (searchText) => {
    console.log("Searching for:", searchText);
  };

  // Handle pagination
  const handlePaginationChange = (page, size) => {
    console.log(`Page changed to: ${page}, Size: ${size}`);
    setCurrentPage(page);
    // if (size !== pageSize) {
    //   setPageSize(size);
    // }
    const start = (page - 1) * 20 + 1;
    const end = page * 20;
    fetchPatients(start, end);
  };

  // Handle chat button click
  const handleChatClick = (record) => {
    setSelectedProduct(record);
    setChatMessages([
      {
        id: 1,
        type: "bot",
        message: record.htmlContent,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setChatDrawerVisible(true);
  };

  // Handle sending a message
  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim()) {
      const currentMessage = inputMessage;
      const currentTime = new Date().toLocaleTimeString();

      const newMessage = {
        id: Date.now(), // Use timestamp for unique ID
        type: "user",
        message: currentMessage,
        timestamp: currentTime,
      };

      setChatMessages((prev) => [...prev, newMessage]);
      setInputMessage("");

      // Show loading state
      setIsBotTyping(true);

      // Add loading message
      const loadingMessage = {
        id: "loading-" + Date.now(),
        type: "bot",
        message: "Typing",
        timestamp: new Date().toLocaleTimeString(),
        isLoading: true,
      };
      setChatMessages((prev) => [...prev, loadingMessage]);

      // Ensure scroll to bottom after adding messages
      setTimeout(() => {
        scrollToBottom();
      }, 100);

      // Get bot response from API
      setTimeout(async () => {
        try {
          const response = await fetch(
            `/api/chat?prompt=${encodeURIComponent(currentMessage)}&mrNo=${
              selectedProduct?.mrnNo
            }`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Chat response:", data);

          // Remove loading message and add bot response
          setChatMessages((prev) => {
            const filteredMessages = prev.filter(
              (msg) => msg.id !== loadingMessage.id
            );
            const botResponse = {
              id: Date.now() + 1,
              type: "bot",
              message:
                data.response.response ||
                data.message ||
                `I understand you're asking about "${currentMessage}". Let me help you with that regarding ${
                  selectedProduct?.mrnNo || "this patient"
                }.`,
              timestamp: new Date().toLocaleTimeString(),
              base64: data.response.base64,
            };
            return [...filteredMessages, botResponse];
          });

          // Ensure scroll to bottom after bot response
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        } catch (error) {
          console.error("Error sending message:", error);
          message.error("Failed to send message to AI assistant");

          // Remove loading message and add fallback response
          setChatMessages((prev) => {
            const filteredMessages = prev.filter(
              (msg) => msg.id !== loadingMessage.id
            );
            const botResponse = {
              id: Date.now() + 1,
              type: "bot",
              message: "", // Start with empty message for streaming
              timestamp: new Date().toLocaleTimeString(),
            };
            return [...filteredMessages, botResponse];
          });

          // Ensure scroll to bottom after error response
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        } finally {
          setIsBotTyping(false);
        }
      }, 1000);
    }
  }, [inputMessage, selectedProduct]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setInputMessage(e.target.value);
  }, []);

  // Handle drawer close
  const handleDrawerClose = useCallback(() => {
    setChatDrawerVisible(false);
    setSelectedProduct(null);
    setChatMessages([]);
    setInputMessage("");
  }, []);

  return (
    <div className="fixed-page-container">
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
            onRowSelect={handleProductSelection}
            // actions={patientActions}
            searchable={false}
            onSearch={handleSearch}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalPatients,
              onChange: handlePaginationChange,
              // onShowSizeChange: handlePaginationChange,
              showSizeChanger: false,
              // showQuickJumper: true,
              showTotal: (total, range) => {
                // console.log('Pagination showTotal - total:', total, 'range:', range);
                return `${range[0]}-${range[1]} of ${total} patients`;
              },
              // pageSizeOptions: ['30', '50', '100'],
              // showLessItems: true
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

      {/* Chat Bot Drawer */}
      <Drawer
        title={
          <Space>
            <RobotOutlined />
            <span>AI Assistent</span>
          </Space>
        }
        placement="right"
        width="50%"
        // onClose={handleDrawerClose}
        closable={false}
        open={chatDrawerVisible}
        extra={
          <Button type="text" onClick={handleDrawerClose}>
            Close
          </Button>
        }
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "#FFF",
            position: "relative",
          }}
        >
          {/* Chat Messages Container */}
          <div
            ref={chatContainerRef}
            className="chat-container"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
            }}
          >
            <List
              dataSource={chatMessages}
              renderItem={(item, index) => (
                <List.Item style={{ border: "none", padding: "12px 0" }}>
                  <div
                    className="modern-chat-message"
                    style={{
                      display: "flex",
                      justifyContent:
                        item.type === "user" ? "flex-end" : "flex-start",
                      width: "100%",
                      alignItems: "flex-start",
                      gap: "12px",
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {item.type === "bot" && (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "18px",
                          marginTop: "4px",
                          boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
                          border: "2px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        <UserOutlined />
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: "75%",
                        height: "100%",
                        padding: "16px 20px",
                        borderRadius:
                          item.type === "user"
                            ? "24px 8px 24px 24px"
                            : "8px 24px 24px 24px",
                        background:
                          item.type === "user"
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "rgba(255,255,255,0.95)",
                        color: item.type === "user" ? "white" : "#333",
                        wordWrap: "break-word",
                        boxShadow:
                          item.type === "user"
                            ? "0 8px 32px rgba(102, 126, 234, 0.3)"
                            : "0 4px 16px rgba(0,0,0,0.1)",
                        border:
                          item.type === "bot"
                            ? "1px solid rgba(255,255,255,0.2)"
                            : "none",
                        // backdropFilter: 'blur(10px)',
                        position: "relative",
                      }}
                    >
                      {item.isLoading ? (
                        <div className="typing-indicator">
                          <span>Thinking</span>
                          <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: "14px",
                            lineHeight: "1.6",
                            fontWeight: "400",
                            color: item.type === "user" ? "white" : "#333",
                          }}
                          className="patient-html-content content-font"
                        >
                          <div
                            dangerouslySetInnerHTML={{ __html: item.message }}
                          />
                          {streamingMessageId === item.id && (
                            <span className="streaming-cursor">|</span>
                          )}
                          {item.base64 && item.type === "bot" && (
                            <div
                              style={{
                                marginTop: "10px",
                                padding: "10px",
                                backgroundColor: "rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.2)",
                              }}
                            >
                              <img
                                src={`${item.base64}`}
                                alt="Chart"
                                style={{
                                  maxWidth: "100%",
                                  height: "auto",
                                  borderRadius: "4px",
                                }}
                                onLoad={() =>
                                  console.log("Chart image loaded successfully")
                                }
                                onError={(e) =>
                                  console.log("Chart image failed to load:", e)
                                }
                              />
                            </div>
                          )}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: "11px",
                          opacity: 0.7,
                          marginTop: "8px",
                          textAlign: item.type === "user" ? "right" : "left",
                          fontWeight: "300",
                        }}
                      >
                        {item.timestamp}
                      </div>
                    </div>
                    {item.type === "user" && (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          background:
                            "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "18px",
                          marginTop: "4px",
                          boxShadow: "0 4px 16px rgba(240, 147, 251, 0.3)",
                          border: "2px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        <UserOutlined />
                      </div>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </div>

          {/* Modern Input Area */}
          <div
            style={{
              padding: "20px",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderTop: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                background: "rgba(255,255,255,0.95)",
                borderRadius: "25px",
                padding: "8px 8px 8px 20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={handleInputChange}
                onPressEnter={handleSendMessage}
                style={{
                  flex: 1,
                  border: "none",
                  boxShadow: "none",
                  fontSize: "15px",
                  background: "transparent",
                }}
                variant="borderless"
              />
              <Button
                type="primary"
                icon={isBotTyping ? <LoadingOutlined /> : <SendOutlined />}
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isBotTyping}
                className="modern-send-button"
                style={{
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    inputMessage.trim() && !isBotTyping
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "#d9d9d9",
                  border: "none",
                  boxShadow:
                    inputMessage.trim() && !isBotTyping
                      ? "0 4px 16px rgba(102, 126, 234, 0.3)"
                      : "none",
                }}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
