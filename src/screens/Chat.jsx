import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import alliAvatar from '../assets/onboard1.png';
import { uploadImageToStorage, uploadImageAsBase64, testStorageConnection } from '../utils/storage';

const Chat = () => {
  const location = useLocation();
  const name = location.state?.name || 'there';
  const context = location.state?.context;
  const imageUrl = location.state?.imageUrl;
  const imageFile = location.state?.imageFile;
  
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const messagesEndRef = useRef(null);
  const processedImageRef = useRef(false);
  const processedAnalysisRef = useRef(false);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Test Firebase Storage connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      const isConnected = await testStorageConnection();
      console.log('Firebase Storage connection test result:', isConnected);
    };
    testConnection();
  }, []);

  const handleTestStorage = async () => {
    console.log('Manual storage test started...');
    const result = await testStorageConnection();
    if (result) {
      alert('✅ Firebase Storage is working!');
    } else {
      alert('❌ Firebase Storage test failed. Check console for details.');
    }
  };

  // Handle image sharing from QuickScamScan
  useEffect(() => {
    if (context === 'image_share' && imageUrl && !processedImageRef.current) {
      processedImageRef.current = true;
      
      // Upload image to Firebase Storage if we have a file
      const handleImageUpload = async () => {
        try {
          let finalImageUrl = imageUrl;
          
          // If we have an imageFile, try Firebase Storage with fallback
          if (imageFile) {
            const userId = location.state?.userInfo?.uid || 'anonymous';
            try {
              console.log('Attempting Firebase Storage upload for image from home page...');
              finalImageUrl = await uploadImageToStorage(imageFile, userId, 'chat-images');
              console.log('Image uploaded to Firebase Storage:', finalImageUrl);
            } catch (storageError) {
              console.warn('Firebase Storage failed, using fallback method:', storageError);
              finalImageUrl = await uploadImageAsBase64(imageFile, userId);
              console.log('Image stored as base64 (temporary)');
            }
          }
          
          const imageMessage = {
            id: Date.now(),
            sender: 'user',
            type: 'image',
            imageUrl: finalImageUrl,
            text: 'I received this image and would like you to analyze it for potential scams.',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, imageMessage]);
          
          // Simulate Alli's response after a short delay
          setTimeout(() => {
            const alliResponse = {
              id: Date.now() + 1,
              sender: 'alli',
              text: 'I can see the image you\'ve shared. Let me analyze it for potential scam indicators. This appears to be a suspicious email with several red flags that I can help you identify.',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, alliResponse]);
          }, 1000);
        } catch (error) {
          console.error('Error uploading image:', error);
          // Fallback to local URL if upload fails
          const imageMessage = {
            id: Date.now(),
            sender: 'user',
            type: 'image',
            imageUrl: imageUrl,
            text: 'I received this image and would like you to analyze it for potential scams.',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, imageMessage]);
        }
      };
      
      handleImageUpload();
    } else if (context === 'scam_analysis' && location.state?.analysisResult && !processedAnalysisRef.current) {
      processedAnalysisRef.current = true;
      
      const analysisResult = location.state.analysisResult;
      const analysisMessage = {
        id: Date.now(),
        sender: 'user',
        type: 'analysis',
        text: `I just analyzed some content and got a ${analysisResult.scamAnalysis.risk_level} risk level (${analysisResult.scamAnalysis.risk_score}/100). Can you help me understand the results better?`,
        analysisResult: analysisResult,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, analysisMessage]);
      
      // Simulate Alli's response after a short delay
      setTimeout(() => {
        const alliResponse = {
          id: Date.now() + 1,
          sender: 'alli',
          text: `I can see your analysis results! The content you analyzed has a ${analysisResult.scamAnalysis.risk_level} risk level with a score of ${analysisResult.scamAnalysis.risk_score}/100. Let me help you understand what this means and provide additional guidance.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, alliResponse]);
      }, 1000);
    }
  }, [context, imageUrl, location.state?.analysisResult]);

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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const userId = location.state?.userInfo?.uid || 'anonymous';
      let imageUrl;
      
      // Try Firebase Storage first with progress monitoring
      try {
        console.log('Attempting Firebase Storage upload with progress monitoring...');
        imageUrl = await uploadImageToStorage(file, userId, 'chat-images', (progress) => {
          setUploadProgress(progress);
          console.log(`Upload progress: ${progress}%`);
        });
        console.log('Image uploaded to Firebase Storage successfully');
      } catch (storageError) {
        console.warn('Firebase Storage failed, using fallback method:', storageError);
        // Fallback to base64 for development
        imageUrl = await uploadImageAsBase64(file, userId);
        console.log('Image stored as base64 (temporary)');
      }
      
      const imageMessage = {
        id: Date.now(),
        sender: 'user',
        type: 'image',
        imageUrl: imageUrl,
        text: 'I uploaded this image for analysis.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, imageMessage]);
      
      // Simulate Alli's response
      setTimeout(() => {
        const alliResponse = {
          id: Date.now() + 1,
          sender: 'alli',
          text: 'I can see the image you\'ve uploaded. Let me analyze it for potential scam indicators.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, alliResponse]);
      }, 1000);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
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
          <div className="flex items-center gap-2">
            <button 
              onClick={handleTestStorage}
              className="text-white hover:text-gray-200 transition-colors text-xs bg-blue-600 px-2 py-1 rounded"
            >
              Test Storage
            </button>
            <button className="text-white hover:text-gray-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
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
                  {message.type === 'image' && (
                    <div className="mb-2">
                      <img
                        src={message.imageUrl}
                        alt="Shared image"
                        className="w-full h-48 object-contain rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
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
                         <button 
               onClick={handleAttachmentClick}
               disabled={isUploading}
               className={`text-gray-400 hover:text-gray-600 transition-colors ${
                 isUploading ? 'opacity-50 cursor-not-allowed' : ''
               }`}
             >
               {isUploading ? (
                 <div className="flex items-center gap-2">
                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                   <span className="text-xs text-gray-500">{Math.round(uploadProgress)}%</span>
                 </div>
               ) : (
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                 </svg>
               )}
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
              disabled={!newMessage.trim() || isUploading}
              className={`p-3 rounded-xl transition-all ${
                newMessage.trim() && !isUploading
                  ? 'bg-[#0033A0] text-white hover:bg-[#002266]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav activePage="/chat" />
    </div>
  );
};

export default Chat;