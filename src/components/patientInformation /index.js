import React, { useState, useCallback, useEffect, useRef } from "react";
import { message, Layout, Typography, Button, Menu, Breadcrumb, Avatar, Dropdown, Space, Badge } from "antd";
import {
  MessageOutlined,
  DashboardOutlined,
  TableOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import Table from "../PatientTable";
import Chat from "../Chat";
import { actions } from "../../store/table";
import "./style.css";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;
const Dashboard = ({
  tableData,
  fetchPatients,
  tableDataChat,
  chatResponse,
}) => {
  const { loading, data } = tableData;
  const { dataChat, errorChat } = tableDataChat;

  // State management
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState(["1"]);
  const [chatDrawerVisible, setChatDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [patientsData, setPatientsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
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

  const handleFetchPatients = useCallback(
    (start, end) => {
      try {
        fetchPatients(start, end);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    },
    [fetchPatients]
  );

  useEffect(() => {
    if (data && data.patients) {
      const patientsArray = data.patients;
      setPatientsData(patientsArray);
      const totalRecords = 50;
      setPageSize(16);
      setTotalPatients(totalRecords);
    }
  }, [data]);

  useEffect(() => {
    if (dataChat && dataChat.response) {
      setChatMessages((prev) => {
        const filteredMessages = prev.filter((msg) => !msg.isLoading);
        const botResponse = {
          id: Date.now() + 1,
          type: "bot",
          message:
            dataChat.response.response ||
            dataChat.message ||
            `I understand your question. Let me help you with that regarding ${
              selectedProduct?.mrnNo || "this patient"
            }.`,
          timestamp: new Date().toLocaleTimeString(),
          base64: dataChat.response.base64,
        };
        return [...filteredMessages, botResponse];
      });

      setTimeout(() => {
        scrollToBottom();
      }, 100);
      setIsBotTyping(false);
    }
  }, [dataChat, selectedProduct, scrollToBottom]);

  useEffect(() => {
    if (errorChat) {
      console.error("Chat error:", errorChat);
      message.error("Failed to send message to AI assistant");

      setChatMessages((prev) => {
        const filteredMessages = prev.filter((msg) => !msg.isLoading);
        const botResponse = {
          id: Date.now() + 1,
          type: "bot",
          message: `I understand your question. Let me help you with that regarding ${
            selectedProduct?.mrnNo || "this patient"
          }.`,
          timestamp: new Date().toLocaleTimeString(),
        };
        return [...filteredMessages, botResponse];
      });

      setTimeout(() => {
        scrollToBottom();
      }, 100);
      setIsBotTyping(false);
    }
  }, [errorChat, selectedProduct, scrollToBottom]);

  React.useEffect(() => {
    handleFetchPatients(1, 18);
  }, [handleFetchPatients]);

  const handlePaginationChange = (page, size) => {
    console.log(`Page changed to: ${page}, Size: ${size}`);
    setCurrentPage(page);
    const start = (page - 1) * 18 + 1;
    const end = page * 18;
    fetchPatients(start, end);
  };
  const handleChatClick = (record) => {
    setSelectedProduct(record);
    setChatMessages([
      {
        id: 1,
        type: "bot",
        message: `Hello! I'm here to assist you. What would you like to do?`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setChatDrawerVisible(true);
  };
  const createUserMessage = (message, timestamp) => ({
    id: Date.now(),
    type: "user",
    message,
    timestamp,
  });

  const createLoadingMessage = () => ({
    id: "loading-" + Date.now(),
    type: "bot",
    message:
      "🔄 Processing your request... This may take up to 30 seconds for complex queries.",
    timestamp: new Date().toLocaleTimeString(),
    isLoading: true,
  });
  const createErrorMessage = (errorType) => {
    const errorMessages = {
      SERVER_ERROR:
        "I'm having trouble processing your request right now. Please try again in a moment.",
      TIMEOUT_ERROR:
        "⏱️ Your request is taking longer than expected (30+ seconds). The external service might be slow. Please try again with a simpler question or wait a moment and retry.",
      SERVICE_UNAVAILABLE:
        "🔌 The external analytics service is currently unavailable. This might be due to network issues or the service being down. Please try again in a few minutes or contact support if the issue persists.",
      BAD_REQUEST:
        "I couldn't understand your question. Please try rephrasing it or ask something more specific.",
      DEFAULT:
        "I'm currently experiencing some technical difficulties. Please try asking your question again in a moment.",
    };

    return {
      id: Date.now() + 1,
      type: "bot",
      message: errorMessages[errorType] || errorMessages.DEFAULT,
      timestamp: new Date().toLocaleTimeString(),
    };
  };
  const createSQLResponse = (data, originalMessage) => {
    let botMessage = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
        📊 Analysis for: "${originalMessage}"
      </h3>`;
    const responseData = data;
    if (responseData?.data?.df) {
      const dfData = JSON.parse(responseData.data.df);

      const tableHtml = `
        <div style="margin: 15px 0;">
          <h4 style="color: #555; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">📋 Results</h4>
          <div style="overflow-x: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; background: white;">
              <thead>
                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                  ${Object.keys(dfData[0] || {})
                    .map(
                      (key) =>
                        `<th style="border: none; padding: 15px 12px; text-align: left; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">${key}</th>`
                    )
                    .join("")}
                </tr>
              </thead>
              <tbody>
                ${dfData
                  .map(
                    (row, index) =>
                      `<tr style="background-color: ${
                        index % 2 === 0 ? "#fafafa" : "white"
                      }; transition: background-color 0.2s;">
                  ${Object.values(row)
                    .map(
                      (value, cellIndex) =>
                        `<td style="border: none; padding: 12px; border-bottom: 1px solid #eee; color: #333; ${
                          cellIndex > 0
                            ? "text-align: right; font-weight: 500;"
                            : "text-align: left;"
                        }">${
                          value && value.toLocaleString
                            ? value.toLocaleString()
                            : value || "N/A"
                        }</td>`
                    )
                    .join("")}
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
      botMessage += tableHtml;
    }

    if (responseData?.summary) {
      botMessage += `
        <div style="margin: 15px 0; padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px; color: white;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">📝 Summary</h4>
          <p style="margin: 0; font-size: 13px; line-height: 1.5; opacity: 0.95;">${responseData.summary}</p>
        </div>
      `;
    }

    botMessage += `</div>`;

    return {
      id: Date.now() + 1,
      type: "bot",
      message: botMessage,
      timestamp: new Date().toLocaleTimeString(),
      sqlData: responseData,
      chartData: responseData?.visualization,
      shouldGenerateChart: responseData?.shouldGenerateChart,
    };
  };

  const updateMessagesWithResponse = (loadingMessageId, response) => {
    setChatMessages((prev) => {
      const filteredMessages = prev.filter(
        (msg) => msg.id !== loadingMessageId
      );
      return [...filteredMessages, response];
    });
  };

  const handleSQLAnalytics = useCallback(async (message, mrnNo) => {
    try {
      const payload = {
        query: message + ` for ${mrnNo}`,
      };
      try {
        const response = await chatResponse({ payload });
        return response;
      } catch {
        throw new Error("TIMEOUT_ERROR");
      }
    } catch (apiError) {
      console.error("API Error in SQL Analytics:", apiError);
      if (apiError.name === "AbortError") {
        console.error("Request was aborted due to timeout");
        throw new Error("TIMEOUT_ERROR");
      }
      if (
        apiError.message === "Failed to fetch" ||
        apiError.message.includes("fetch failed") ||
        apiError.message.includes("SocketError") 
      ) {
        console.error("Network connection failed");
        throw new Error("SERVICE_UNAVAILABLE");
      }
      if (apiError.status) {
        if (apiError.status >= 500) {
          throw new Error("SERVER_ERROR");
        } else if (apiError.status === 408) {
          throw new Error("TIMEOUT_ERROR");
        } else if (apiError.status >= 500) {
          throw new Error("SERVICE_UNAVAILABLE");
        } else {
          throw new Error("SERVER_ERROR");
        }
      }

      throw apiError;
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    const currentMessage = inputMessage.trim();
    const currentTime = new Date().toLocaleTimeString();
    const mrnNo = selectedProduct?.PATIENT_ID;
    const userMessage = createUserMessage(currentMessage, currentTime);
    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsBotTyping(true);
    const loadingMessage = createLoadingMessage();
    setChatMessages((prev) => [...prev, loadingMessage]);
    setTimeout(scrollToBottom, 100);

    try {
      const chatdata = await handleSQLAnalytics(currentMessage, mrnNo);
      if (chatdata) {
        if (chatdata.error) {
          const errorResponse = createErrorMessage("DEFAULT", currentMessage);
          updateMessagesWithResponse(loadingMessage.id, errorResponse);
          return;
        }

        if (chatdata) {
          const botResponse = createSQLResponse(chatdata, currentMessage);
          updateMessagesWithResponse(loadingMessage.id, botResponse);
        } else {
          const errorResponse = createErrorMessage("DEFAULT", currentMessage);
          updateMessagesWithResponse(loadingMessage.id, errorResponse);
        }
      } else {
        setIsBotTyping(false);
        return;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorResponse = createErrorMessage(error.message, currentMessage);
      updateMessagesWithResponse(loadingMessage.id, errorResponse);
    } finally {
      setIsBotTyping(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [inputMessage, selectedProduct, scrollToBottom, handleSQLAnalytics]);

  const handleInputChange = useCallback((e) => {
    setInputMessage(e.target.value);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setChatDrawerVisible(false);
    setSelectedProduct(null);
    setChatMessages([]);
    setInputMessage("");
  }, []);

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
  ];

  const handleMenuClick = ({ key }) => {
    setSelectedMenuKey([key]);
  };

  return (
    <Layout className="dashboard-layout" style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="dashboard-sider"
        width={250}
      >
        <div className="logo-container">
          <Title level={4} className="logo-title">
            {collapsed ? "AB" : "ABHA"}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedMenuKey}
          items={menuItems}
          onClick={handleMenuClick}
          className="dashboard-menu"
        />
      </Sider>
      <Layout>
        <Header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <Breadcrumb
                items={[
                  {
                    title: (
                      <span>
                        <HomeOutlined /> Home
                      </span>
                    ),
                  },
                  {
                    title: "Dashboard",
                  },
                  {
                    title: "Patient Analytics",
                  },
                ]}
                className="header-breadcrumb"
              />
              <div className="header-title-section">
                <Title level={3} className="dashboard-title">
                  Patient Data Analytics Dashboard
                </Title>
              </div>
            </div>
            <div className="header-right">
              <Space size="middle" className="header-actions">
                <Button
                  type="primary"
                  icon={<MessageOutlined />}
                  onClick={() => setChatDrawerVisible(true)}
                  className="chat-button"
                >
                  Chat Assistant
                </Button>
                <Badge count={0} showZero={false}>
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    className="notification-button"
                  />
                </Badge>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "1",
                        label: "Profile",
                        icon: <UserOutlined />,
                      },
                      {
                        key: "2",
                        label: "Settings",
                        icon: <SettingOutlined />,
                      },
                      {
                        type: "divider",
                      },
                      {
                        key: "3",
                        label: "Logout",
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Space className="user-profile">
                    <Avatar size="default" icon={<UserOutlined />} />
                    <Text className="user-name">Admin User</Text>
                  </Space>
                </Dropdown>
              </Space>
            </div>
          </div>
        </Header>
        <Content className="dashboard-content">
          <div className="content-wrapper">
            <Table
              patientsData={patientsData}
              loading={loading}
              currentPage={currentPage}
              pageSize={pageSize}
              totalPatients={totalPatients}
              onPaginationChange={handlePaginationChange}
              onChatClick={handleChatClick}
            />
          </div>
        </Content>
        <Footer className="dashboard-footer">
          ABHA Dashboard ©2025 - Patient Data Analytics
        </Footer>
      </Layout>

      <Chat
        visible={chatDrawerVisible}
        onClose={handleDrawerClose}
        chatMessages={chatMessages}
        inputMessage={inputMessage}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
        isBotTyping={isBotTyping}
        streamingMessageId={streamingMessageId}
        chatContainerRef={chatContainerRef}
      />
    </Layout>
  );
};

const enhancer = connect(
  (state) => ({
    tableData: state.table.table,
    tableDataChat: state.table.tableChat,
  }),
  {
    fetchPatients: actions.tableAction,
    chatResponse: actions.chatResponse,
  }
);

export default enhancer(Dashboard);
