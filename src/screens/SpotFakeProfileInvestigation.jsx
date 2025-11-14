import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import DetectivePanel from '../components/DetectivePanel';
import { missions } from '../data/missions';
import { completeMission } from '../services/missionService';
import { auth } from '../firebase';

// Add CSS styles for responsive layout
const layoutStyles = `
  /* Responsive layout styles */
  @media (min-width: 1280px) {
    .mission-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 1.5rem;
      height: 100%;
      align-items: start;
    }
    
    .mission-layout > div:first-child {
      max-height: calc(100vh - 200px);
      overflow-y: auto;
    }
    
    .mission-layout > div:last-child {
      position: sticky;
      top: 100px;
      max-height: calc(100vh - 200px);
    }
  }
  
  @media (max-width: 1279px) {
    .mission-layout {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  }
`;

const SpotFakeProfileInvestigation = () => {
  const navigate = useNavigate();
  const { missionId } = useParams();

  // State management
  const [score, setScore] = useState(0);
  const [flagsFound, setFlagsFound] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mission, setMission] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null); // accountId of selected fake account
  const [quizAnswers, setQuizAnswers] = useState({}); // { questionId: optionId }
  const [quizFeedback, setQuizFeedback] = useState({}); // { questionId: { isCorrect, feedback } }
  const [accountSelectionFeedback, setAccountSelectionFeedback] = useState(null);

  // Initialize messages
  const initializeMessages = (missionData) => {
    if (missionData.content.type === 'social-media-accounts') {
      const initialMessages = [
        {
          id: 1,
          sender: 'alli',
          text: missionData.content.scenario || "Welcome! Analyze these social media accounts carefully to identify which one is fake."
        },
        {
          id: 2,
          sender: 'alli',
          text: missionData.content.comparisonSetup?.instruction || "One of these accounts is REAL, one is FAKE. Study the details carefully!"
        }
      ];
      setMessages(initialMessages);
    }
  };

  const addMessage = (text, sender = 'alli') => {
    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender,
      text
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addEvidence = (text) => {
    const newEvidence = {
      id: `evid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text
    };
    setEvidence(prev => [...prev, newEvidence]);
    setFlagsFound(prev => prev + 1);
  };

  // Handle account selection
  const handleAccountSelect = (accountId) => {
    if (!mission) return;
    
    const account = mission.content.accounts.find(acc => acc.accountId === accountId);
    if (!account) return;

    setSelectedAccount(accountId);
    
    // Check if correct - user should select the fake account
    const isCorrect = account.accountType === 'fake';
    
    if (isCorrect) {
      setAccountSelectionFeedback({ isCorrect: true, message: "✅ Correct! You identified the fake account." });
      addMessage("✅ Great detective work! You correctly identified the fake account.", 'alli');
      
      // Add red flags to evidence
      if (account.redFlags && account.redFlags.length > 0) {
        account.redFlags.forEach(flag => {
          addEvidence(`${flag.type}: ${flag.description}`);
          addMessage(`🚩 ${flag.description}`, 'alli');
        });
      }
    } else {
      setAccountSelectionFeedback({ isCorrect: false, message: "❌ Incorrect. This is the real account. Look for the fake one!" });
      addMessage("❌ Not quite right. This is the real account. Look more carefully at the details!", 'alli');
    }

    // Auto-answer first quiz question if it's about account selection
    if (mission.content.quiz && mission.content.quiz.questions.length > 0) {
      const firstQuestion = mission.content.quiz.questions[0];
      if (firstQuestion.text.includes('FAKE') || firstQuestion.text.includes('fake')) {
        // Find the option that matches the selected account
        const correctOption = firstQuestion.options.find(opt => opt.isCorrect);
        if (correctOption && isCorrect) {
          handleQuizAnswer(firstQuestion.questionId, correctOption.id);
        }
      }
    }
  };

  // Handle quiz answer
  const handleQuizAnswer = (questionId, optionId) => {
    if (!mission || quizAnswers[questionId]) return; // Already answered

    const question = mission.content.quiz.questions.find(q => q.questionId === questionId);
    if (!question) return;

    const option = question.options.find(opt => opt.id === optionId);
    if (!option) return;

    const isCorrect = option.isCorrect;
    
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setQuizFeedback(prev => ({ 
      ...prev, 
      [questionId]: { 
        isCorrect, 
        feedback: isCorrect ? question.feedback.correct : question.feedback.incorrect,
        explanation: question.explanation
      } 
    }));

    // Update score
    if (isCorrect) {
      const points = question.points || 25;
      setScore(prev => Math.min(prev + points, 100));
      setCorrectAnswers(prev => prev + 1);
      addMessage(`✅ Correct! ${question.feedback.correct}`, 'alli');
    } else {
      addMessage(`❌ Incorrect. ${question.feedback.incorrect}`, 'alli');
    }

    setTotalQuestions(prev => prev + 1);
  };

  useEffect(() => {
    // Load mission data from missions.js
    if (missionId && missions[missionId]) {
      const missionData = missions[missionId];
      setMission(missionData);
      
      // Initialize messages
      initializeMessages(missionData);
      
      // Set total questions (quiz questions)
      setTotalQuestions(missionData.content.quiz?.questions?.length || 0);
      setLoading(false);
    } else {
      // Mission not found - navigate back to department
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/');
      const missionIdFromPath = pathParts[2];
      
      let department = 'social-media';
      if (missionIdFromPath && missions[missionIdFromPath]) {
        department = missions[missionIdFromPath].department || 'social-media';
      }
      
      navigate(`/training/${department}`);
    }
    
    // Add layout styles to document
    const styleElement = document.createElement('style');
    styleElement.textContent = layoutStyles;
    document.head.appendChild(styleElement);
    
    // Cleanup function to remove styles
    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [missionId, navigate]);

  // Check if mission is complete
  const isMissionComplete = () => {
    if (!mission) return false;
    const allQuestionsAnswered = Object.keys(quizAnswers).length === (mission.content.quiz?.questions?.length || 0);
    return allQuestionsAnswered && selectedAccount !== null;
  };

  // Handle mission completion
  const handleMissionCompletion = async () => {
    if (!mission) return;

    try {
      // Calculate final results
      const finalScore = score;
      const finalAccuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100;
      
      // Check if user passed
      const minimumScore = mission.completionRequirements?.minimumScore || 75;
      const passed = finalScore >= minimumScore;

      // Prepare user performance data
      const userPerformance = {
        score: finalScore,
        maxScore: mission.scoring.maxScore,
        flagsFound,
        totalQuestions,
        correctAnswers,
        accuracy: finalAccuracy,
        evidence,
        selectedAccount,
        quizAnswers,
        passed,
        timeSpent: 0,
        hintsUsed: 0,
        mistakes: 0
      };

      // Save to localStorage for backup
      localStorage.setItem(`mission_${missionId}_progress`, JSON.stringify(userPerformance));
      
      // Update Firestore database using backend service
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const result = await completeMission(userId, mission, userPerformance);
        
        if (result.success) {
          console.log('🎉 Mission completed successfully!');
          navigate(`/mission/${missionId}/complete`, { 
            state: { 
              missionResults: result.missionResult,
              progressUpdate: result.progressUpdate,
              experienceGained: result.experienceGained,
              leveledUp: result.leveledUp,
              newAchievements: result.newAchievements
            } 
          });
          return;
        } else {
          console.error('Mission completion failed:', result.error);
          navigate(`/mission/${missionId}/complete`, { 
            state: { missionResults: userPerformance } 
          });
          return;
        }
      }
      
      // Navigate to complete page with results
      navigate(`/mission/${missionId}/complete`, { 
        state: { missionResults: userPerformance } 
      });
      
    } catch (error) {
      console.error('Error completing mission:', error);
      navigate(`/mission/${missionId}/complete`);
    }
  };

  // Render account card
  const renderAccountCard = (account) => {
    const isSelected = selectedAccount === account.accountId;
    const isWrong = accountSelectionFeedback && !accountSelectionFeedback.isCorrect && isSelected;
    const isCorrect = accountSelectionFeedback && accountSelectionFeedback.isCorrect && isSelected;

    return (
      <div
        key={account.accountId}
        onClick={() => handleAccountSelect(account.accountId)}
        className={`bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all ${
          isCorrect
            ? 'border-4 border-green-500 bg-green-50'
            : isWrong
            ? 'border-4 border-red-500 bg-red-50'
            : isSelected
            ? 'border-4 border-blue-500 bg-blue-50'
            : 'border-4 border-transparent hover:border-blue-300 hover:shadow-xl'
        }`}
      >
        {/* Account Header */}
        <div 
          className="p-6 text-center text-white"
          style={{
            background: account.header.backgroundGradient || account.header.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          {account.profile.verified ? (
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 mb-3">
              <span>✓</span> Verified
            </div>
          ) : (
            <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 mb-3">
              <span>✓</span> Verified
            </div>
          )}
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-3 border-4 border-white">
            {account.profile.avatar}
          </div>
          <div className="text-xl font-bold">{account.profile.name}</div>
          <div className="text-sm opacity-90 mt-1">{account.profile.username}</div>
        </div>

        {/* Account Body */}
        <div className="p-4">
          {/* Statistics */}
          <div className="flex justify-around py-4 border-b border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">
                {account.statistics.followers >= 1000000 
                  ? `${(account.statistics.followers / 1000000).toFixed(1)}M`
                  : account.statistics.followers >= 1000
                  ? `${(account.statistics.followers / 1000).toFixed(1)}K`
                  : account.statistics.followers.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 mt-1">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">
                {account.statistics.following.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 mt-1">Following</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">
                {account.statistics.posts.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 mt-1">Posts</div>
            </div>
          </div>

          {/* Account Details */}
          <div className="py-4 space-y-3 text-sm">
            {account.accountInfo.map((info, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-base flex-shrink-0">
                  {info.label === 'Joined' ? '📅' : 
                   info.label === 'Website' ? '🌐' : 
                   info.label === 'Business Email' || info.label === 'Contact' ? '📧' : 
                   info.label === 'Recent Activity' ? '💬' : '📋'}
                </span>
                <span className={info.isRedFlag ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                  <strong>{info.label}:</strong> {info.value}
                </span>
              </div>
            ))}

            {/* Recent Post */}
            {account.recentPost && (
              <div className="bg-gray-50 rounded-lg p-3 mt-3">
                <div className="text-xs text-gray-600 mb-1">Recent Post:</div>
                <div className="text-sm text-gray-700 leading-relaxed">{account.recentPost.text}</div>
                {account.recentPost.hasScamWarning && (
                  <div className="text-xs text-green-600 font-semibold mt-2">✅ Warns followers about scams</div>
                )}
                {!account.recentPost.hasScamWarning && account.accountType === 'fake' && (
                  <div className="text-xs text-red-600 font-semibold mt-2">🚩 Suspicious giveaway pattern</div>
                )}
              </div>
            )}

            {/* Engagement Info */}
            {account.statistics.averageEngagement && (
              <div className="flex items-start gap-2 mt-3">
                <span className="text-base">👥</span>
                <span className="text-sm text-gray-700">
                  Average engagement: {account.statistics.averageEngagement.likesPerPost.toLocaleString()} likes per post
                </span>
              </div>
            )}

            {/* Red Flags */}
            {account.redFlags && account.redFlags.length > 0 && account.accountType === 'fake' && (
              <div className="mt-3 space-y-1">
                {account.redFlags.slice(0, 3).map((flag, idx) => (
                  <div key={idx} className="text-xs text-red-600 font-semibold">
                    🚩 {flag.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render quiz question
  const renderQuizQuestion = (question) => {
    const userAnswer = quizAnswers[question.questionId];
    const feedback = quizFeedback[question.questionId];

    return (
      <div key={question.questionId} className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="font-semibold text-gray-800 mb-3">{question.text}</div>
        <div className="space-y-2">
          {question.options.map((option) => {
            const isSelected = userAnswer === option.id;
            const isCorrect = option.isCorrect;
            const showFeedback = feedback !== undefined;

            return (
              <button
                key={option.id}
                onClick={() => handleQuizAnswer(question.questionId, option.id)}
                disabled={!!userAnswer}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  showFeedback
                    ? isCorrect && isSelected
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : isSelected && !isCorrect
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : isCorrect
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                    : isSelected
                    ? 'bg-blue-100 border-blue-500 text-blue-800'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                } ${userAnswer ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {option.text}
              </button>
            );
          })}
        </div>
        {feedback && (
          <div className={`mt-3 p-3 rounded-lg ${
            feedback.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`text-sm font-semibold mb-1 ${
              feedback.isCorrect ? 'text-green-800' : 'text-red-800'
            }`}>
              {feedback.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </div>
            <div className={`text-sm ${
              feedback.isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {feedback.feedback}
            </div>
            {feedback.explanation && (
              <div className="text-xs text-gray-600 mt-2 italic">
                {feedback.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-700">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading mission investigation...</p>
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
              onClick={() => navigate(`/training/social-media`)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Return to Academy
            </button>
          </div>
        </div>
      </div>
    );
  }

  const quizTotalQuestions = mission.content.quiz?.questions?.length || 0;
  const answeredQuestions = Object.keys(quizAnswers).length;
  const progress = quizTotalQuestions > 0 ? (answeredQuestions / quizTotalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-700 overflow-hidden">
      {/* Investigation Header */}
      <div className="bg-black bg-opacity-40 backdrop-blur-md border-b border-white border-opacity-10 px-4 py-3 pt-20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BackButton onClick={() => navigate(`/mission/${missionId}/introduction`)} />
              <div className="flex items-center gap-3">
                <div className="bg-red-600 px-2 py-1 rounded text-xs font-semibold uppercase">
                  Active Investigation
                </div>
                <div className="text-white text-sm font-semibold">{mission.title}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white text-sm">
              <span>Questions: {answeredQuestions} of {quizTotalQuestions}</span>
              <div className="w-24 h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span>Score: {score}/{mission.scoring.maxScore}</span>
              <button
                onClick={handleMissionCompletion}
                disabled={!isMissionComplete()}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all transform ${
                  isMissionComplete()
                    ? 'bg-green-500 hover:bg-green-600 hover:scale-105'
                    : 'bg-gray-500 cursor-not-allowed opacity-50'
                } text-white`}
              >
                🚀 Complete Mission
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full p-2 md:p-4 overflow-hidden">
        <div className="mission-layout h-full">
          
          {/* Mission Content Panel */}
          <div className="min-h-0">
            {/* Mission Briefing */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 mb-6 shadow-lg">
              <div className="text-white">
                <div className="text-2xl font-bold mb-2">⚠️ Celebrity Impersonation Investigation</div>
                <div className="text-sm opacity-90">Fake Account & Verification Badge Detection</div>
              </div>
            </div>

            {/* Detective Alli Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                🕵️
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-1">Detective Alli</div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {mission.content.scenario}
                </div>
              </div>
            </div>

            {/* Comparison Section */}
            <div className="bg-white bg-opacity-10 rounded-xl p-6 mb-6">
              <div className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                🔍 Examine Both Accounts
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  🕵️
                </div>
                <div className="text-sm text-gray-700">
                  {mission.content.comparisonSetup?.instruction || "One of these accounts is REAL, one is FAKE. Study the details carefully!"}
                </div>
              </div>

              {/* Account Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mission.content.accounts?.map(account => renderAccountCard(account))}
              </div>

              {/* Account Selection Feedback */}
              {accountSelectionFeedback && (
                <div className={`mt-4 p-4 rounded-lg ${
                  accountSelectionFeedback.isCorrect 
                    ? 'bg-green-50 border-2 border-green-500' 
                    : 'bg-red-50 border-2 border-red-500'
                }`}>
                  <div className={`font-semibold ${
                    accountSelectionFeedback.isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {accountSelectionFeedback.message}
                  </div>
                </div>
              )}
            </div>

            {/* Quiz Section */}
            {mission.content.quiz && (
              <div className="bg-white bg-opacity-10 rounded-xl p-6 mb-6">
                <div className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  ❓ Identification Quiz
                </div>
                {mission.content.quiz.questions.map(question => renderQuizQuestion(question))}
              </div>
            )}
          </div>

          {/* Detective Assistant Panel */}
          <div className="min-h-0 h-full flex flex-col">
            <DetectivePanel
              messages={messages}
              currentQuiz={null}
              quizAnswered={false}
              onAnswerClick={() => {}}
              evidence={evidence}
              score={score}
              flagsFound={flagsFound}
              accuracy={totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100}
              isMissionComplete={isMissionComplete()}
              onCompleteMission={handleMissionCompletion}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotFakeProfileInvestigation;

