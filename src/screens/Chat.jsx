import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import alliAvatar from '../assets/onboard1.png';

const Chat = () => {
  const location = useLocation();
  const name = location.state?.name || 'there';
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'alli',
      text: `Hello ${name}, what can I do for you today?`,
      timestamp: new Date()
    },
    {
      id: 2,
      sender: 'alli',
      text: 'I can help you identify scams, answer questions about suspicious messages, or provide safety tips.',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: newMessage,
        timestamp: new Date()
      };
      setMessages([...messages, userMessage]);
      setNewMessage('');
      
      // Simulate Alli's response after a short delay
      setTimeout(() => {
        const alliResponse = {
          id: messages.length + 2,
          sender: 'alli',
          text: 'Thanks for your message! I\'m here to help you stay safe online. What specific concerns do you have about cybersecurity?',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, alliResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      {/* Header */}
      <Header variant="home" />

      {/* Chat Container */}
      <div className="flex-1 flex flex-col pt-20 pb-24">
        {/* Chat Header */}
        <div className="bg-[#0033A0] text-white px-4 py-3 rounded-t-2xl mx-4 mt-4 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Chat With Alli</h2>
          <button className="text-white hover:text-gray-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white mx-4 px-4 py-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'alli' && (
                  <div className="flex-shrink-0 mr-3">
                    <img
                      src={alliAvatar}
                      alt="Alli"
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-[#0033A0] text-white ml-auto'
                      : 'bg-[#E6F0FF] text-[#0033A0]'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-blue-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white mx-4 mb-4 p-4 rounded-b-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Alli"
              className="flex-1 px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0033A0] focus:bg-white transition-all"
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-xl transition-all ${
                newMessage.trim()
                  ? 'bg-[#0033A0] text-white hover:bg-[#002266]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav activePage="/chat" />
    </div>
  );
};

export default Chat;