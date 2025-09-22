import React from 'react';

export default function SimplePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Test Page</h1>
      <p>This is a simple test page to verify the application is working.</p>
      <div style={{ 
        background: '#f0f0f0', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>Next.js + Bootstrap + Ant Design</h2>
        <p>Your application is running successfully!</p>
        <ul>
          <li>✅ Next.js 15.5.3</li>
          <li>✅ Bootstrap 5.3.8</li>
          <li>✅ Ant Design 5.27.4</li>
          <li>✅ JavaScript (ES6+)</li>
        </ul>
      </div>
    </div>
  );
}
