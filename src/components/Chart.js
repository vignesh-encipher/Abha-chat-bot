import React from 'react';
import { Drawer, Space, Button, Input, List } from 'antd';
import { RobotOutlined, SendOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';

const Chart = ({
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
      <List.Item style={{ border: "none", padding: "12px 0" }}>
        <div
          className="modern-chat-message"
          style={{
            display: "flex",
            justifyContent: item.type === "user" ? "flex-end" : "flex-start",
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
              borderRadius: item.type === "user" ? "24px 8px 24px 24px" : "8px 24px 24px 24px",
              background: item.type === "user"
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "rgba(255,255,255,0.95)",
              color: item.type === "user" ? "white" : "#333",
              wordWrap: "break-word",
              boxShadow: item.type === "user"
                ? "0 8px 32px rgba(102, 126, 234, 0.3)"
                : "0 4px 16px rgba(0,0,0,0.1)",
              border: item.type === "bot" ? "1px solid rgba(255,255,255,0.2)" : "none",
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
                <div dangerouslySetInnerHTML={{ __html: item.message }} />
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
                      onLoad={() => console.log("Chart image loaded successfully")}
                      onError={(e) => console.log("Chart image failed to load:", e)}
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
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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
              <ChatMessage
                key={item.id}
                item={item}
                index={index}
              />
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
              onChange={onInputChange}
              onPressEnter={onSendMessage}
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
              onClick={onSendMessage}
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
  );
};

export default Chart;
