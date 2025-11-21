import React from 'react';
import { Drawer, Space, Button, Input, List } from 'antd';
import { RobotOutlined, SendOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import ChartRenderer from '../ChartRenderer';
import './style.css';

const Chat = ({
  visible,
  onClose,
  chatMessages,
  inputMessage,
  onInputChange,
  onSendMessage,
  isBotTyping,
  streamingMessageId,
  chatContainerRef
}) => {
  const ChatMessage = ({ item, index }) => {
    return (
      <List.Item className="chat-message-item">
        <div
          className={`modern-chat-message ${item.type === "user" ? "user-message" : "bot-message"}`}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {item.type === "bot" && (
            <div className="bot-avatar">
              <UserOutlined />
            </div>
          )}
          
          <div className={`message-bubble ${item.type === "user" ? "user-bubble" : "bot-bubble"}`}>
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
              <div className="message-content">
                <div
                  className="patient-html-content content-font"
                >
                  <div dangerouslySetInnerHTML={{ __html: item.message }} />
                  {streamingMessageId === item.id && (
                    <span className="streaming-cursor">|</span>
                  )}
                  {item.chartData && item.type === "bot" && item.chartData.labels &&  item.chartData.series && (
                    <div className="chart-container">
                      <ChartRenderer chartData={item.chartData} />
                    </div>
                  )}
                  {item.base64 && item.type === "bot" && !item.chartData && (
                    <div className="chart-container">
                      <img
                        src={`${item.base64}`}
                        alt="Chart"
                        className="chart-image"
                        onLoad={() => console.log("Chart image loaded successfully")}
                        onError={(e) => console.log("Chart image failed to load:", e)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="message-timestamp">
              {item.timestamp}
            </div>
          </div>
          
          {item.type === "user" && (
            <div className="user-avatar">
              <UserOutlined />
            </div>
          )}
        </div>
      </List.Item>
    );
  };

  return (
    <Drawer
      title={
        <Space>
          <RobotOutlined />
          <span>AI Assistant</span>
        </Space>
      }
      placement="right"
      width="50%"
      closable={false}
      open={visible}
      extra={
        <Button type="text" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="chat-container-wrapper">
        <div
          ref={chatContainerRef}
          className="chat-container"
        >
          <List
            dataSource={chatMessages}
            renderItem={(item, index) => (
              <ChatMessage
                key={item.id}
                item={item}
                index={index}
              />
            )}
          />
        </div>

        {/* Modern Input Area */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={onInputChange}
              onPressEnter={onSendMessage}
              className="chat-input"
              variant="borderless"
            />
            <Button
              type="primary"
              icon={isBotTyping ? <LoadingOutlined /> : <SendOutlined />}
              onClick={onSendMessage}
              disabled={!inputMessage.trim() || isBotTyping}
              className={`modern-send-button ${inputMessage.trim() && !isBotTyping ? 'active' : 'disabled'}`}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default Chat;
