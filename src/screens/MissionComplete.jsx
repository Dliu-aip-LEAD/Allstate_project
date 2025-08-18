import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { missions } from '../data/missions';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore, auth } from '../firebase';

const MissionComplete = () => {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const location = useLocation();
  
  // State management
  const [results, setResults] = useState(null);
  const [mission, setMission] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextMission, setNextMission] = useState(null);

  useEffect(() => {
    // Load mission data from missions.js
    if (missionId && missions[missionId]) {
      const missionData = missions[missionId];
      setMission(missionData);
      console.log('📋 Mission data loaded:', missionData);
    }

    // Load results from navigation state or localStorage
    if (location.state?.missionResults) {
      setResults(location.state.missionResults);
      // Also save to localStorage for persistence
      localStorage.setItem(`mission_${missionId}_progress`, JSON.stringify(location.state.missionResults));
      console.log('📊 Results loaded from navigation state:', location.state.missionResults);
    } else {
      // Fallback to localStorage if no state data
      const savedProgress = localStorage.getItem(`mission_${missionId}_progress`);
      if (savedProgress) {
        setResults(JSON.parse(savedProgress));
        console.log('📊 Results loaded from localStorage:', JSON.parse(savedProgress));
      }
    }

    // Set up real-time listener for user progress
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log('🔍 Setting up real-time listener for user:', currentUser.uid);
      
      const userRef = doc(firestore, 'users', currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          const progress = userData.detectiveAcademy || {};
          
          console.log('📊 Real-time user progress update received:', progress);
          setUserProgress(progress);
          
          // Find next available mission
          if (mission && progress.departmentProgress) {
            const nextMissionData = findNextMission(mission, progress);
            setNextMission(nextMissionData);
          }
          
          setLoading(false);
        } else {
          console.log('❌ User document not found');
          setLoading(false);
        }
      }, (error) => {
        console.error('❌ Error in real-time listener:', error);
        setLoading(false);
      });
      
      return () => {
        console.log('🔍 Cleaning up real-time listener');
        unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, [missionId, location.state]);

  // Find next available mission based on current progress
  const findNextMission = (currentMission, userProgress) => {
    if (!currentMission || !userProgress.departmentProgress) return null;
    
    const department = currentMission.department;
    const departmentMissions = missions[department]?.missions || [];
    const currentIndex = departmentMissions.findIndex(m => m.id === currentMission.id);
    
    if (currentIndex === -1 || currentIndex >= departmentMissions.length - 1) return null;
    
    // Check if next mission is unlocked
    const nextMission = departmentMissions[currentIndex + 1];
    const isUnlocked = isMissionUnlocked(nextMission, userProgress);
    
    return isUnlocked ? nextMission : null;
  };

  // Check if mission is unlocked based on user progress
  const isMissionUnlocked = (mission, userProgress) => {
    if (!mission || !userProgress) return false;
    
    // Check level requirement
    if (userProgress.level < (mission.requiredLevel || 1)) return false;
    
    // Check if previous mission is completed
    if (mission.requiredMission) {
      const missionHistory = userProgress.missionHistory || [];
      const previousCompleted = missionHistory.some(m => m.missionId === mission.requiredMission);
      if (!previousCompleted) return false;
    }
    
    return true;
  };

  const handleReplayMission = () => {
    // Clear the saved progress
    localStorage.removeItem(`mission_${missionId}_progress`);
    // Navigate back to investigation
    navigate(`/mission/${missionId}/investigation`);
  };

  const handleReturnToAcademy = () => {
    navigate('/play');
  };

  const handleNextMission = () => {
    if (nextMission) {
      // Navigate to next mission introduction
      navigate(`/mission/${nextMission.id}/introduction`);
    } else {
      // Navigate to department page if no next mission
      const department = mission?.department || 'email-crimes';
      navigate(`/training/${department}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-600 to-green-700">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold mb-2">Loading Results...</h1>
            <p className="text-green-100">Please wait while we calculate your performance.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results || !mission) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-600 to-green-700">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-2">Results Not Found</h1>
            <p className="text-green-100">Unable to load mission results. Please try again.</p>
            <button
              onClick={() => navigate('/play')}
              className="mt-4 bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              Return to Academy
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A+', label: 'Outstanding Detective Work', color: 'text-green-600' };
    if (score >= 80) return { grade: 'A', label: 'Excellent Investigation', color: 'text-green-600' };
    if (score >= 70) return { grade: 'B+', label: 'Good Detective Work', color: 'text-blue-600' };
    if (score >= 60) return { grade: 'B', label: 'Satisfactory Investigation', color: 'text-yellow-600' };
    return { grade: 'C', label: 'Needs Improvement', color: 'text-red-600' };
  };

  const grade = getGrade(results.score);

  // Calculate progress to next level
  const currentLevel = userProgress?.level || 1;
  const currentExp = userProgress?.experience || 0;
  const expToNext = userProgress?.experienceToNextLevel || 100;
  const progressPercentage = Math.min((currentExp / expToNext) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-600 to-green-700">
      {/* Celebration Header */}
      <div className="text-center py-10 px-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-24 h-24 bg-white bg-opacity-20 border-2 border-white border-opacity-30 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-pulse">
            🎉
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Mission Completed!</h1>
          <p className="text-green-100 text-lg">{mission.title} Investigation Complete</p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-6 max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          
          {/* Performance Summary */}
          <div className="bg-white bg-opacity-95 rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-green-600 mb-2 flex items-center justify-center gap-3">
              <span>🏆</span>
              <span>{results.score}</span>
            </div>
            <div className="text-gray-600 mb-6">Total Investigation Score</div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{results.flagsFound}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Red Flags Found</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{results.accuracy}%</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Accuracy Rate</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{results.totalQuestions}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Total Questions</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{results.correctAnswers}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Correct Answers</div>
              </div>
            </div>

            {/* Grade Display */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4">
              <div className={`text-3xl font-bold ${grade.color} mb-2`}>{grade.grade}</div>
              <div className="text-gray-700 font-medium">{grade.label}</div>
            </div>
          </div>

          {/* Real-time Rank Progress */}
          {userProgress && (
            <div className="bg-white bg-opacity-95 rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">🎖️ Detective Rank Progress</h3>
                <p className="text-sm text-gray-600">Current Level: {userProgress.levelName || `Level ${userProgress.level}`}</p>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Experience Progress</span>
                  <span className="text-sm text-gray-600">{userProgress.experience || 0} / {expToNext} XP</span>
                </div>
                <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{userProgress.level || 1}</div>
                  <div className="text-xs text-gray-600">Current Level</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{userProgress.experience || 0}</div>
                  <div className="text-xs text-gray-600">Total XP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{userProgress.missionsCompleted || 0}</div>
                  <div className="text-xs text-gray-600">Missions Completed</div>
                </div>
              </div>
            </div>
          )}

          {/* Evidence Summary */}
          <div className="bg-white bg-opacity-95 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-bold text-gray-800">🚩 Red Flags Identified</h3>
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {results.flagsFound} Found
              </div>
            </div>
            
            <div className="space-y-2">
              {results.evidence && results.evidence.map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="text-sm text-red-800 font-medium">
                    {typeof item === 'string' ? item : item.redFlag || item.text || item.title || 'Evidence found'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Mission Info */}
          {nextMission && (
            <div className="bg-white bg-opacity-95 rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">🎯 Next Mission Available!</h3>
                <p className="text-sm text-gray-600">You've unlocked the next challenge</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">
                    🚀
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{nextMission.title}</h4>
                    <p className="text-sm text-gray-600">{nextMission.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {nextMission.difficulty}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {nextMission.estimatedTime} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white bg-opacity-95 rounded-2xl p-6 text-center shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 Ready for Your Next Investigation?</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleNextMission}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all shadow-lg"
              >
                {nextMission ? '🚀 Go to Next Mission' : '🏢 Return to Department'}
              </button>
              
              <button
                onClick={handleReplayMission}
                className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-600 transition-all"
              >
                🔄 Replay This Case
              </button>
              
              <button
                onClick={handleReturnToAcademy}
                className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all border border-gray-200"
              >
                🏛️ Return to Academy
              </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              🎉 Share your detective success with friends and help them stay safe online!
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MissionComplete; 