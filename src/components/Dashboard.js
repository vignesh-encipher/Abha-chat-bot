import React, { useState, useCallback, useEffect, useRef } from 'react';
import { message } from 'antd';
import { connect } from 'react-redux';

// Import components
import Table from './Table';
import Chart from './Chart';

// Import Redux actions
import { tableAction, tableActionChat } from '../store/table/actions.js';

const Dashboard = ({ tableData, fetchPatients, fetchPatientsChat, tableDataChat }) => {
  const { loading, data, error } = tableData;
  const { loadingChat, dataChat, errorChat } = tableDataChat;
  
  // State management
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
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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

  const handleFetchPatients = (start, end) => {
    try {
      fetchPatients(start, end);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  // Handle Redux data updates
  useEffect(() => {
    if (data && data.response) {
      const patientsArray = data.response.admissionPatientList;
      setPatientsData(patientsArray);
      
      const totalRecords = data.response.totalNoOfRecord;
      setPageSize(20);
      setTotalPatients(totalRecords);
      setTotalPages(Math.ceil(totalRecords / 30));
    }
  }, [data]);

  // Handle chat response from Redux
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

  // Handle chat errors
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
    handleFetchPatients(1, 20);
  }, []);

  // Handle pagination
  const handlePaginationChange = (page, size) => {
    console.log(`Page changed to: ${page}, Size: ${size}`);
    setCurrentPage(page);
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
        id: Date.now(),
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
      setTimeout(() => {
        try {
          fetchPatientsChat(currentMessage, selectedProduct?.mrnNo);
        } catch (error) {
          console.error("Error sending message:", error);
          message.error("Failed to send message to AI assistant");

          setChatMessages((prev) => {
            const filteredMessages = prev.filter((msg) => msg.id !== loadingMessage.id);
            const botResponse = {
              id: Date.now() + 1,
              type: "bot",
              message: `I understand you're asking about "${currentMessage}". Let me help you with that regarding ${
                selectedProduct?.mrnNo || "this patient"
              }.`,
              timestamp: new Date().toLocaleTimeString(),
            };
            return [...filteredMessages, botResponse];
          });

          setTimeout(() => {
            scrollToBottom();
          }, 100);
        } finally {
          setIsBotTyping(false);
        }
      }, 1000);
    }
  }, [inputMessage, selectedProduct, fetchPatientsChat, scrollToBottom]);

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
      <Table
        patientsData={patientsData}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPatients={totalPatients}
        onPaginationChange={handlePaginationChange}
        onChatClick={handleChatClick}
      />

      <Chart
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
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    tableData: state.table.table,
    tableDataChat: state.table.tableChat,
  }),
  {
    fetchPatients: tableAction,
    fetchPatientsChat: tableActionChat,
  }
);

export default enhancer(Dashboard);