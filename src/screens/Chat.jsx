import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useSearchParams} from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import alliAvatar from '../assets/onboard1.png';
import { uploadImageToStorage, uploadImageAsBase64, testStorageConnection } from '../utils/storage';


const openaiService = {
  async sendMessage(messages, imageUrl = null) {
    try {
      
      const systemMessage = {
        role: "system",
        content: `You are Alli, a helpful AI assistant specializing in cybersecurity and scam detection. 
        You help users identify scams, analyze suspicious messages, emails, and images for potential threats.
        Be friendly, helpful, and provide clear guidance on staying safe online. 
        Keep responses conversational but informative. Use active voice, be direct and concise, and Simplify grammar`
      };

      const chatMessages = [systemMessage];
      
      
      // This is how chatgpt api reads messages. 
      messages.forEach(msg => {
        if (msg.sender === 'user') {
          if (msg.type === 'image' && imageUrl) {
            chatMessages.push({
              role: "user",
              content: [
                {
                  type: "text",
                  text: msg.text
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            });
          } else {
            chatMessages.push({
              role: "user",
              content: msg.text
            });
          }
        } else if (msg.sender === 'alli' && msg.text && !msg.text.includes("I'm having trouble")) {
        chatMessages.push({
          role: "assistant",
          content: msg.text
          });
        }
      });

      console.log("...", JSON.stringify(chatMessages, null, 2));

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${"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"}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: chatMessages,
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();

      const reply = data.choices?.[0]?.message?.content?.trim();


      return reply;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};

const Chat = () => {
  const location = useLocation();
  
  const name = location.state?.name || 'there';
  const context = location.state?.context;
  const imageUrl = location.state?.imageUrl;
  const imageFile = location.state?.imageFile;
  const [searchParams] = useSearchParams(); 
  const [hasSent, setHasSent] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'alli',
      text: `Hello ${name}, what can I do for you today?`,
      timestamp: new Date()
    },
    
  ]);

useEffect(() => {
  const questionParam = searchParams.get("question")

  if(questionParam && messages.length === 0) {
    
    
    const newMessage = {
      
      sender: 'user',
      text: questionParam,
      timestamp: Date.now()
    }
  
  setMessages((prev) => [...prev, newMessage]);
  handleSendMessage(questionParam)
  setHasSent(true);
  }
},[searchParams, hasSent])

 


  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const processedImageRef = useRef(false);
  const processedAnalysisRef = useRef(false);
  const fileInputRef = useRef(null);
  const timeoutIds = useRef([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutIds.current.forEach(clearTimeout);
    };
  }, []);

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

  // Generate AI response
  const generateAIResponse = async (userMessage, currentMessages) => {
    setIsTyping(true);
    try {
      // Get the last image URL if the recent message contains an image
      const recentImageMessage = currentMessages
        .slice(-5) // Check last 5 messages
        .reverse()
        .find(msg => msg.type === 'image');
      
      const imageUrlForAPI = recentImageMessage?.imageUrl;
      
      const aiResponse = await openaiService.sendMessage(currentMessages, imageUrlForAPI);
      
      const alliMessage = {
        id: Date.now(),
        sender: 'alli',
        text: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, alliMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback response
      const fallbackMessage = {
        id: Date.now(),
        sender: 'alli',
        text: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment, or feel free to ask me about cybersecurity and scam detection!',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle image sharing from QuickScamScan
  useEffect(() => {
    if (context === 'image_share' && imageUrl && !processedImageRef.current) {
      processedImageRef.current = true;
      
      const handleImageUpload = async () => {
        try {
          let finalImageUrl = imageUrl;
          
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
          
          const updatedMessages = [...messages, imageMessage];
          setMessages(updatedMessages);
          
          // Generate AI response for the image
          const timeoutId = setTimeout(() => {
            generateAIResponse(imageMessage, updatedMessages);
          }, 1000);
          timeoutIds.current.push(timeoutId);
          
        } catch (error) {
          console.error('Error uploading image:', error);
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
      
      const updatedMessages = [...messages, analysisMessage];
      setMessages(updatedMessages);
      
      // Generate AI response for the analysis
      const timeoutId = setTimeout(() => {
        generateAIResponse(analysisMessage, updatedMessages);
      }, 1000);
      timeoutIds.current.push(timeoutId);
    }
  }, [context, imageUrl, location.state?.analysisResult]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && !isTyping) {
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        text: newMessage.trim(),
        timestamp: new Date()
      };
      
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setNewMessage('');
      
      // Generate AI response
      const timeoutId = setTimeout(() => {
        generateAIResponse(userMessage, updatedMessages);
      }, 500);
      timeoutIds.current.push(timeoutId);
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

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const userId = location.state?.userInfo?.uid || 'anonymous';
      let uploadedImageUrl;
      
      try {
        console.log('Attempting Firebase Storage upload with progress monitoring...');
        uploadedImageUrl = await uploadImageToStorage(file, userId, 'chat-images', (progress) => {
          setUploadProgress(progress);
          console.log(`Upload progress: ${progress}%`);
        });
        console.log('Image uploaded to Firebase Storage successfully');
      } catch (storageError) {
        console.warn('Firebase Storage failed, using fallback method:', storageError);
        uploadedImageUrl = await uploadImageAsBase64(file, userId);
        console.log('Image stored as base64 (temporary)');
      }
      
      const imageMessage = {
        id: Date.now(),
        sender: 'user',
        type: 'image',
        imageUrl: uploadedImageUrl,
        text: 'I uploaded this image for analysis.',
        timestamp: new Date()
      };
      
      const updatedMessages = [...messages, imageMessage];
      setMessages(updatedMessages);
      
      // Generate AI response for the uploaded image
      const timeoutId = setTimeout(() => {
        generateAIResponse(imageMessage, updatedMessages);
      }, 1000);
      timeoutIds.current.push(timeoutId);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-blue-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex-shrink-0 mr-3">
                  <img
                    src={alliAvatar}
                    alt="Alli"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="bg-[#E6F0FF] text-[#0033A0] px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white mx-4 mb-4 p-4 rounded-b-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleAttachmentClick}
              disabled={isUploading || isTyping}
              className={`text-gray-400 hover:text-gray-600 transition-colors ${
                (isUploading || isTyping) ? 'opacity-50 cursor-not-allowed' : ''
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
              placeholder={isTyping ? "Alli is typing..." : "Message Alli"}
              disabled={isTyping}
              className={`flex-1 px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0033A0] focus:bg-white transition-all ${
                isTyping ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isUploading || isTyping}
              className={`p-3 rounded-xl transition-all ${
                newMessage.trim() && !isUploading && !isTyping
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