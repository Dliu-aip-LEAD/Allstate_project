import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import BottomNav from '../components/BottomNav';
import { missions } from '../data/missions';

const MissionIntroduction = () => {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mission data from missions.js
    if (missionId && missions[missionId]) {
      setMission(missions[missionId]);
    } else {
      // Fallback to default mission if not found
      setMission(missions['know-the-lingo']);
    }
    setLoading(false);
  }, [missionId]);

  // Generate mission introduction data based on mission content
  const generateMissionIntroduction = (missionData) => {
    if (!missionData) return null;

    // Generate subtitle based on mission type and difficulty
    const getSubtitle = () => {
      const typeMap = {
        'terminology': 'Terminology & Concepts Training',
        'email': 'Email Security Investigation',
        'social-media': 'Social Media Scam Analysis'
      };
      return typeMap[missionData.content.type] || 'Security Training Mission';
    };

    // Generate detective message based on mission content
    const getDetectiveMessage = () => {
      const baseMessage = missionData.content.scenario;
      
      // Add specific guidance based on mission type
      let additionalGuidance = '';
      if (missionData.content.type === 'terminology') {
        additionalGuidance = "This training will help you understand the fundamental concepts and terminology used in cybersecurity. Pay attention to each definition and how it applies to real-world scenarios.";
      } else if (missionData.content.type === 'email') {
        additionalGuidance = "Carefully examine the email content, sender information, and any suspicious elements. Look for patterns that indicate phishing attempts or other email-based scams.";
      } else if (missionData.content.type === 'social-media') {
        additionalGuidance = "Analyze the social media profile and content for signs of manipulation or deception. Focus on identifying red flags that suggest this might be a scam.";
      }

      return [baseMessage, additionalGuidance];
    };

    // Generate objectives based on mission content
    const getObjectives = () => {
      const objectives = [];
      
      // Add clue identification objective
      if (missionData.content.clues) {
        const clueCount = Object.keys(missionData.content.clues).length;
        objectives.push({
          id: 1,
          title: 'Identify Security Threats',
          description: `Spot and analyze ${clueCount} suspicious elements or red flags in the provided content.`
        });
      }

      // Add quiz completion objective
      if (missionData.content.quizzes) {
        const quizCount = Object.keys(missionData.content.quizzes).length;
        objectives.push({
          id: 2,
          title: 'Complete Security Quizzes',
          description: `Answer ${quizCount} questions to test your understanding of the security concepts.`
        });
      }

      // Add score achievement objective
      objectives.push({
        id: 3,
        title: 'Achieve Target Score',
        description: `Earn at least ${Math.round(missionData.scoring.maxScore * 0.7)} points to demonstrate mastery of the material.`
      });

      return objectives;
    };

    // Generate XP reward based on difficulty
    const getXPReward = () => {
      const difficultyMultiplier = {
        'beginner': 1,
        'intermediate': 1.2,
        'advanced': 1.5,
        'expert': 2
      };
      
      const baseXP = 50;
      return Math.round(baseXP * (difficultyMultiplier[missionData.difficulty] || 1));
    };

    return {
      id: missionData.id,
      title: missionData.title,
      subtitle: getSubtitle(),
      xpReward: getXPReward(),
      estimatedTime: `${missionData.estimatedTime} minutes`,
      difficulty: missionData.difficulty,
      maxScore: missionData.scoring.maxScore,
      detective: {
        name: 'Detective Alli',
        role: `Lead Training Officer • ${missionData.department.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Unit`,
        avatar: '🕵️',
        message: getDetectiveMessage()
      },
      objectives: getObjectives(),
      content: missionData.content
    };
  };

  const handleBeginInvestigation = () => {
    navigate(`/mission/${mission.id}/investigation`);
  };

  const handleGoBackToAcademy = () => {
    // Navigate back to the appropriate department based on mission
    if (mission && mission.department) {
      navigate(`/training/${mission.department}`);
    } else {
      // Fallback to email-crimes if department is not specified
      navigate('/training/email-crimes');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-700">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading mission details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-700">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-xl mb-4">Mission not found</p>
            <button
              onClick={handleGoBackToAcademy}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Return to Academy
            </button>
          </div>
        </div>
      </div>
    );
  }

  const missionIntro = generateMissionIntroduction(mission);

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'from-green-500 to-green-600',
      'intermediate': 'from-blue-500 to-blue-600',
      'advanced': 'from-yellow-500 to-yellow-600',
      'expert': 'from-red-500 to-red-600'
    };
    return colors[difficulty] || 'from-gray-500 to-gray-600';
  };

  // Get difficulty label
  const getDifficultyLabel = (difficulty) => {
    const labels = {
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'expert': 'Expert'
    };
    return labels[difficulty] || difficulty;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-700">
      {/* Header */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md border-b border-white border-opacity-10 px-4 py-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <BackButton onClick={handleGoBackToAcademy} />
            <div className="text-white text-sm opacity-70">
              {mission?.department === 'social-media' ? 'Social Media Unit' : 'Email Crimes Unit'} • Mission Introduction
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
        {/* Case Header */}
        <div className="bg-white bg-opacity-95 rounded-2xl overflow-hidden mb-6 shadow-lg">
          <div className={`bg-gradient-to-r ${getDifficultyColor(mission.difficulty)} p-6 relative`}>
            <div className="absolute inset-0 opacity-10">
              <div className="text-6xl text-center pt-4">🚨</div>
            </div>
            <div className="relative z-10">
              <div className="bg-white bg-opacity-20 inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
                🔒 {getDifficultyLabel(mission.difficulty)} • Training Mission
              </div>
              <h1 className="text-white text-2xl font-bold mb-2">{missionIntro.title}</h1>
              <p className="text-white text-sm opacity-90">{missionIntro.subtitle}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50">
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                XP REWARD
              </div>
              <div className="text-sm font-bold text-gray-800">
                {missionIntro.xpReward} Points
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                ESTIMATED TIME
              </div>
              <div className="text-sm font-bold text-gray-800">
                {missionIntro.estimatedTime}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                MAX SCORE
              </div>
              <div className="text-sm font-bold text-gray-800">
                {missionIntro.maxScore} Points
              </div>
            </div>
          </div>
        </div>

        {/* Detective Briefing */}
        <div className="bg-white bg-opacity-95 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-3xl">
              {missionIntro.detective.avatar}
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{missionIntro.detective.name}</div>
              <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {missionIntro.detective.role}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            {missionIntro.detective.message.map((message, index) => (
              <p key={index} className="text-sm text-gray-700 leading-relaxed mb-3 last:mb-0">
                {message}
              </p>
            ))}
          </div>
        </div>

        {/* Mission Objectives */}
        <div className="bg-white bg-opacity-95 rounded-2xl p-6 mb-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>Mission Objectives</span>
          </h2>
          
          <div className="space-y-3">
            {missionIntro.objectives.map((objective) => (
              <div key={objective.id} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border-l-4 border-green-500">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {objective.id}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    {objective.title}
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    {objective.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white bg-opacity-95 rounded-2xl p-6 text-center shadow-lg">
          <div className="mb-6">
            <div className="text-lg font-semibold text-gray-800 mb-2">
              Ready to Start Your Investigation?
            </div>
            <div className="text-xs text-gray-600">
              Take your time and examine every detail - real detective work requires patience
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleBeginInvestigation}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all shadow-lg"
            >
              🚀 Begin Investigation
            </button>
            <button
              onClick={handleGoBackToAcademy}
              className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all border border-gray-200"
            >
              Go Back to Academy
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default MissionIntroduction; 