import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import alliAvatar from '../assets/alli_question.png'; // Using the better detective image
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { uploadImageToStorage, uploadImageAsBase64 } from '../utils/storage';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name || 'there';
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Get user info from location state or localStorage
  const userInfo = location.state?.userInfo || JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userId = userInfo.uid || 'anonymous';

  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Camera functionality
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
          stopCamera();
          
          // Upload photo and navigate to chat
          await handlePhotoUpload(file);
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const handlePhotoUpload = async (file) => {
    setIsUploading(true);
    try {
      let imageUrl;
      
      // Try Firebase Storage first with fallback to base64
      try {
        console.log('Uploading photo to Firebase Storage...');
        imageUrl = await uploadImageToStorage(file, userId, 'chat-images');
        console.log('Photo uploaded to Firebase Storage:', imageUrl);
      } catch (storageError) {
        console.warn('Firebase Storage failed, using fallback method:', storageError);
        imageUrl = await uploadImageAsBase64(file, userId);
        console.log('Photo stored as base64 (temporary)');
      }

      // Navigate to chat with the photo
      navigate('/chat', { 
        state: { 
          name: userInfo.displayName || name,
          context: 'image_share',
          imageUrl: imageUrl,
          imageFile: file
        }
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
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

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Navigate to chat with the image
      navigate('/chat', { 
        state: { 
          name: userInfo.displayName || name,
          context: 'image_share',
          imageUrl: previewUrl,
          imageFile: file
        }
      });
    }
  };

  const handleScreenshotClick = () => {
    fileInputRef.current?.click();
  };

  const handleQuickScanClick = (label) => {
    if (label === "Screenshot") {
      handleScreenshotClick();
    } else if (label === "Take Photo") {
      startCamera();
    } else {
      navigate('/quick-scam-scan', { state: { userInfo: { uid: 'user123', displayName: name } } });
    }
  };

       const questionAnswer = (question) => {
        console.log("Navigating with question:", question);
          navigate(`/chat?question=${encodeURIComponent(question)}`,{
            state: {
              name:userInfo.displayName || name
            }
          })

        }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      {/* Header */}
      <Header variant="home" />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 space-y-6 pt-20">
        {/* Detective Alli Section */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex gap-3 items-start">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                <img 
                  src={alliAvatar} 
                  alt="Detective Alli" 
                  className="w-full h-full object-cover object-center" 
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-gray-900 text-lg font-semibold">Detective Alli</h2>
              <p className="text-green-600 text-sm font-medium">Online • Ask me anything about online safety</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
              💡 Popular Questions
            </p>
            <div className="space-y-2">
              {["Is this email safe?", "What are romance scams?"].map((q, i) => (
                <button
                  key={i}
                  onClick={() => questionAnswer(q)}
                  className="w-full text-left bg-blue-50 hover:bg-blue-100 p-3 rounded-xl text-sm text-blue-700 transition-colors duration-200"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>



          <button
            onClick={() => navigate('/chat')}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm"
          >
            Chat with Detective Alli
          </button>

          
        </section>


        {/* Quick Scam Scan */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-900 text-lg font-semibold flex items-center gap-2">
                ⚡ Quick Scam Scan
              </h3>
              <p className="text-green-600 text-sm font-medium">Instant AI analysis • Quick Results</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-700">Ready</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "📱", label: "Screenshot" },
              { icon: "📎", label: "Upload File" },
              { icon: "📷", label: "Take Photo" }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleQuickScanClick(item.label)}
                className="flex flex-col items-center justify-center bg-white border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 p-4 rounded-xl transition-all duration-200"
              >
                <span className="text-2xl mb-2">{item.icon}</span>
                <span className="text-xs font-semibold text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Detective Academy */}
        <section className="bg-gradient-to-br from-blue-700 to-indigo-700 p-5 rounded-2xl shadow-lg text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-white text-lg font-semibold">🎓 Detective Academy</h3>
              <p className="text-blue-100 text-sm">Train with Detective Alli to become a cybersecurity expert</p>
            </div>
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                <img 
                  src={alliAvatar} 
                  alt="Detective Alli" 
                  className="w-full h-full object-cover object-center" 
                />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">1</div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">🏆 Junior Detective</p>
              <p className="text-blue-100 text-xs">Level 3 of 5 • Next: Senior Detective</p>
              <div className="mt-2 w-full bg-white/20 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
              350 PTS
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 mb-4">
            <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wide">🟢 Active Mission</p>
            <p className="text-white font-semibold text-sm">Spot the Phishing Email</p>
            <p className="text-blue-100 text-xs">Detective Alli needs your help identifying suspicious messages</p>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
              <p className="text-white text-lg font-bold">5</p>
              <p className="text-blue-100 text-xs">Missions Solved</p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
              <p className="text-white text-lg font-bold">85%</p>
              <p className="text-blue-100 text-xs">Success Rate</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/play')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm"
          >
            Start Training Mission
          </button>
        </section>
      </main>

      {/* Hidden file input for screenshot upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Camera Interface */}
      {showCamera && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Camera Header */}
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <button
              onClick={stopCamera}
              className="text-white hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold">Take Photo</h3>
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>

          {/* Camera View */}
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Camera Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-white border-dashed rounded-lg w-80 h-60 opacity-50"></div>
            </div>
          </div>

          {/* Camera Controls */}
          <div className="bg-black p-6 flex items-center justify-center">
            <button
              onClick={capturePhoto}
              disabled={isUploading}
              className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
              ) : (
                <div className="bg-white rounded-full w-12 h-12 border-4 border-gray-300"></div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default Home;
