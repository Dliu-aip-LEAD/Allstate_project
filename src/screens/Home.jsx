import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import alliAvatar from '../assets/alli_question.png'; // Using the better detective image
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { uploadImageToStorage, uploadImageAsBase64 } from '../utils/storage';
import { getUserProgress, defaultDetectiveAcademy } from '../utils/userProgress';
import { getDepartment, getAvailableMissions } from '../data/missions';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore, auth } from '../firebase';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name || 'there';
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Get user info from Firebase Auth
  const [userId, setUserId] = useState('anonymous');

  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Detective Academy states
  const [detectiveData, setDetectiveData] = useState(defaultDetectiveAcademy);
  const [loading, setLoading] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('🔐 User authenticated:', user.uid);
        setUserId(user.uid);
      } else {
        console.log('🔐 User not authenticated');
        setUserId('anonymous');
        setDetectiveData(defaultDetectiveAcademy);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Load user progress data with real-time updates
  useEffect(() => {
    if (userId && userId !== 'anonymous') {
      console.log('🔍 Setting up real-time listener for user:', userId);
      
      // Set up real-time listener for user document
      const userRef = doc(firestore, 'users', userId);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          const progress = userData.detectiveAcademy || defaultDetectiveAcademy;
          
          console.log('📊 Real-time update received:', progress);
          console.log('   User data:', userData);
          console.log('   Detective academy:', progress);
          setDetectiveData(progress);
          
          // Load current mission info if exists
          if (progress.currentMissionId) {
            const availableMissions = getAvailableMissions(progress);
            const mission = availableMissions.find(m => m.id === progress.currentMissionId);
            setCurrentMission(mission);
          }
          
          setLoading(false);
        } else {
          console.log('❌ User document not found');
          setDetectiveData(defaultDetectiveAcademy);
          setLoading(false);
        }
      }, (error) => {
        console.error('❌ Error in real-time listener:', error);
        setLoading(false);
      });
      
      // Cleanup function to unsubscribe when component unmounts
      return () => {
        console.log('🔍 Cleaning up real-time listener');
        unsubscribe();
      };
    } else {
      // Fallback to default data if no user ID
      setDetectiveData(defaultDetectiveAcademy);
      setLoading(false);
    }
  }, [userId]);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Calculate progress percentage for level
  const getLevelProgress = () => {
    if (detectiveData.experienceToNextLevel === 0) return 100;
    const currentLevelExp = detectiveData.experience - (detectiveData.experience - detectiveData.experienceToNextLevel);
    const totalExpForLevel = detectiveData.experienceToNextLevel;
    return Math.round((currentLevelExp / totalExpForLevel) * 100);
  };

  // Get next level info
  const getNextLevelInfo = () => {
    const currentLevel = detectiveData.level;
    if (currentLevel >= 5) return null;
    
    const nextLevel = currentLevel + 1;
    const levelNames = {
      2: "Apprentice Detective",
      3: "Mid-Level Detective", 
      4: "Senior Detective",
      5: "Expert Detective"
    };
    
    return {
      level: nextLevel,
      name: levelNames[nextLevel] || `Level ${nextLevel}`,
      expRequired: detectiveData.experienceToNextLevel
    };
  };

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
        imageUrl = await uploadImageAsBase64(file);
        console.log('Photo uploaded as base64:', imageUrl);
      }
      
      // Navigate to chat with the image
      navigate('/chat', { 
        state: { 
          imageUrl, 
          userInfo: { uid: userId, name },
          fromCamera: true 
        } 
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleQuickScanClick = (scanType) => {
    switch (scanType) {
      case 'Screenshot':
        // Handle screenshot upload
        fileInputRef.current?.click();
        break;
      case 'Upload File':
        // Handle file upload
        fileInputRef.current?.click();
        break;
      case 'Take Photo':
        // Start camera
        startCamera();
        break;
      default:
        break;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await handlePhotoUpload(file);
    }
  };

  const nextLevelInfo = getNextLevelInfo();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      {/* Header */}
      <Header variant="home" />

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-4 max-w-md w-full mx-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-xl"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={capturePhoto}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold"
              >
                📸 Capture
              </button>
              <button
                onClick={stopCamera}
                className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

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

        {/* Detective Academy - Updated with user data */}
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
              {detectiveData.currentMissionId && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">1</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">🏆 {detectiveData.levelName}</p>
              {nextLevelInfo ? (
                <p className="text-blue-100 text-xs">Level {detectiveData.level} of 5 • Next: {nextLevelInfo.name}</p>
              ) : (
                <p className="text-blue-100 text-xs">Level {detectiveData.level} of 5 • Maximum Level Reached!</p>
              )}
              <div className="mt-2 w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${getLevelProgress()}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
              {detectiveData.experience} PTS
            </div>
          </div>

          {currentMission ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 mb-4">
              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wide">🟢 Active Mission</p>
              <p className="text-white font-semibold text-sm">{currentMission.title}</p>
              <p className="text-blue-100 text-xs">Detective Alli needs your help with this investigation</p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 mb-4">
              <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide">📋 No Active Mission</p>
              <p className="text-white font-semibold text-sm">Ready for your next case?</p>
              <p className="text-blue-100 text-xs">Start a new mission to continue your training</p>
            </div>
          )}

          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
              <p className="text-white text-lg font-bold">{detectiveData.missionsCompleted}</p>
              <p className="text-blue-100 text-xs">Missions Solved</p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
              <p className="text-white text-lg font-bold">{detectiveData.successRate}%</p>
              <p className="text-blue-100 text-xs">Success Rate</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/play')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm"
          >
            {currentMission ? 'Continue Mission' : 'Start New Mission'}
          </button>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Home;
