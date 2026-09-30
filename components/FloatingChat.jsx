'use client';

import { useState } from 'react';

export default function FloatingChat({ chatUser, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, text: `Hey! Thanks for connecting on Facebook! 😊`, sender: 'them', time: '10:12 AM' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated instant reply from friend
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `Awesome! Facebook clone is looking super smooth! 🚀`,
          sender: 'them',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  if (!chatUser) return null;

  return (
    <div className="floating-chat-box">
      {/* Header */}
      <div className="floating-chat-header">
        <div className="flex" style={{ gap: '8px' }}>
          <div className="contact-img-div">
            <img
              src={chatUser.avatar || '/images/sumon-profile-icon.jpg'}
              alt={chatUser.name}
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div className="blue-light"></div>
          </div>
          <div>
            <p style={{ fontWeight: '600', fontSize: '13px', color: 'var(--fb-primary-text, #050505)' }}>{chatUser.name}</p>
            <p style={{ fontSize: '11px', color: '#31a24c' }}>Active now</p>
          </div>
        </div>

        <div className="flex" style={{ gap: '6px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--fb-secondary-text, #65676b)',
              fontSize: '16px',
              padding: '4px',
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      {/* Message Body */}
      <div className="floating-chat-body">
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.sender === 'me' ? 'chat-bubble-sent' : 'chat-bubble-received'}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSendMessage} className="floating-chat-input-bar">
        <input
          type="text"
          placeholder="Aa"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            flex: 1,
            backgroundColor: 'var(--fb-input-bg, #f0f2f5)',
            color: 'var(--fb-primary-text, #050505)',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 12px',
            fontSize: '13px',
            outline: 'none',
          }}
          autoFocus
        />
        <button
          type="submit"
          style={{
            background: 'none',
            border: 'none',
            color: '#1877F2',
            cursor: 'pointer',
            padding: '4px 8px',
            fontSize: '16px',
          }}
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

