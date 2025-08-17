import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import MissionCard from '../components/MissionCard';
import { missions } from '../data/missions';
import { getUserProgress, defaultDetectiveAcademy } from '../utils/userProgress';

const EmailCrimeUnit = () => {
  console.log('EmailCrimeUnit component rendered');
  const navigate = useNavigate();
  const location = useLocation();
  const [detectiveData, setDetectiveData] = useState(defaultDetectiveAcademy);
  const [loading, setLoading] = useState(true);

  // Get user info from location state or localStorage
  const userInfo = location.state?.userInfo || JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userId = userInfo.uid || 'anonymous';

  // Load user progress data
  useEffect(() => {
    const loadUserProgress = async () => {
      if (userId && userId !== 'anonymous') {
        try {
          const progress = await getUserProgress(userId);
          if (progress) {
            setDetectiveData(progress);
          }
        } catch (error) {
          console.error('Error loading user progress:', error);
        }
      }
      setLoading(false);
    };

    loadUserProgress();
  }, [userId]);

  // Generate missions based on user progress and unlock requirements
  const generateMissions = () => {
    const emailCrimesMissions = [
      'know-the-lingo',
      'spot-red-flags',
      'email-imposter',
      'spear-phishing',
      'fake-account',
      'wire-transfer',
      'perfect-impersonation'
    ];

    return emailCrimesMissions.map(missionId => {
      const mission = missions[missionId];
      if (!mission) return null;

      // Check if mission is unlocked
      const isUnlocked = isMissionUnlocked(missionId);
      
      // Get mission status
      const status = getMissionStatus(missionId);
      
      // Get unlock requirement text for locked missions
      const unlockRequirement = !isUnlocked ? getUnlockRequirementText(mission) : null;

      return {
        id: missionId,
        title: mission.title,
        description: mission.description,
        status: status,
        icon: getMissionIcon(missionId),
        difficulty: mission.difficulty,
        estimatedTime: mission.estimatedTime,
        maxScore: mission.scoring.maxScore,
        unlocked: isUnlocked,
        unlockRequirement: unlockRequirement
      };
    }).filter(Boolean);
  };

  // Check if mission is unlocked based on user progress
  const isMissionUnlocked = (missionId) => {
    const mission = missions[missionId];
    if (!mission) return false;

    const requirements = mission.unlockRequirements;
    
    // Check level requirement
    if (detectiveData.level < requirements.minimumLevel) {
      return false;
    }
    
    // Check previous missions requirement
    if (requirements.previousMissions.length > 0) {
      for (const prevMissionId of requirements.previousMissions) {
        const prevMission = missions[prevMissionId];
        if (prevMission) {
          const prevMissionStatus = getMissionStatus(prevMissionId);
          if (prevMissionStatus !== 'completed') {
            return false;
          }
        }
      }
    }
    
    // Check minimum score requirement
    if (requirements.minimumScore > 0) {
      const userScore = detectiveData.departmentProgress?.['email-crimes']?.score || 0;
      if (userScore < requirements.minimumScore) {
        return false;
      }
    }
    
    return true;
  };

  // Get mission status
  const getMissionStatus = (missionId) => {
    // Check if mission is completed
    const completedMissions = detectiveData.completedMissions || [];
    if (completedMissions.includes(missionId)) {
      return 'completed';
    }
    
    // Check if mission is in progress
    if (detectiveData.currentMissionId === missionId) {
      return 'in-progress';
    }
    
    // Check if mission is unlocked
    if (isMissionUnlocked(missionId)) {
      return 'available';
    }
    
    return 'locked';
  };

  // Get unlock requirement text for locked missions
  const getUnlockRequirementText = (mission) => {
    const requirements = [];
    
    if (detectiveData.level < mission.unlockRequirements.minimumLevel) {
      requirements.push(`Level ${mission.unlockRequirements.minimumLevel}`);
    }
    
    if (mission.unlockRequirements.previousMissions.length > 0) {
      const prevMissionNames = mission.unlockRequirements.previousMissions
        .map(id => missions[id]?.title || id)
        .join(', ');
      requirements.push(`Complete: ${prevMissionNames}`);
    }
    
    if (mission.unlockRequirements.minimumScore > 0) {
      requirements.push(`Score: ${mission.unlockRequirements.minimumScore}`);
    }
    
    return requirements.join(' + ');
  };

  // Get mission icon based on mission ID
  const getMissionIcon = (missionId) => {
    const iconMap = {
      'know-the-lingo': '📚',
      'spot-red-flags': '🔍',
      'email-imposter': '🏢',
      'spear-phishing': '🎣',
      'fake-account': '🏪',
      'wire-transfer': '💸',
      'perfect-impersonation': '🎭'
    };
    return iconMap[missionId] || '📋';
  };

  // Group missions by difficulty
  const groupMissionsByDifficulty = (missions) => {
    const grouped = {
      beginner: [],
      intermediate: [],
      advanced: [],
      expert: []
    };

    missions.forEach(mission => {
      if (grouped[mission.difficulty]) {
        grouped[mission.difficulty].push(mission);
      }
    });

    return grouped;
  };

  const handleMissionClick = (mission) => {
    if (mission.status === 'completed') {
      console.log('Mission completed - show replay option');
      // TODO: Implement replay functionality
    } else if (mission.status === 'available' || mission.status === 'in-progress') {
      console.log('Starting mission:', mission.title);
      navigate(`/mission/${mission.id}/introduction`);
    } else if (mission.status === 'locked') {
      console.log('Mission is locked');
      // Show unlock requirement info
      alert(`This mission is locked. Requirements: ${mission.unlockRequirement}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-700 w-full">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-6 pt-20 w-full">
          <div className="w-full px-4">
            <div className="flex items-center gap-2 text-white text-sm opacity-80 mb-4">
              <span>Detective Academy</span>
              <span>›</span>
              <span>Email Crimes Unit</span>
            </div>
            
            <h1 className="text-white text-3xl font-bold mb-2">Email Crime Unit</h1>
            <p className="text-white text-base opacity-90">
              Specializing in phishing, impersonation, and email-based fraud detection
            </p>
          </div>
        </div>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading your mission progress...</p>
          </div>
        </main>
        <BottomNav activePage="/play" />
      </div>
    );
  }

  const allMissions = generateMissions();
  const groupedMissions = groupMissionsByDifficulty(allMissions);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-700 w-full">
      {/* Header*/}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-6 pt-20 w-full">
        <div className="w-full px-4">
          <div className="flex items-center gap-2 text-white text-sm opacity-80 mb-4">
            <span>Detective Academy</span>
            <span>›</span>
            <span>Email Crimes Unit</span>
          </div>
          
          <h1 className="text-white text-3xl font-bold mb-2">Email Crime Unit</h1>
          <p className="text-white text-base opacity-90">
            Specializing in phishing, impersonation, and email-based fraud detection
          </p>
        </div>
      </div>

      {/* Main Content - 移除最大宽度限制 */}
      <main className="flex-1 px-4 py-6 space-y-6 pb-24 w-full">
        {/* Back Button */}
        <div className="w-full">
          <BackButton onClick={() => navigate('/play')} />
        </div>

        {/* Beginner Training Section */}
        {groupedMissions.beginner.length > 0 && (
          <section className="w-full">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <h2 className="text-yellow-500 font-bold text-lg">Beginner Training</h2>
              </div>
              
              <div className="space-y-4">
                {groupedMissions.beginner.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onClick={handleMissionClick}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Intermediate Training Section */}
        {groupedMissions.intermediate.length > 0 && (
          <section className="w-full">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <h2 className="text-yellow-500 font-bold text-lg">Intermediate Training</h2>
              </div>
              
              <div className="space-y-4">
                {groupedMissions.intermediate.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onClick={handleMissionClick}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Advanced Mission Section */}
        {groupedMissions.advanced.length > 0 && (
          <section className="w-full">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <h2 className="text-yellow-500 font-bold text-lg">Advanced Missions</h2>
              </div>
              
              <div className="space-y-4">
                {groupedMissions.advanced.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onClick={handleMissionClick}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Expert Investigations Section */}
        {groupedMissions.expert.length > 0 && (
          <section className="w-full">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <h2 className="text-yellow-500 font-bold text-lg">Expert Investigations</h2>
              </div>
              
              <div className="space-y-4">
                {groupedMissions.expert.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onClick={handleMissionClick}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav activePage="/play" />
    </div>
  );
};

export default EmailCrimeUnit;