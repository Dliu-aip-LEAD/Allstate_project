import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const MissionComplete = () => {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Load mission results from localStorage
    const savedProgress = localStorage.getItem(`mission_${missionId}_progress`);
    if (savedProgress) {
      setResults(JSON.parse(savedProgress));
    }
  }, [missionId]);

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
    // Navigate to next available mission
    navigate('/training/email-crimes');
  };

  if (!results) {
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

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A+', label: 'Outstanding Detective Work', color: 'text-green-600' };
    if (score >= 80) return { grade: 'A', label: 'Excellent Investigation', color: 'text-green-600' };
    if (score >= 70) return { grade: 'B+', label: 'Good Detective Work', color: 'text-blue-600' };
    if (score >= 60) return { grade: 'B', label: 'Satisfactory Investigation', color: 'text-yellow-600' };
    return { grade: 'C', label: 'Needs Improvement', color: 'text-red-600' };
  };

  const grade = getGrade(results.score);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-600 to-green-700">
      {/* Celebration Header */}
      <div className="text-center py-10 px-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-24 h-24 bg-white bg-opacity-20 border-2 border-white border-opacity-30 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-pulse">
            🎉
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Mission Completed!</h1>
          <p className="text-green-100 text-lg">The Email Imposter Investigation Complete</p>
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
                <div className="text-xs text-gray-600 uppercase tracking-wider">Questions Answered</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{results.correctAnswers}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Correct Answers</div>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-full text-sm font-semibold">
              <span>⭐</span>
              <span>{grade.label}</span>
            </div>
          </div>

          {/* Detective Alli Feedback */}
          <div className="bg-white bg-opacity-95 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-2xl text-white flex-shrink-0">
                🕵️
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Outstanding Investigation, Detective!</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  You demonstrated excellent analytical skills by identifying {results.flagsFound} out of 8 possible red flags in this CEO impersonation scam. 
                  Your ability to spot the fake domain and recognize the urgency tactics shows you're developing a sharp eye for 
                  business email compromise attempts.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  This type of scam has cost businesses over $43 billion globally. By mastering these detection skills, 
                  you're helping protect organizations from devastating financial losses.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm text-blue-800">
                    💡 <strong>Pro Tip:</strong> You missed the unusually simple signature. Real CEO emails typically include detailed contact information and company disclaimers.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rank Progress */}
          <div className="bg-white bg-opacity-95 rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">🎖️ Detective Rank Progress</h3>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg mx-auto mb-2">
                  🕵️
                </div>
                <div className="text-xs font-semibold text-blue-600">Junior Detective</div>
              </div>
              <div className="text-2xl text-green-500">→</div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white text-lg mx-auto mb-2">
                  👨‍💼
                </div>
                <div className="text-xs font-semibold text-gray-600">Senior Detective</div>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-1000"
                  style={{ width: `${Math.min((results.score / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>{results.score} XP</span>
              <span>Only {100 - results.score} XP to Senior Detective!</span>
            </div>
          </div>

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
                <div key={item.id} className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="text-sm text-red-800 font-medium">{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white bg-opacity-95 rounded-2xl p-6 text-center shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 Ready for Your Next Investigation?</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleNextMission}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all shadow-lg"
              >
                🚀 Go to the next mission
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