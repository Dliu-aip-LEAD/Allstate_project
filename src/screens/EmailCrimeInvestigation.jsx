import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import BottomNav from '../components/BottomNav';
import DetectivePanel from '../components/DetectivePanel';
import { missions } from '../data/missions';
import { completeMission } from '../services/missionService';
import { auth } from '../firebase';

// Add CSS styles for hotspots
const hotspotStyles = `
  .hotspot-text {
    cursor: pointer;
    padding: 1px 2px;
    border-radius: 3px;
    transition: all 0.2s;
    display: inline-block;
    position: relative;
  }
  
  .hotspot-text:hover {
    background: rgba(59, 130, 246, 0.2) !important;
    border: 1px solid #3b82f6 !important;
    transform: scale(1.02);
  }
  
  .hotspot-text.investigated {
    background: rgba(16, 185, 129, 0.2) !important;
    border: 1px solid #10b981 !important;
  }
  
  .hotspot-text.investigated:hover {
    background: rgba(16, 185, 129, 0.3) !important;
  }
  
  /* Responsive layout styles */
  @media (min-width: 1280px) {
    .mission-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 1.5rem;
      height: 100%;
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
  const [correctQuizCount, setCorrectQuizCount] = useState(0); // 新增：跟踪答对的题目数量

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

  // Calculate score per step - now considers both hotspots and quizzes
  const getScorePerStep = () => {
    if (!mission) return 0;
    const totalHotspots = Object.keys(mission.content.clues || {}).length;
    const totalQuizzes = Object.keys(mission.content.quizzes || {}).length;
    const totalSteps = totalHotspots + totalQuizzes;
    return totalSteps > 0 ? Math.round(100 / totalSteps) : 0;
  };

  const addMessage = (text, sender) => {
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

  const updateScore = (points) => {
    if (!mission) return;
    
    // Simply accumulate points, let useEffect handle the 100-point logic
    setScore(prevScore => {
      const newScore = Math.min(prevScore + points, 100);
      console.log(`Score update: ${prevScore} + ${points} = ${newScore}`);
      return newScore;
    });
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
      // Mark as investigated
      setInvestigatedHotspots(prev => new Set([...prev, clueKey]));
      setFlagsFound(prev => prev + 1);
      
      // Calculate score for this hotspot
      const scorePerStep = getScorePerStep();
      updateScore(scorePerStep);
      
      // Add message about the clue
      addMessage(`🚩 Red Flag Found: ${clue.redFlag}`, 'alli');
      addMessage(`📝 ${clue.description}`, 'alli');
      
      // Add to evidence
      setEvidence(prev => [...prev, {
        id: `evid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'redFlag',
        clue: clueKey,
        title: clue.title,
        description: clue.description,
        redFlag: clue.redFlag
      }]);
      
      // If there's a quiz for this clue, handle it immediately
      if (quiz) {
        console.log(`Adding quiz for ${clueKey}:`, quiz.text);
        
        // If no quiz is currently active, start this one immediately
        if (!currentQuiz) {
          console.log('Starting quiz immediately for:', clueKey);
          setCurrentQuiz({ clueKey, quiz });
          setQuizAnswered(false);
        } else {
          // Add to pending queue if another quiz is active
          console.log('Adding to pending queue:', clueKey);
          setPendingQuizzes(prev => {
            const newQuizzes = [...prev, { clueKey, quiz }];
            console.log('Updated pending quizzes:', newQuizzes.map(q => q.clueKey));
            return newQuizzes;
          });
        }
      } else {
        console.log(`No quiz found for clue: ${clueKey}`);
      }
    }
  };

  const handleHotspotMouseEnter = (event, clueKey) => {
    if (!mission || investigatedHotspots.has(clueKey)) return;
    
    const clue = mission.content.clues[clueKey];
    if (clue) {
      // Show tooltip
      if (tooltipRef.current) {
        tooltipRef.current.textContent = `Click to investigate: ${clue.title}`;
        tooltipRef.current.style.display = 'block';
        tooltipRef.current.style.opacity = '1';
        tooltipRef.current.style.left = event.pageX + 10 + 'px';
        tooltipRef.current.style.top = event.pageY - 30 + 'px';
      }
    }
  };

  const handleHotspotMouseLeave = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = '0';
      setTimeout(() => {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
        }
      }, 200);
    }
  };

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
      // Mission not found - try to get department from URL or default to email-crimes
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/');
      const missionIdFromPath = pathParts[2]; // /mission/:missionId/investigation
      
      // Try to get department from mission data if available
      let department = 'email-crimes';
      if (missionIdFromPath && missions[missionIdFromPath]) {
        department = missions[missionIdFromPath].department || 'email-crimes';
      }
      
      navigate(`/training/${department}`);
    }
    
    // Add hotspot styles to document
    const styleElement = document.createElement('style');
    styleElement.textContent = hotspotStyles;
    document.head.appendChild(styleElement);
    
    // Cleanup function to remove styles
    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [missionId, navigate]);

  // Add effect to handle hotspot clicks after component mounts
  useEffect(() => {
    if (!mission || !mission.content.bodyHotspots) return;
    
    // Add click event listeners to hotspots
    const handleDocumentClick = (event) => {
      const target = event.target;
      if (target.classList.contains('hotspot-text')) {
        const clueKey = target.getAttribute('data-clue');
        if (clueKey && mission.content.clues[clueKey]) {
          // Use the same logic as handleHotspotClick
          handleHotspotClick(clueKey);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);
    
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [mission]);

  // Add effect to automatically set score to 100 when all conditions are met
  useEffect(() => {
    if (!mission) return;
    
    const totalHotspots = Object.keys(mission.content.clues || {}).length;
    const totalQuizzes = Object.keys(mission.content.quizzes || {}).length;
    
    // Check if all hotspots are clicked and all quizzes are answered correctly
    if (investigatedHotspots.size >= totalHotspots && correctQuizCount >= totalQuizzes) {
      console.log(`🎯 Perfect completion detected! Hotspots: ${investigatedHotspots.size}/${totalHotspots}, Correct quizzes: ${correctQuizCount}/${totalQuizzes}. Setting score to 100.`);
      setScore(100);
    }
  }, [mission, investigatedHotspots.size, correctQuizCount]);

  const startNextQuiz = () => {
    console.log('startNextQuiz called, pendingQuizzes:', pendingQuizzes);
    if (pendingQuizzes.length > 0) {
      const nextQuiz = pendingQuizzes[0];
      console.log('Starting quiz for:', nextQuiz.clueKey);
      setCurrentQuiz(nextQuiz);
      setPendingQuizzes(prev => prev.slice(1));
      setQuizAnswered(false);
    } else {
      console.log('No more quizzes pending');
      setCurrentQuiz(null);
      // Don't auto-complete mission, let user click View Results button
      // Mission completion logic moved to handleMissionCompletion
    }
  };

  const handleAnswerClick = (isCorrect, feedback) => {
    setTotalQuestions(prev => prev + 1);
    setQuizAnswered(true);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setCorrectQuizCount(prev => prev + 1); // 新增：答对题目时增加计数
      // Award points for correct quiz answers using new scoring system
      const scorePerStep = getScorePerStep();
      updateScore(scorePerStep);
      console.log(`Quiz answered correctly! +${scorePerStep} points. Current score: ${score + scorePerStep}, Correct quiz count: ${correctQuizCount + 1}`);
      addMessage(feedback, 'alli');
    } else {
      addMessage(`Not quite right. ${feedback}`, 'alli');
    }

    // Move to next quiz after delay
    setTimeout(() => {
      setCurrentQuiz(null);
      setQuizAnswered(false);
      
      // Check if this was the last quiz
      const totalHotspots = Object.keys(mission.content.clues || {}).length;
      const totalQuizzes = Object.keys(mission.content.quizzes || {}).length;
      const totalSteps = totalHotspots + totalQuizzes;
      const completedSteps = investigatedHotspots.size + correctAnswers;
      
      console.log(`Quiz completed. Total steps: ${totalSteps}, Completed: ${completedSteps}, Score: ${score}, Correct quiz count: ${correctQuizCount}`);
      
      startNextQuiz();
    }, isCorrect ? 2000 : 3000);
  };

  const handleMissionCompletion = async () => {
    if (!mission) return;

    try {
      // Calculate final results - score is already calculated during gameplay
      const finalScore = score; // Use the current score directly
      const finalAccuracy = updateAccuracy();
      
      // Prepare user performance data
      const userPerformance = {
        score: finalScore,
        maxScore: 100, // Always 100 for new scoring system
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
        state: { missionResults: userPerformance } 
      });
      
    } catch (error) {
      console.error('Error completing mission:', error);
      // Still navigate to completion page even if database update fails
      navigate(`/mission/${missionId}/complete`);
    }
  };

  const handleSubmitInvestigation = async () => {
    if (!mission) return;
    
    try {
      // Calculate final results - use current score directly (no duplicate calculation)
      const finalScore = score; // Score is already calculated during gameplay
      const finalAccuracy = updateAccuracy();
      
      const finalProgress = {
        missionId,
        score: finalScore,
        maxScore: 100, // Always 100 for new scoring system
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
          console.error('Mission submission failed:', result.error);
          // Still navigate to completion page with basic results
          navigate(`/mission/${missionId}/complete`, { 
            state: { missionResults: finalProgress } 
          });
          return; // Exit early since we already navigated
        }
      }
      
      // Navigate to complete page with results
      navigate(`/mission/${missionId}/complete`, { 
        state: { missionResults: finalProgress } 
      });
      
    } catch (error) {
      console.error('Error submitting mission:', error);
      // Still navigate to completion page even if database update fails
      navigate(`/mission/${missionId}/complete`);
    }
  };

  // Function to generate dynamic tips based on user progress
  const generateTipsContent = () => {
    if (currentQuiz) {
      return {
        title: 'Quiz Available!',
        message: `You've found a red flag! Complete the quiz in the Detective Panel to earn points and continue your investigation.`,
        icon: '🧠',
        color: 'yellow',
        showReward: true
      };
    }
    
    if (investigatedHotspots.size === 0) {
      return {
        title: 'Welcome to the Investigation!',
        message: `Click on highlighted suspicious text in the email above to investigate red flags. Each red flag you discover will unlock a quiz to test your knowledge.`,
        icon: '🔍',
        color: 'blue',
        showReward: false
      };
    }
    
    if (investigatedHotspots.size < Object.keys(mission.content.clues || {}).length) {
      const remaining = Object.keys(mission.content.clues || {}).length - investigatedHotspots.size;
      return {
        title: 'Investigation in Progress',
        message: `Great work! You've found ${investigatedHotspots.size} red flags. Keep investigating to find ${remaining} more suspicious elements.`,
        icon: '🚩',
        color: 'green',
        showReward: false
      };
    }
    
    return {
      title: 'Investigation Complete!',
      message: `Excellent detective work! You've found all the red flags. Submit your investigation to see your final score.`,
      icon: '🎉',
      color: 'green',
      showReward: false
    };
  };

  const tipsContent = generateTipsContent();

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
        //   body: 'suspiciousLink'
        };
      } else if (mission.id === 'email-imposter') {
        return {
          from: 'domain',
          subject: 'urgency',
          replyTo: 'reply',
        //   body: 'pressure'
        };
      } else if (mission.id === 'spear-phishing') {
        return {
          from: 'domainSimilarity',
          subject: 'urgentTechnical',
        //   body: 'personalInfo'
        };
      } else if (mission.id === 'fake-account') {
        return {
          from: 'spoofedSender',
          subject: 'timelyThreat',
          replyTo: 'replyMismatch',
        //   body: 'credentialRequest'
        };
      } else if (mission.id === 'wire-transfer') {
        return {
          from: 'roleImpersonation',
          subject: 'urgency',
        //   body: 'pressure'
        };
      }
      return {};
    };

    const clueMapping = getClueMapping();
    
    // Function to render email body with hotspots
    const renderEmailBodyWithHotspots = () => {
      if (!mission.content.bodyHotspots) {
        return <div>{emailContent.body.split('\n').map((line, index) => (
          <div key={index}>{line}<br/></div>
        ))}</div>;
      }

      const hotspots = mission.content.bodyHotspots;
      
      // Sort hotspots by length (longest first) to avoid partial matches
      const sortedHotspots = Object.keys(hotspots).sort((a, b) => b.length - a.length);
      
      // Function to render text with hotspots
      const renderTextWithHotspots = (text) => {
        let result = [];
        let lastIndex = 0;
        
        sortedHotspots.forEach(hotspotText => {
          // Use case-insensitive search
          const searchText = text.toLowerCase();
          const searchHotspot = hotspotText.toLowerCase();
          const index = searchText.indexOf(searchHotspot, lastIndex);
          if (index !== -1) {
            // Add text before hotspot
            if (index > lastIndex) {
              result.push(text.slice(lastIndex, index));
            }
            
            // Add hotspot
            const clueKey = hotspots[hotspotText];
            const isInvestigated = investigatedHotspots.has(clueKey);
            
            // Get the actual text from the original text (preserve case)
            const actualText = text.slice(index, index + hotspotText.length);
            
            result.push(
              <span
                key={`${clueKey}-${index}`}
                className={`hotspot-text ${isInvestigated ? 'investigated' : ''}`}
                data-clue={clueKey}
                onClick={() => handleHotspotClick(clueKey)}
                onMouseEnter={(e) => handleHotspotMouseEnter(e, clueKey)}
                onMouseLeave={handleHotspotMouseLeave}
                style={{
                  cursor: 'pointer',
                  padding: '1px 2px',
                  borderRadius: '3px',
                  transition: 'all 0.2s',
                  display: 'inline-block',
                  position: 'relative',
                  backgroundColor: isInvestigated ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  border: isInvestigated ? '1px solid #10b981' : '1px dashed #3b82f6'
                }}
              >
                {actualText}
              </span>
            );
            
            lastIndex = index + hotspotText.length;
          }
        });
        
        // Add remaining text
        if (lastIndex < text.length) {
          result.push(text.slice(lastIndex));
        }
        
        return result;
      };
      
      return (
        <div>
          {emailContent.body.split('\n').map((line, index) => (
            <div key={index}>
              {renderTextWithHotspots(line)}
              <br/>
            </div>
          ))}
        </div>
      );
    };
    
    return (
      <div className="bg-white bg-opacity-95 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>🔍</span>
            <span className="font-semibold">Evidence Analysis</span>
          </div>
          <div className="flex gap-2">
            {/* <button className="bg-white bg-opacity-10 border border-white border-opacity-20 text-black text-bold rounded px-3 py-1 text-xs hover:bg-opacity-20 transition-all">
              🔍 Magnify
            </button>
            <button className="bg-white bg-opacity-10 border border-white border-opacity-20 text-black text-bold rounded px-3 py-1 text-xs hover:bg-opacity-20 transition-all">
              🚩 Flag
            </button>
            <button className="bg-white bg-opacity-10 border border-white border-opacity-20 text-black text-bold rounded px-3 py-1 text-xs hover:bg-opacity-20 transition-all">
              ✅ Verify
            </button> */}
          </div>
        </div>
        
        <div className="p-6">
          {/* Tips Section */}
          <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-lg border transition-all duration-300 ${
            tipsContent.color === 'yellow' 
              ? 'bg-yellow-50 border-yellow-200' 
              : tipsContent.color === 'green'
              ? 'bg-green-50 border-green-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start gap-2 md:gap-3">
              <div className={`text-base md:text-lg ${
                tipsContent.color === 'yellow' 
                  ? 'text-yellow-600' 
                  : tipsContent.color === 'green'
                  ? 'text-green-600'
                  : 'text-blue-600'
              }`}>
                {tipsContent.icon}
              </div>
              <div className="flex-1">
                <div className={`font-semibold mb-1 text-sm md:text-base ${
                  tipsContent.color === 'yellow' 
                    ? 'text-yellow-800' 
                    : tipsContent.color === 'green'
                    ? 'text-green-800'
                    : 'text-blue-800'
                }`}>
                  {tipsContent.title}
                </div>
                <div className={`text-xs md:text-sm ${
                  tipsContent.color === 'yellow' 
                    ? 'text-yellow-700' 
                    : tipsContent.color === 'green'
                    ? 'text-green-700'
                    : 'text-blue-700'
                }`}>
                  {tipsContent.message}
                </div>
                {tipsContent.showReward && (
                  <div className={`mt-2 text-xs ${
                    tipsContent.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    💰 Quiz reward: {mission.scoring.scorePerQuiz} points
                  </div>
                )}
              </div>
            </div>
          </div>

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
                <span className="text-blue-600 text-xs">!</span>
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
                  <span className="text-blue-600 text-xs">!</span>
                )}
              </div>
            )}
          </div>

          {/* Email Body with Hotspots */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm leading-relaxed">
            {renderEmailBodyWithHotspots()}
          </div>
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
        
        <div className="p-6">
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
              onClick={() => {
                // Try to get department from mission data or default to email-crimes
                const currentPath = window.location.pathname;
                const pathParts = currentPath.split('/');
                const missionIdFromPath = pathParts[2];
                let department = 'email-crimes';
                if (missionIdFromPath && missions[missionIdFromPath]) {
                  department = missions[missionIdFromPath].department || 'email-crimes';
                }
                navigate(`/training/${department}`);
              }}
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

  const isMissionComplete = () => {
    const totalHotspots = Object.keys(mission.content.clues || {}).length;
    const hotspotsComplete = investigatedHotspots.size === totalHotspots;
    const quizzesComplete = !currentQuiz && pendingQuizzes.length === 0;
    return hotspotsComplete && quizzesComplete;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-700">
      {/* Investigation Header */}
      <div className="bg-black bg-opacity-40 backdrop-blur-md border-b border-white border-opacity-10 px-4 py-3 pt-20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout (md and up) - original style */}
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
              <span>Investigated: {investigatedHotspots.size} of {totalSteps}</span>
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

      <div className="flex-1 max-w-7xl mx-auto w-full p-2 md:p-4">
        <div className="mission-layout grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-3 md:gap-6 h-full min-h-0">
          
          {/* Mission Content Panel */}
          <div className="min-h-0 overflow-hidden">
            {renderMissionContent()}
          </div>

          {/* Detective Assistant Panel */}
          <div className="min-h-0 h-full">
            <DetectivePanel
              messages={messages}
              currentQuiz={currentQuiz}
              quizAnswered={quizAnswered}
              onAnswerClick={handleAnswerClick}
              evidence={evidence}
              score={score}
              flagsFound={flagsFound}
              accuracy={updateAccuracy()}
              isMissionComplete={isMissionComplete()}
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
          <div className="absolute top-full left-1/2 transform -translate-x(-50%) border-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>

      {/* Bottom Navigation removed from this page */}
    </div>
  );
};

export default EmailCrimeInvestigation; 