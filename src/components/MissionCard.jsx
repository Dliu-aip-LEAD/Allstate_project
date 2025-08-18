import React from 'react';

const MissionCard = ({ mission, onClick, className = '' }) => {
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'completed':
        return <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">COMPLETED</span>;
      case 'in-progress':
        return <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">IN PROGRESS</span>;
      case 'available':
        return <span className="text-yellow-500 text-xl">!</span>;
      case 'locked':
        return <span className="text-gray-400 text-xl">🔒</span>;
      default:
        return null;
    }
  };

  const isLocked = mission.status === 'locked';
  const canClick = !isLocked;

  return (
    <div
      onClick={() => canClick && onClick(mission)}
      className={`bg-slate-700 bg-opacity-50 rounded-xl p-4 transition-all ${
        canClick 
          ? 'cursor-pointer hover:bg-slate-600 hover:shadow-lg' 
          : 'cursor-not-allowed opacity-60'
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-2xl ${isLocked ? 'opacity-50' : ''}`}>{mission.icon}</span>
            <h3 className={`font-semibold text-base ${isLocked ? 'text-gray-400' : 'text-white'}`}>
              {mission.title}
            </h3>
          </div>
          <p className={`text-sm leading-relaxed ${isLocked ? 'text-gray-500' : 'text-gray-300'}`}>
            {mission.description}
          </p>
          
          {/* Mission details */}
          <div className="flex items-center gap-4 mt-3 text-xs">
            <span className={`${isLocked ? 'text-gray-500' : 'text-gray-400'}`}>
              ⏱️ {mission.estimatedTime} min
            </span>
            <span className={`${isLocked ? 'text-gray-500' : 'text-gray-400'}`}>
              🎯 {mission.XPReward} pts
            </span>
            <span className={`${isLocked ? 'text-gray-500' : 'text-gray-400'}`}>
              📊 {mission.difficulty}
            </span>
          </div>
          
          {/* Unlock requirements for locked missions */}
          {isLocked && mission.unlockRequirement && (
            <div className="mt-3 p-2 bg-gray-800/40 rounded-lg border border-gray-600/20">
              <div className="text-xs text-gray-400 mb-1">🔒 Unlock Requirements:</div>
              <div className="text-xs text-gray-300 font-medium">
                {mission.unlockRequirement}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center">
          {getStatusDisplay(mission.status)}
        </div>
      </div>
    </div>
  );
};

export default MissionCard; 