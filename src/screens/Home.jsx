import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import alliAvatar from '../assets/onboard1.png'; // Replace with correct path
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

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      {/* Header */}
      <Header variant="home" />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 space-y-6 pt-20">
        {/* Detective Alli Section */}
        <section className="bg-[#E6F0FF] p-4 rounded-2xl shadow-sm">
          <div className="flex gap-3 items-center">
            <img src={alliAvatar} className="w-14 h-14" />
            <div>
              <h2 className="text-[#0033A0] text-lg font-bold">Hey {name}</h2>
              <p className="text-green-600 text-xs">Online • Ask me anything about online safety</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
  <p className="text-[#0033A0] text-xs font-semibold mb-1">Popular Questions</p>
  {["Is this email safe?", "What are romance scams?"].map((q, i) => (
    <p
      key={i}
      className="bg-white p-2 rounded-md shadow-sm hover:bg-[#f0f4f8] cursor-pointer transition"
    >
      "{q}"
    </p>
  ))}
</div>

          <button
            onClick={() => navigate('/chat')}
            className="mt-4 w-full bg-[#00AEFF] hover:bg-[#0094d3] text-white py-3 rounded-full font-semibold text-sm transition-all duration-200"
          >
            Chat with Detective Alli
          </button>
        </section>

        {/* Quick Scam Scan */}
        <section className="bg-white p-5 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-1">⚡ Quick Scam Scan</h3>
          <p className="text-xs text-gray-500 mb-3">Instant AI analysis • Quick Results</p>
          <div className="grid grid-cols-3 gap-2 text-sm text-center">
            {["Screenshot", "Upload File", "Take Photo"].map((label) => (
              <button
                key={label}
                onClick={() => handleQuickScanClick(label)}
                className="flex flex-col items-center justify-center border p-3 rounded-lg hover:bg-gray-100 shadow-sm"
              >
                <span className="text-xl">📎</span>
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Detective Academy */}
        <section className="relative bg-gradient-to-br from-[#DEE9FF] to-[#C7D9FF] p-4 rounded-2xl shadow-md">
  {/* Badge Icon */}
  <div className="absolute -top-6 right-4 bg-white rounded-full border shadow-md p-1">
    <img src={alliAvatar} alt="badge" className="w-10 h-10 rounded-full" />
  </div>

  {/* Title */}
  <h3 className="text-[#0033A0] font-bold text-sm">🎓 Detective Academy</h3>
  <p className="text-xs mb-2">Train with Detective Alli to become a cybersecurity expert</p>
  <p className="text-sm font-semibold">🥉 Junior Detective</p>
  <div className="text-xs text-gray-600">Level 3 of 5 • Next: Senior Detective</div>

  {/* Points */}
  <div className="mt-1">
    <span className="bg-white text-[#FF6D00] px-3 py-1 text-xs rounded-full font-semibold inline-block shadow-sm">
      🔥 350 PTS
    </span>
  </div>

  {/* Active Mission + Mission Solved */}
  <div className="flex gap-2 mt-4">
  {/* Mission Block */}
  <div className="flex-1 bg-white border rounded-xl p-3 text-sm">
    <p className="text-[#00C853] font-bold">🟢 ACTIVE MISSION</p>
    <p className="font-bold text-sm">Spot the Phishing Email</p>
    <p className="text-xs text-gray-600">Detective Alli is helping you identify suspicious messages</p>
  </div>

  {/* Solved Block */}
  <div className="flex flex-col items-center justify-center bg-white border rounded-xl px-4 py-3 text-center">
    <p className="text-xs text-gray-600">MISSIONS SOLVED</p>
    <p className="text-lg font-bold text-[#0033A0]">5</p>
  </div>
</div>


  {/* CTA */}
  <button
    onClick={() => navigate('/play')}
    className="mt-4 w-full bg-[#00C853] hover:bg-[#00a44b] text-white py-3 rounded-full font-semibold text-sm"
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
