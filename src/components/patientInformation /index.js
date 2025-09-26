import React, { useState, useCallback, useEffect, useRef } from 'react';
import { message } from 'antd';
import { connect } from 'react-redux';

// Import components
import Table from '../PatientTable';
import Chart from '../Chat';

// Import Redux actions
import { tableAction } from '../../store/table/actions.js';

// Import network utilities
import { requestExternalAPI } from '../../utils/network/index.js';
import Title from 'antd/es/skeleton/Title';
import Paragraph from 'antd/es/skeleton/Paragraph';
import './style.css';

const Dashboard = ({ tableData, fetchPatients, tableDataChat }) => {
  const { loading, data } = tableData;
  const { dataChat, errorChat } = tableDataChat;
  
  // State management
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

  const handleFetchPatients = useCallback((start, end) => {
    try {
      fetchPatients(start, end);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  }, [fetchPatients]);

  // Handle Redux data updates
  useEffect(() => {
    if (data && data.response) {
      const patientsArray = data.response.admissionPatientList;
      setPatientsData(patientsArray);
      
      const totalRecords = data.response.totalNoOfRecord;
      setPageSize(18);
      setTotalPatients(totalRecords);
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
    handleFetchPatients(1, 18);
  }, [handleFetchPatients]);

  // Handle pagination
  const handlePaginationChange = (page, size) => {
    console.log(`Page changed to: ${page}, Size: ${size}`);
    setCurrentPage(page);
    const start = (page - 1) * 18 + 1;
    const end = page * 18;
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

  // Helper function to create user message
  const createUserMessage = (message, timestamp) => ({
        id: Date.now(),
        type: "user",
    message,
    timestamp,
  });

  // Helper function to create loading message
  const createLoadingMessage = () => ({
        id: "loading-" + Date.now(),
        type: "bot",
    message: "🔄 Processing your request... This may take up to 30 seconds for complex queries.",
        timestamp: new Date().toLocaleTimeString(),
        isLoading: true,
  });

  // Helper function to create error message
  const createErrorMessage = (errorType) => {
    const errorMessages = {
      SERVER_ERROR: "I'm having trouble processing your request right now. Please try again in a moment.",
      TIMEOUT_ERROR: "⏱️ Your request is taking longer than expected (30+ seconds). The external service might be slow. Please try again with a simpler question or wait a moment and retry.",
      SERVICE_UNAVAILABLE: "🔌 The external analytics service is currently unavailable. This might be due to network issues or the service being down. Please try again in a few minutes or contact support if the issue persists.",
      BAD_REQUEST: "I couldn't understand your question. Please try rephrasing it or ask something more specific.",
      DEFAULT: "I'm currently experiencing some technical difficulties. Please try asking your question again in a moment."
    };

    return {
      id: Date.now() + 1,
      type: "bot",
      message: errorMessages[errorType] || errorMessages.DEFAULT,
      timestamp: new Date().toLocaleTimeString(),
    };
  };

  // Helper function to create SQL analytics response
  const createSQLResponse = (data, originalMessage) => {
    let botMessage = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
        📊 Analysis for: "${originalMessage}"
      </h3>`;
    
    // Handle the new API response structure
    const responseData = data.data || data;
    
    if (responseData?.data?.df) {
      const dfData = JSON.parse(responseData.data.df);
      
      const tableHtml = `
        <div style="margin: 15px 0;">
          <h4 style="color: #555; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">📋 Results</h4>
          <div style="overflow-x: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; background: white;">
              <thead>
                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                  ${Object.keys(dfData[0] || {}).map(key => 
                    `<th style="border: none; padding: 15px 12px; text-align: left; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">${key}</th>`
                  ).join('')}
                </tr>
              </thead>
              <tbody>
                ${dfData.map((row, index) => 
                  `<tr style="background-color: ${index % 2 === 0 ? '#fafafa' : 'white'}; transition: background-color 0.2s;">
                  ${Object.values(row).map((value, cellIndex) => 
                    `<td style="border: none; padding: 12px; border-bottom: 1px solid #eee; color: #333; ${
                      cellIndex > 0 ? 'text-align: right; font-weight: 500;' : 'text-align: left;'
                    }">${value && value.toLocaleString ? value.toLocaleString() : (value || 'N/A')}</td>`
                  ).join('')}
                  </tr>`
                ).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      botMessage += tableHtml;
    }
    
    if (responseData?.summary?.text) {
      botMessage += `
        <div style="margin: 15px 0; padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px; color: white;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">📝 Summary</h4>
          <p style="margin: 0; font-size: 13px; line-height: 1.5; opacity: 0.95;">${responseData.summary.text}</p>
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
      chartData: responseData?.chart,
      shouldGenerateChart: responseData?.shouldGenerateChart,
    };
  };


  // Helper function to remove loading message and add response
  const updateMessagesWithResponse = (loadingMessageId, response) => {
    setChatMessages((prev) => {
      const filteredMessages = prev.filter((msg) => msg.id !== loadingMessageId);
      return [...filteredMessages, response];
    });
  };

  // Helper function to handle SQL analytics API call
  const handleSQLAnalytics = useCallback(async (message, mrnNo) => {
    try {
      console.log('Making request to internal API proxy for SQL analytics');
      
      // Use our internal API route that handles the external API calls server-side
      const response = await requestExternalAPI(`/api/external-sql-analytics?question=${encodeURIComponent(message)}&mrNo=${mrnNo}`);
      
      console.log('SQL Analytics response received:', response);
      return response;

    } catch (apiError) {
      console.error('API Error in SQL Analytics:', apiError);
      
      // Handle timeout errors specifically
      if (apiError.name === 'AbortError') {
        console.error('Request was aborted due to timeout');
        throw new Error('TIMEOUT_ERROR');
      }
      
      // Handle fetch failed errors (network issues)
      if (apiError.message === 'Failed to fetch' || apiError.message.includes('fetch failed') || apiError.message.includes('SocketError')) {
        console.error('Network connection failed');
        throw new Error('SERVICE_UNAVAILABLE');
      }
      
      // Handle HTTP errors from our utils
      if (apiError.status) {
        if (apiError.status >= 500) {
          throw new Error('SERVER_ERROR');
        } else if (apiError.status === 408) {
          throw new Error('TIMEOUT_ERROR');
        } else if (apiError.status >= 500) {
          throw new Error('SERVICE_UNAVAILABLE');
        } else {
          throw new Error('SERVER_ERROR');
        }
      }
      
      throw apiError;
    }
  }, []);


  // Main function to handle sending a message
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    const currentMessage = inputMessage.trim();
    const currentTime = new Date().toLocaleTimeString();
    const mrnNo = selectedProduct?.mrnNo;

    // Add user message
    const userMessage = createUserMessage(currentMessage, currentTime);
    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Show loading state
    setIsBotTyping(true);
    const loadingMessage = createLoadingMessage();
    setChatMessages((prev) => [...prev, loadingMessage]);

    // Scroll to bottom
    setTimeout(scrollToBottom, 100);

    try {
      // Use SQL Analytics API for all queries
      const data = await handleSQLAnalytics(currentMessage, mrnNo);
      
      if (data) {
        // Check if the API returned an error in the response
        if (data.error) {
          const errorResponse = createErrorMessage('DEFAULT', currentMessage);
          updateMessagesWithResponse(loadingMessage.id, errorResponse);
          return;
        }
        
        // Check if we have success and data
        if (data.success && data.data) {
          const botResponse = createSQLResponse(data, currentMessage);
          updateMessagesWithResponse(loadingMessage.id, botResponse);
        } else {
          // Handle case where API returns success: false
          const errorResponse = createErrorMessage('DEFAULT', currentMessage);
          updateMessagesWithResponse(loadingMessage.id, errorResponse);
        }
      } else {
        // Service unavailable case - loading message already removed
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
        <div className="dashboard-header">
        <h1 level={1} className="dashboard-title">
          ABHA
        </h1>
        <Paragraph className="dashboard-subtitle">
          Patient Data Analytics Dashboard
        </Paragraph>
      </div>
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
  }
);

export default enhancer(Dashboard);