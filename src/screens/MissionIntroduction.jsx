import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import BottomNav from '../components/BottomNav';

const MissionIntroduction = () => {
  const navigate = useNavigate();
  const { missionId } = useParams();

  // Mission data - this would come from a database in a real app
  const missionData = {
    'email-imposter': {
      id: 'email-imposter',
      title: 'Mission #3: The Email Imposter',
      subtitle: 'Business Email Compromise Investigation',
      xpReward: 50,
      estimatedTime: '5-8 minutes',
      detective: {
        name: 'ChiefDetective Alli',
        role: 'Lead Training Officer • Email Crimes Unit',
        avatar: '🕵️',
        message: [
          "Detective, we've got a classic business email compromise case for your training. A small company received an email that appears to be from their CEO requesting an urgent wire transfer.",
          "The finance team is about to send $15,000 to what they believe is a legitimate business expense. Your job is to analyze the email and identify the red flags that reveal this as a scam."
        ]
      },
      objectives: [
        {
          id: 1,
          title: 'Identify Red Flags',
          description: 'Spot at least 3 suspicious elements in the email content and structure.'
        },
        {
          id: 2,
          title: 'Assess Urgency Tactics',
          description: 'Recognize psychological manipulation techniques used by scammers.'
        },
        {
          id: 3,
          title: 'Recommend Actions',
          description: 'Provide appropriate response steps for the company\'s finance team.'
        }
      ]
    }
  };

  const mission = missionData[missionId] || missionData['email-imposter'];

  const handleBeginInvestigation = () => {
    navigate(`/mission/${mission.id}/investigation`);
  };

  const handleGoBackToAcademy = () => {
    navigate('/training/email-crimes');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-700">
      {/* Header */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md border-b border-white border-opacity-10 px-4 py-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <BackButton onClick={() => navigate('/training/email-crimes')} />
            <div className="text-white text-sm opacity-70">
              Email Crimes Unit • Mission Introduction
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
        {/* Case Header */}
        <div className="bg-white bg-opacity-95 rounded-2xl overflow-hidden mb-6 shadow-lg">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 relative">
            <div className="absolute inset-0 opacity-10">
              <div className="text-6xl text-center pt-4">🚨</div>
            </div>
            <div className="relative z-10">
              <div className="bg-white bg-opacity-20 inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
                🔒 Confidential • Training Mission
              </div>
              <h1 className="text-white text-2xl font-bold mb-2">{mission.title}</h1>
              <p className="text-white text-sm opacity-90">{mission.subtitle}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50">
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                XP REWARD
              </div>
              <div className="text-sm font-bold text-gray-800">
                {mission.xpReward} Points
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                ESTIMATED TIME
              </div>
              <div className="text-sm font-bold text-gray-800">
                {mission.estimatedTime}
              </div>
            </div>
          </div>
        </div>

        {/* Detective Briefing */}
        <div className="bg-white bg-opacity-95 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-3xl">
              {mission.detective.avatar}
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{mission.detective.name}</div>
              <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {mission.detective.role}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            {mission.detective.message.map((message, index) => (
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
            {mission.objectives.map((objective) => (
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