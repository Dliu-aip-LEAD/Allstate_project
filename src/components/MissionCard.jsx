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
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onClick(mission)}
      className={`bg-slate-700 bg-opacity-50 rounded-xl p-4 cursor-pointer hover:bg-slate-600 hover:shadow-lg transition-all ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{mission.icon}</span>
            <h3 className="text-white font-semibold text-base">{mission.title}</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{mission.description}</p>
        </div>
        <div className="flex items-center">
          {getStatusDisplay(mission.status)}
        </div>
      </div>
    </div>
  );
};

export default MissionCard; 