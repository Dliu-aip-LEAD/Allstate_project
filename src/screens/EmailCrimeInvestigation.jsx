import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import BottomNav from '../components/BottomNav';
import DetectivePanel from '../components/DetectivePanel';
import { missions } from '../data/missions';
import { completeMission } from '../services/missionService';
import { auth } from '../firebase';

const EmailCrimeInvestigation = () => {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const tooltipRef = useRef(null);

  // State management
  const [score, setScore] = useState(0);
  const [flagsFound, setFlagsFound] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [investigatedHotspots, setInvestigatedHotspots] = useState(new Set());
  const [evidence, setEvidence] = useState([]);
  const [pendingQuizzes, setPendingQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mission, setMission] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Load mission data from missions.js
    if (missionId && missions[missionId]) {
      const missionData = missions[missionId];
      setMission(missionData);
      
      // Initialize messages based on mission type
      initializeMessages(missionData);
      
      // Calculate score per step
      const totalSteps = Object.keys(missionData.content.clues || {}).length;
      const scorePerStep = totalSteps > 0 ? Math.round(missionData.scoring.maxScore / totalSteps) : 0;
      
      setTotalQuestions(totalSteps);
      setLoading(false);
    } else {
      // Mission not found
      navigate('/training/email-crimes');
    }
  }, [missionId, navigate]);

  // Initialize messages based on mission type
  const initializeMessages = (missionData) => {
    let initialMessages = [];
    
    if (missionData.content.type === 'terminology') {
      initialMessages = [
        {
          id: 1,
          sender: 'alli',
          text: "Welcome to your terminology training! I'll guide you through understanding key cybersecurity concepts. Click on each term to learn more."
        },
        {
          id: 2,
          sender: 'alli',
          text: "Pay attention to the definitions and real-world examples. This knowledge will help you identify threats in actual scenarios."
        }
      ];
    } else if (missionData.content.type === 'email') {
      initialMessages = [
        {
          id: 1,
          sender: 'alli',
          text: "Excellent! You've started investigating. I can see several red flags in this email. Click on any suspicious elements to examine them closely."
        },
        {
          id: 2,
          sender: 'alli',
          text: "Start with the sender's email address - does something look off about the domain name?"
        }
      ];
    } else if (missionData.content.type === 'social-media') {
      initialMessages = [
        {
          id: 1,
          sender: 'alli',
          text: "Welcome to social media scam analysis! Examine this profile carefully for signs of manipulation or deception."
        },
        {
          id: 2,
          sender: 'alli',
          text: "Look for red flags in the profile information, photos, and posts. Click on suspicious elements to investigate."
        }
      ];
    }
    
    setMessages(initialMessages);
  };

  // Calculate score per step
  const getScorePerStep = () => {
    if (!mission) return 0;
    const totalSteps = Object.keys(mission.content.clues || {}).length;
    return totalSteps > 0 ? Math.round(mission.scoring.maxScore / totalSteps) : 0;
  };

  const addMessage = (text, sender) => {
    const newMessage = {
      id: Date.now(),
      sender,
      text
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addEvidence = (text) => {
    const newEvidence = {
      id: Date.now(),
      text
    };
    setEvidence(prev => [...prev, newEvidence]);
    setFlagsFound(prev => prev + 1);
  };

  const updateScore = (points) => {
    if (!mission) return;
    setScore(prev => Math.min(prev + points, mission.scoring.maxScore));
  };

  const updateAccuracy = () => {
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100;
    return accuracy;
  };

  const handleHotspotClick = (clueKey) => {
    if (!mission || investigatedHotspots.has(clueKey)) return;

    const clue = mission.content.clues[clueKey];
    const quiz = mission.content.quizzes[clueKey];
    
    if (clue) {
      setInvestigatedHotspots(prev => new Set([...prev, clueKey]));
      addEvidence(clue.redFlag);
      addMessage(`🔍 Good eye! You found: ${clue.title}. ${clue.description}`, 'alli');
      
      // If there's NO quiz, award points immediately
      if (!quiz) {
        updateScore(mission.scoring.scorePerFlag);
      }
      
      // If there's a quiz, add it to pending queue
      if (quiz) {
        setPendingQuizzes(prev => [...prev, { clueKey, quiz }]);
        
        // Start first quiz if none is currently active
        if (!currentQuiz) {
          startNextQuiz();
        }
      }
    }
  };

  const showTooltip = (event, text) => {
    if (tooltipRef.current) {
      tooltipRef.current.textContent = text;
      tooltipRef.current.style.left = event.pageX + 'px';
      tooltipRef.current.style.top = (event.pageY - 40) + 'px';
      tooltipRef.current.style.opacity = '1';
    }
  };

  const hideTooltip = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = '0';
    }
  };

  const handleHotspotMouseEnter = (event, clueKey) => {
    if (!mission) return;
    const clue = mission.content.clues[clueKey];
    if (clue && !investigatedHotspots.has(clueKey)) {
      showTooltip(event, `Click to investigate: ${clue.title}`);
    }
  };

  const handleHotspotMouseLeave = () => {
    hideTooltip();
  };

  const startNextQuiz = () => {
    if (pendingQuizzes.length > 0) {
      const nextQuiz = pendingQuizzes[0];
      setCurrentQuiz(nextQuiz);
      setPendingQuizzes(prev => prev.slice(1));
      setQuizAnswered(false);
    } else {
      setCurrentQuiz(null);
      // Mission complete if all hotspots investigated
      if (mission && investigatedHotspots.size === Object.keys(mission.content.clues || {}).length) {
        handleMissionCompletion();
      }
    }
  };

  const handleAnswerClick = (isCorrect, feedback) => {
    setTotalQuestions(prev => prev + 1);
    setQuizAnswered(true);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      // Award points for correct quiz answers
      updateScore(mission.scoring.scorePerQuiz);
      addMessage(feedback, 'alli');
    } else {
      addMessage(`Not quite right. ${feedback}`, 'alli');
    }

    // Move to next quiz after delay
    setTimeout(() => {
      setCurrentQuiz(null);
      setQuizAnswered(false);
      startNextQuiz();
    }, isCorrect ? 2000 : 3000);
  };

  const handleMissionCompletion = async () => {
    if (!mission) return;

    try {
      // Calculate final results
      const finalScore = score + (correctAnswers * mission.scoring.scorePerQuiz);
      const finalAccuracy = updateAccuracy();
      
      // Prepare user performance data
      const userPerformance = {
        score: finalScore,
        maxScore: mission.scoring.maxScore,
        flagsFound,
        totalQuestions,
        correctAnswers,
        accuracy: finalAccuracy,
        evidence,
        timeSpent: 0, // TODO: Add timer functionality
        hintsUsed: 0, // TODO: Add hints system
        mistakes: 0   // TODO: Add mistake tracking
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
          console.log('Experience gained:', result.experienceGained);
          console.log('Leveled up:', result.leveledUp);
          console.log('New achievements:', result.newAchievements.length);
          
          // Navigate to complete page with results
          navigate(`/mission/${missionId}/complete`, { 
            state: { 
              missionResults: result.missionResult,
              progressUpdate: result.progressUpdate,
              experienceGained: result.experienceGained,
              leveledUp: result.leveledUp,
              newAchievements: result.newAchievements
            } 
          });
          return; // Exit early since we already navigated
        } else {
          console.error('Mission completion failed:', result.error);
          // Still navigate to completion page with basic results
          navigate(`/mission/${missionId}/complete`, { 
            state: { missionResults: userPerformance } 
          });
          return; // Exit early since we already navigated
        }
      }
      
      // Navigate to complete page with results
      navigate(`/mission/${missionId}/complete`, { 
        state: { missionResults } 
      });
      
    } catch (error) {
      console.error('Error completing mission:', error);
      // Still navigate to complete page even if database update fails
      navigate(`/mission/${missionId}/complete`);
    }
  };

  const handleSubmitInvestigation = async () => {
    if (!mission) return;
    
    try {
      // Calculate final results based on current progress
      const finalScore = score + (correctAnswers * mission.scoring.scorePerQuiz);
      const finalAccuracy = updateAccuracy();
      
      const finalProgress = {
        missionId,
        score: finalScore,
        maxScore: mission.scoring.maxScore,
        flagsFound,
        totalQuestions,
        correctAnswers,
        accuracy: finalAccuracy,
        evidence,
        completedAt: new Date().toISOString(),
        department: mission.department,
        difficulty: mission.difficulty
      };
      
      localStorage.setItem(`mission_${missionId}_progress`, JSON.stringify(finalProgress));
      
      // Update Firestore database using backend service
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const result = await completeMission(userId, mission, finalProgress);
        
        if (result.success) {
          console.log('🎉 Mission submitted successfully!');
          console.log('Experience gained:', result.experienceGained);
          console.log('Leveled up:', result.leveledUp);
          console.log('New achievements:', result.newAchievements.length);
          
          // Navigate to completion page with results
          navigate(`/mission/${missionId}/complete`, { 
            state: { 
              missionResults: result.missionResult,
              progressUpdate: result.progressUpdate,
              experienceGained: result.experienceGained,
              leveledUp: result.leveledUp,
              newAchievements: result.newAchievements
            } 
          });
          return; // Exit early since we already navigated
        } else {
          console.error('Mission submission failed:', result.error);
          // Still navigate to completion page with basic results
          navigate(`/mission/${missionId}/complete`, { 
            state: { missionResults: finalProgress } 
          });
          return; // Exit early since we already navigated
        }
      }
      
      // Navigate to completion page for anonymous users
      navigate(`/mission/${missionId}/complete`, { 
        state: { missionResults: finalProgress } 
      });
      
    } catch (error) {
      console.error('Error submitting investigation:', error);
      // Still navigate to completion page even if database update fails
      navigate(`/mission/${missionId}/complete`, { 
        state: { missionResults: finalProgress } 
      });
    }
  };

  // Render content based on mission type
  const renderMissionContent = () => {
    if (!mission) return null;

    if (mission.content.type === 'terminology') {
      return renderTerminologyContent();
    } else if (mission.content.type === 'email') {
      return renderEmailContent();
    } else if (mission.content.type === 'social-media') {
      return renderSocialMediaContent();
    }
    
    return null;
  };

  const renderTerminologyContent = () => {
    if (!mission.content.clues) return null;

    return (
      <div className="bg-white bg-opacity-95 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gray-800 text-white p-4">
          <div className="flex items-center gap-2">
            <span>📚</span>
            <span className="font-semibold">Terminology Training</span>
          </div>
        </div>
        
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-4">
            {Object.keys(mission.content.clues).map((clueKey) => {
              const clue = mission.content.clues[clueKey];
              const isInvestigated = investigatedHotspots.has(clueKey);
              
              return (
                <div 
                  key={clueKey}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isInvestigated 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                  onClick={() => handleHotspotClick(clueKey)}
                  onMouseEnter={(e) => handleHotspotMouseEnter(e, clueKey)}
                  onMouseLeave={handleHotspotMouseLeave}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">{clue.title}</h3>
                    {!isInvestigated && <span className="text-blue-600 text-sm">Click to learn</span>}
                    {isInvestigated && <span className="text-green-600 text-sm">✓ Learned</span>}
                  </div>
                  {isInvestigated && (
                    <div className="mt-2">
                      <p className="text-gray-700 text-sm mb-2">{clue.description}</p>
                      <div className="bg-red-100 border border-red-200 rounded px-2 py-1 inline-block">
                        <span className="text-red-800 text-xs font-medium">Red Flag: {clue.redFlag}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderEmailContent = () => {
    if (!mission.content.emailContent) return null;

    const emailContent = mission.content.emailContent;
    
    // Create a mapping between email elements and clue keys
    const getClueMapping = () => {
      if (mission.id === 'spot-red-flags') {
        return {
          from: 'fakeDomain',
          subject: 'excessiveUrgency',
          replyTo: 'replyMismatch',
          body: 'suspiciousLink'
        };
      } else if (mission.id === 'email-imposter') {
        return {
          from: 'domain',
          subject: 'urgency',
          replyTo: 'reply',
          body: 'pressure'
        };
      } else if (mission.id === 'spear-phishing') {
        return {
          from: 'domainSimilarity',
          subject: 'urgentTechnical',
          body: 'personalInfo'
        };
      } else if (mission.id === 'fake-account') {
        return {
          from: 'spoofedSender',
          subject: 'timelyThreat',
          replyTo: 'replyMismatch',
          body: 'credentialRequest'
        };
      } else if (mission.id === 'wire-transfer') {
        return {
          from: 'roleImpersonation',
          subject: 'urgency',
          body: 'pressure'
        };
      }
      return {};
    };

    const clueMapping = getClueMapping();
    
    return (
      <div className="bg-white bg-opacity-95 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>🔍</span>
            <span className="font-semibold">Evidence Analysis</span>
          </div>
          <div className="flex gap-2">
            <button className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-3 py-1 text-xs hover:bg-opacity-20 transition-all">
              🔍 Magnify
            </button>
            <button className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-3 py-1 text-xs hover:bg-opacity-20 transition-all">
              🚩 Flag
            </button>
            <button className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-3 py-1 text-xs hover:bg-opacity-20 transition-all">
              ✅ Verify
            </button>
          </div>
        </div>
        
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Email Header */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 font-mono text-sm">
            <div className="mb-2">
              <span className="text-gray-600 font-semibold w-16 inline-block">From:</span>
              <span 
                className={`cursor-pointer hover:bg-blue-100 hover:border hover:border-blue-300 rounded px-1 transition-all ${
                  investigatedHotspots.has(clueMapping.from || 'from') ? 'bg-green-100 border border-green-300' : ''
                }`}
                onClick={() => handleHotspotClick(clueMapping.from || 'from')}
                onMouseEnter={(e) => handleHotspotMouseEnter(e, clueMapping.from || 'from')}
                onMouseLeave={handleHotspotMouseLeave}
              >
                {emailContent.from}
              </span>
              {clueMapping.from && !investigatedHotspots.has(clueMapping.from) && (
                <span className="ml-2 text-blue-600 text-xs">!</span>
              )}
            </div>
            <div className="mb-2">
              <span className="text-gray-600 font-semibold w-16 inline-block">To:</span>
              <span>{emailContent.to}</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-600 font-semibold w-16 inline-block">Subject:</span>
              <span 
                className={`cursor-pointer hover:bg-blue-100 hover:border hover:border-blue-300 rounded px-1 transition-all ${
                  investigatedHotspots.has(clueMapping.subject || 'subject') ? 'bg-green-100 border border-green-300' : ''
                }`}
                onClick={() => handleHotspotClick(clueMapping.subject || 'subject')}
                onMouseEnter={(e) => handleHotspotMouseEnter(e, clueMapping.subject || 'subject')}
                onMouseLeave={handleHotspotMouseLeave}
              >
                {emailContent.subject}
              </span>
              {clueMapping.subject && !investigatedHotspots.has(clueMapping.subject) && (
                <span className="ml-2 text-blue-600 text-xs">!</span>
              )}
            </div>
            {emailContent.replyTo && (
              <div className="mb-2">
                <span className="text-gray-600 font-semibold w-16 inline-block">Reply-To:</span>
                <span 
                  className={`cursor-pointer hover:bg-blue-100 hover:border hover:border-blue-300 rounded px-1 transition-all ${
                    investigatedHotspots.has(clueMapping.replyTo || 'replyTo') ? 'bg-green-100 border border-green-300' : ''
                  }`}
                  onClick={() => handleHotspotClick(clueMapping.replyTo || 'replyTo')}
                  onMouseEnter={(e) => handleHotspotMouseEnter(e, clueMapping.replyTo || 'replyTo')}
                  onMouseLeave={handleHotspotMouseLeave}
                >
                  {emailContent.replyTo}
                </span>
                {clueMapping.replyTo && !investigatedHotspots.has(clueMapping.replyTo) && (
                  <span className="ml-2 text-blue-600 text-xs">!</span>
                )}
              </div>
            )}
          </div>

          {/* Email Body */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: emailContent.body.replace(/\n/g, '<br/>') }} />
          </div>
          
          {/* Additional Hotspots in Email Body */}
          {clueMapping.body && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-sm text-yellow-800 mb-2">
                <span className="font-semibold">💡 Tip:</span> Look for suspicious elements in the email content above
              </div>
              <button
                className={`px-3 py-2 rounded text-sm transition-all ${
                  investigatedHotspots.has(clueMapping.body) 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200'
                }`}
                onClick={() => handleHotspotClick(clueMapping.body)}
                onMouseEnter={(e) => handleHotspotMouseEnter(e, clueMapping.body)}
                onMouseLeave={handleHotspotMouseLeave}
              >
                {investigatedHotspots.has(clueMapping.body) ? '✓ Content Analyzed' : '🔍 Analyze Email Content'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSocialMediaContent = () => {
    if (!mission.content.profileContent) return null;

    const profile = mission.content.profileContent;
    
    return (
      <div className="bg-white bg-opacity-95 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gray-800 text-white p-4">
          <div className="flex items-center gap-2">
            <span>📱</span>
            <span className="font-semibold">Social Media Profile Analysis</span>
          </div>
        </div>
        
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Profile Header */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl text-white">
                👤
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{profile.name}</h3>
                <p className="text-gray-600">{profile.age} years old • {profile.location}</p>
              </div>
            </div>
            <p className="text-gray-700">{profile.bio}</p>
          </div>

          {/* Photos Section */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Photos</h4>
            <div className="grid grid-cols-2 gap-3">
              {profile.photos.map((photo, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    investigatedHotspots.has(`photo_${index}`) ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                  onClick={() => handleHotspotClick(`photo_${index}`)}
                  onMouseEnter={(e) => handleHotspotMouseEnter(e, `photo_${index}`)}
                  onMouseLeave={handleHotspotMouseLeave}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center text-gray-500">
                      📷
                    </div>
                    <p className="text-xs text-gray-600">{photo}</p>
                    {!investigatedHotspots.has(`photo_${index}`) && (
                      <span className="text-blue-600 text-xs">Click to analyze</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Recent Posts</h4>
            <div className="space-y-3">
              {profile.recentPosts.map((post, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    investigatedHotspots.has(`post_${index}`) ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                  onClick={() => handleHotspotClick(`post_${index}`)}
                  onMouseEnter={(e) => handleHotspotMouseEnter(e, `post_${index}`)}
                  onMouseLeave={handleHotspotMouseLeave}
                >
                  <p className="text-gray-700">{post}</p>
                  {!investigatedHotspots.has(`post_${index}`) && (
                    <span className="text-blue-600 text-xs">Click to analyze</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
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
              onClick={() => navigate('/training/email-crimes')}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Return to Academy
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalSteps = Object.keys(mission.content.clues || {}).length;
  const scorePerStep = getScorePerStep();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-700">
      {/* Investigation Header */}
      <div className="bg-black bg-opacity-40 backdrop-blur-md border-b border-white border-opacity-10 px-4 py-3 pt-20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
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
              <span>Step {investigatedHotspots.size} of {totalSteps}</span>
              <div className="w-24 h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${Math.min(investigatedHotspots.size / totalSteps * 100, 100)}%` }}
                ></div>
              </div>
              <span>Score: {score}/{mission.scoring.maxScore}</span>
              <button
                onClick={handleSubmitInvestigation}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all transform hover:scale-105"
              >
                🚀 Submit Investigation
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 h-full">
          
          {/* Mission Content Panel */}
          {renderMissionContent()}

          {/* Detective Assistant Panel */}
          <div>
            <DetectivePanel
              messages={messages}
              currentQuiz={currentQuiz}
              quizAnswered={quizAnswered}
              onAnswerClick={handleAnswerClick}
              evidence={evidence}
              score={score}
              flagsFound={flagsFound}
              accuracy={updateAccuracy()}
              isMissionComplete={investigatedHotspots.size === totalSteps}
              onCompleteMission={handleMissionCompletion}
            />
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <div 
        ref={tooltipRef}
        className="fixed pointer-events-none z-50 bg-gray-800 text-white px-3 py-2 rounded text-xs max-w-xs shadow-lg opacity-0 transition-opacity duration-200"
        style={{
          transform: 'translateX(-50%)',
        }}
      >
        <div className="relative">
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default EmailCrimeInvestigation; 