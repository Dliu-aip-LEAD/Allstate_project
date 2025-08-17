import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import alliAvatar from '../assets/onboard1.png';
import { getUserProgress, defaultDetectiveAcademy } from '../utils/userProgress';
import { departments, isDepartmentUnlocked } from '../data/missions';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore, auth } from '../firebase';

// Import test functions for development/testing
import '../utils/testLoader';

const Play = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [detectiveData, setDetectiveData] = useState(defaultDetectiveAcademy);
  const [loading, setLoading] = useState(true);

  // Get user info from Firebase Auth
  const [userId, setUserId] = useState('anonymous');

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('🔐 Play page: User authenticated:', user.uid);
        setUserId(user.uid);
      } else {
        console.log('🔐 Play page: User not authenticated');
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
      console.log('🔍 Setting up real-time listener for Play page user:', userId);
      
      // Set up real-time listener for user document
      const userRef = doc(firestore, 'users', userId);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          const progress = userData.detectiveAcademy || defaultDetectiveAcademy;
          
          console.log('📊 Play page real-time update received:', progress);
          console.log('   User data:', userData);
          console.log('   Detective academy:', progress);
          setDetectiveData(progress);
          setLoading(false);
        } else {
          console.log('❌ User document not found in Play page');
          setDetectiveData(defaultDetectiveAcademy);
          setLoading(false);
        }
      }, (error) => {
        console.error('❌ Error in Play page real-time listener:', error);
        setDetectiveData(defaultDetectiveAcademy);
        setLoading(false);
      });
      
      // Cleanup function to unsubscribe when component unmounts
      return () => {
        console.log('🔍 Cleaning up Play page real-time listener');
        unsubscribe();
      };
    } else {
      // Fallback to default data if no user ID
      setDetectiveData(defaultDetectiveAcademy);
      setLoading(false);
    }
  }, [userId]);

  // Generate training departments based on user progress and unlock requirements
  const generateTrainingDepartments = () => {
    return Object.keys(departments).map(deptId => {
      const dept = departments[deptId];
      const isUnlocked = isDepartmentUnlocked(detectiveData, deptId);
      const userDeptProgress = detectiveData.departmentProgress?.[deptId] || { progress: 0, missionsSolved: 0 };
      
      return {
        id: deptId,
        icon: dept.icon,
        title: dept.name,
        description: dept.description,
        progress: userDeptProgress.progress || 0,
        missionsSolved: userDeptProgress.missionsSolved || 0,
        totalMissions: dept.missions.length || 10,
        unlocked: isUnlocked,
        unlockRequirement: getUnlockRequirementText(dept, detectiveData)
      };
    });
  };

  // Generate unlock requirement text for locked departments
  const getUnlockRequirementText = (department, userProgress) => {
    const req = department.unlockRequirements;
    const requirements = [];
    
    if (userProgress.level < req.minimumLevel) {
      requirements.push(`Level ${req.minimumLevel}`);
    }
    
    if (req.previousDepartment && req.minimumMissionsCompleted > 0) {
      const prevDeptName = departments[req.previousDepartment]?.name || req.previousDepartment;
      requirements.push(`${req.minimumMissionsCompleted} missions in ${prevDeptName}`);
    }
    
    return requirements.join(' + ');
  };

  // Generate welcome message based on user experience
  const getWelcomeMessage = () => {
    if (detectiveData.experience === 0) {
      return {
        title: "Welcome to Detective Academy!",
        message: "I'm Detective Alli, your cybersecurity training partner. Here you'll learn to identify and prevent various types of online scams through interactive missions. Start with the Email Crimes Unit to build your foundation - it's perfect for beginners!"
      };
    } else if (detectiveData.level === 1) {
      return {
        title: "Great start, Junior Detective!",
        message: "You're making excellent progress in your cybersecurity journey. Keep practicing with the Email Crimes Unit to strengthen your phishing detection skills. Ready for your next challenge?"
      };
    } else if (detectiveData.level === 2) {
      return {
        title: "Well done, Apprentice Detective!",
        message: "Your detective skills are developing nicely. You've unlocked more advanced training areas. Consider exploring the Social Media Division to expand your expertise."
      };
    } else if (detectiveData.level === 3) {
      return {
        title: "Impressive work, Detective!",
        message: "You've reached a solid level of expertise. Your success rate shows real skill development. Ready to tackle more complex cases in the Financial Crimes division?"
      };
    } else if (detectiveData.level === 4) {
      return {
        title: "Outstanding progress, Senior Detective!",
        message: "You're approaching expert level! Your comprehensive training has prepared you for the most challenging cases. The Elder Fraud Task Force awaits your expertise."
      };
    } else {
      return {
        title: "Exceptional work, Expert Detective!",
        message: "You've reached the pinnacle of detective training! Your experience and success rate demonstrate mastery of cybersecurity principles. You're ready to mentor others and tackle any challenge."
      };
    }
  };

  // Check if user has active mission
  const hasActiveMission = detectiveData.currentMissionId && detectiveData.currentMissionId !== null;

  const handleDepartmentClick = (department) => {
    console.log('Department clicked:', department);
    if (department.unlocked) {
      console.log('Navigating to:', `/training/${department.id}`);
      navigate(`/training/${department.id}`);
    } else {
      console.log('Department is locked');
      // Show unlock requirement info
      alert(`This department is locked. Requirements: ${department.unlockRequirement}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-800 to-indigo-800 w-full">
        <Header variant="home" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading your detective progress...</p>
          </div>
        </main>
        <BottomNav activePage="/play" />
      </div>
    );
  }

  const welcomeMessage = getWelcomeMessage();
  const trainingDepartments = generateTrainingDepartments();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-800 to-indigo-800 w-full">
      {/* Header */}
      <Header variant="home" />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 space-y-6 pt-20 pb-24">
        {/* Welcome Section */}
        <section className="bg-white/95 text-gray-800 p-6 rounded-2xl shadow-sm">
          <div className="flex gap-4 items-start">
            <img src={alliAvatar} alt="Detective Alli" className="w-16 h-16 rounded-full" />
            <div className="flex-1">
              <h2 className="text-gray-800 text-lg font-bold mb-2">{welcomeMessage.title}</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {welcomeMessage.message}
              </p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex gap-4">
          <button className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl hover:bg-white/15 hover:border-white/30 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div className="text-left">
                <div className="text-white font-semibold text-sm">Achievements</div>
                <div className="text-white/70 text-xs">View your badges</div>
              </div>
            </div>
          </button>
          <button className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl hover:bg-white/15 hover:border-white/30 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div className="text-left">
                <div className="text-white font-semibold text-sm">My Progress</div>
                <div className="text-xs text-white/70">Track your stats</div>
              </div>
            </div>
          </button>
        </section>

        {/* Active Mission - Only show if user has active mission */}
        {hasActiveMission && (
          <section className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📋</span>
              <h3 className="text-yellow-400 font-bold text-sm">ACTIVE MISSION</h3>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-white font-bold text-base mb-1">Continue Your Mission</h4>
                <p className="text-white/80 text-sm">You have an active investigation in progress</p>
              </div>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-semibold">
                CONTINUE
              </button>
            </div>
          </section>
        )}

        {/* Training Departments */}
        <section className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-lg">🏛️</span>
            <h3 className="text-white font-bold text-lg">Training Departments</h3>
          </div>
          
          <div className="space-y-4">
            {trainingDepartments.map((department) => (
              <div
                key={department.id}
                onClick={() => handleDepartmentClick(department)}
                className={`bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  department.unlocked 
                    ? 'hover:bg-white/15 hover:border-white/30 hover:-translate-y-1' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{department.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-bold text-base">{department.title}</h4>
                      {!department.unlocked && (
                        <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded">
                          {department.unlockRequirement}
                        </span>
                      )}
                    </div>
                    <p className="text-white/80 text-sm mb-3">{department.description}</p>
                    
                    {department.unlocked ? (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-white/70">
                            {department.missionsSolved}/{department.totalMissions} Missions Solved
                          </span>
                          <span className="text-xs text-white font-semibold">
                            {department.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${department.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-white/70">
                            0/{department.totalMissions} Missions Solved
                          </span>
                          <span className="text-xs text-white/70 font-semibold">
                            0%
                          </span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div className="bg-gray-400 h-2 rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4">Your Detective Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{detectiveData.experience || 0}</div>
              <div className="text-xs text-white/70">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{detectiveData.missionsCompleted}</div>
              <div className="text-xs text-white/70">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{detectiveData.successRate}%</div>
              <div className="text-xs text-white/70">Success Rate</div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <BottomNav activePage="/play" />
    </div>
  );
};

export default Play;