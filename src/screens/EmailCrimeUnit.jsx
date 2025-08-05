import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import MissionCard from '../components/MissionCard';

const EmailCrimeUnit = () => {
  console.log('EmailCrimeUnit component rendered');
  const navigate = useNavigate();

  const beginnerMissions = [
    {
      id: 'know-the-lingo',
      title: 'Know the Lingo',
      description: 'Learn basic email security terminology and common attack types.',
      status: 'completed',
      icon: '📧'
    },
    {
      id: 'spot-red-flags',
      title: 'Spot the Red Flags',
      description: 'Practice identifying obvious phishing attempts and suspicious elements.',
      status: 'completed',
      icon: '🔍'
    },
    {
      id: 'email-imposter',
      title: 'The Email Imposter',
      description: 'Investigate a CEO impersonation scam targeting the finance department.',
      status: 'in-progress',
      icon: '🏢'
    }
  ];

  const advancedMissions = [
    {
      id: 'spear-phishing',
      title: 'The Spear Phishing Campaign',
      description: 'Analyze a targeted attack using personal information to gain credibility.',
      status: 'available',
      icon: '🎣'
    },
    {
      id: 'fake-account',
      title: 'Fake Account Notification',
      description: 'Investigate emails claiming account suspension that steal login credentials.',
      status: 'available',
      icon: '🏪'
    },
    {
      id: 'wire-transfer',
      title: 'The Wire Transfer Trap',
      description: 'Complex business email compromise with multiple layers of deception.',
      status: 'available',
      icon: '💸'
    }
  ];

  const expertMissions = [
    {
      id: 'perfect-impersonation',
      title: 'The Perfect Impersonation',
      description: 'Account Notification impersonation login credentials.',
      status: 'available',
      icon: '🎭'
    }
  ];

  const handleMissionClick = (mission) => {
    if (mission.status === 'completed') {
      console.log('Mission completed - show replay option');
    } else if (mission.status === 'available' || mission.status === 'in-progress') {
      console.log('Starting mission:', mission.title);
      navigate(`/mission/${mission.id}/introduction`);
    }
  };



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
        <section className="w-full">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <h2 className="text-yellow-500 font-bold text-lg">Beginner Training</h2>
            </div>
            
            <div className="space-y-4">
              {beginnerMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onClick={handleMissionClick}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Mission Section */}
        <section className="w-full">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <h2 className="text-yellow-500 font-bold text-lg">Advanced Mission</h2>
            </div>
            
            <div className="space-y-4">
              {advancedMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onClick={handleMissionClick}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Expert Investigations Section */}
        <section className="w-full">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <h2 className="text-yellow-500 font-bold text-lg">Expert Investigations</h2>
            </div>
            
            <div className="space-y-4">
              {expertMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onClick={handleMissionClick}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <BottomNav activePage="/play" />
    </div>
  );
};

export default EmailCrimeUnit;