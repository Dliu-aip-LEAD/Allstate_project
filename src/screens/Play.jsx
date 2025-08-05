import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import alliAvatar from '../assets/onboard1.png';

const Play = () => {
  const navigate = useNavigate();

  const trainingDepartments = [
    {
      id: 'email-crimes',
      icon: '📧',
      title: 'Email Crimes Unit',
      description: 'Master phishing detection, spoofing, and email security',
      progress: 70,
      missionsSolved: 7,
      totalMissions: 10,
      unlocked: true
    },
    {
      id: 'social-media',
      icon: '📱',
      title: 'Social Media Division',
      description: 'Combat fake profiles, romance scams, and social engineering',
      progress: 30,
      missionsSolved: 3,
      totalMissions: 10,
      unlocked: true
    },
    {
      id: 'financial-crimes',
      icon: '💰',
      title: 'Financial Crimes',
      description: 'Investigate payment scams, fake banks, and crypto fraud',
      progress: 0,
      missionsSolved: 0,
      totalMissions: 10,
      unlocked: true
    },
    {
      id: 'elder-fraud',
      icon: '👴',
      title: 'Elder Fraud Task Force',
      description: 'Specialized training for protecting vulnerable populations',
      progress: 0,
      missionsSolved: 0,
      totalMissions: 10,
      unlocked: false,
      unlockRequirement: 'Expert Detective'
    }
  ];

  const handleDepartmentClick = (department) => {
    console.log('Department clicked:', department);
    if (department.unlocked) {
      console.log('Navigating to:', `/training/${department.id}`);
      navigate(`/training/${department.id}`);
    } else {
      console.log('Department is locked');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      {/* Header */}
      <Header variant="home" />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 space-y-6 pt-20 pb-24">
        {/* Welcome Section */}
        <section className="bg-[#E6F0FF] p-6 rounded-2xl shadow-sm">
          <div className="flex gap-4 items-start">
            <img src={alliAvatar} alt="Detective Alli" className="w-16 h-16 rounded-full" />
            <div className="flex-1">
              <h2 className="text-[#0033A0] text-lg font-bold mb-2">Welcome back, Detective!</h2>
              <p className="text-[#0033A0] text-sm leading-relaxed">
                I've prepared new training missions based on the latest scam trends. Your email detection skills are improving - ready to tackle some trickier cases?
              </p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex gap-4">
          <button className="flex-1 bg-[#E6F0FF] p-4 rounded-xl shadow-sm hover:bg-[#d0e7ff] transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div className="text-left">
                <div className="text-[#0033A0] font-semibold text-sm">Achievements</div>
                <div className="text-[#0033A0] text-xs opacity-70">View your badges</div>
              </div>
            </div>
          </button>
          <button className="flex-1 bg-[#E6F0FF] p-4 rounded-xl shadow-sm hover:bg-[#d0e7ff] transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div className="text-left">
                <div className="text-[#0033A0] font-semibold text-sm">My Progress</div>
                <div className="text-[#0033A0] text-xs opacity-70">Track your stats</div>
              </div>
            </div>
          </button>
        </section>

        {/* Active Mission */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📋</span>
            <h3 className="text-[#FFD700] font-bold text-sm">ACTIVE MISSION</h3>
          </div>
          
          <div className="bg-[#E6F0FF] p-4 rounded-xl flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-[#0033A0] font-bold text-base mb-1">The Email Imposter</h4>
              <p className="text-[#0033A0] text-sm opacity-80">Detective Alli needs your help identifying suspicious emails</p>
            </div>
            <button className="bg-[#00C853] text-white px-4 py-2 rounded-lg text-xs font-semibold">
              IN PROGRESS
            </button>
          </div>
        </section>

        {/* Training Departments */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-lg">🏛️</span>
            <h3 className="text-[#0033A0] font-bold text-lg">Training Departments</h3>
          </div>
          
          <div className="space-y-4">
            {trainingDepartments.map((department) => (
              <div
                key={department.id}
                onClick={() => handleDepartmentClick(department)}
                className={`bg-[#E6F0FF] p-4 rounded-xl cursor-pointer transition-all ${
                  department.unlocked 
                    ? 'hover:bg-[#d0e7ff] hover:shadow-md' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{department.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[#0033A0] font-bold text-base">{department.title}</h4>
                      {!department.unlocked && (
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          Unlocks at {department.unlockRequirement}
                        </span>
                      )}
                    </div>
                    <p className="text-[#0033A0] text-sm mb-3 opacity-80">{department.description}</p>
                    
                    {department.unlocked ? (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-[#0033A0] opacity-70">
                            {department.missionsSolved}/{department.totalMissions} Missions Solved
                          </span>
                          <span className="text-xs text-[#0033A0] font-semibold">
                            {department.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2">
                          <div 
                            className="bg-[#00C853] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${department.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full bg-white rounded-full h-2">
                        <div className="bg-gray-300 h-2 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-[#0033A0] font-bold text-lg mb-4">Your Detective Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#0033A0]">10</div>
              <div className="text-xs text-gray-600">Total Missions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00C853]">7</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FF6D00]">70%</div>
              <div className="text-xs text-gray-600">Success Rate</div>
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