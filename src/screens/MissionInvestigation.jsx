import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import BottomNav from '../components/BottomNav';
import DetectivePanel from '../components/DetectivePanel';

const MissionInvestigation = () => {
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
  const [messages, setMessages] = useState([
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
  ]);

  // Mission data - this would come from a database in a real app
  const missionData = {
    'email-imposter': {
      id: 'email-imposter',
      title: 'Case #2024-037: The Email Imposter',
      clues: {
        domain: {
          title: "Suspicious Domain",
          description: "The domain 'techinnovation-corp.co' is very similar to the real company domain 'techinnovation.com' but uses '.co' instead. This is a common typosquatting technique.",
          redFlag: "Fake domain mimicking real company"
        },
        urgency: {
          title: "Artificial Urgency",
          description: "Scammers often use urgent language to pressure victims into acting quickly without thinking.",
          redFlag: "Creates false time pressure"
        },
        reply: {
          title: "Suspicious Reply-To",
          description: "The reply-to address uses a temporary email service, not the company's official domain.",
          redFlag: "Reply-to address doesn't match sender"
        },
        pressure: {
          title: "Pressure Tactics",
          description: "The word 'urgent' is used to create stress and bypass normal verification procedures.",
          redFlag: "Psychological pressure tactics"
        },
        secrecy: {
          title: "Enforced Secrecy",
          description: "Legitimate business transactions don't typically require secrecy from the finance team.",
          redFlag: "Requests unusual secrecy"
        },
        deadline: {
          title: "Tight Deadline",
          description: "A same-day deadline for a large financial transaction is highly unusual in legitimate business.",
          redFlag: "Unrealistic deadline for verification"
        },
        silence: {
          title: "Isolation Tactic",
          description: "Preventing the victim from discussing with others is a classic scammer technique.",
          redFlag: "Prevents victim from seeking advice"
        },
        signature: {
          title: "Generic Signature",
          description: "Real CEO emails typically have detailed signatures with contact information.",
          redFlag: "Unusually simple signature for CEO"
        }
      },
      quizzes: {
        domain: {
          text: "🤔 What's suspicious about the sender's email domain?",
          options: [
            { text: "It's using a secure .com extension", correct: false },
            { text: "The email format looks normal", correct: false },
            { text: "It's 'techinnovation-corp.co' instead of 'techinnovation.com'", correct: true },
            { text: "Nothing seems wrong to me", correct: false }
          ],
          feedback: "Exactly! The domain is designed to look like the real company but uses '.co' instead of '.com' - this is called typosquatting."
        },
        urgency: {
          text: "🎯 Why is the 'URGENT' subject line a red flag?",
          options: [
            { text: "It shows the CEO is very busy", correct: false },
            { text: "It creates pressure to act without thinking", correct: true },
            { text: "It's written in all caps", correct: false },
            { text: "It mentions confidential information", correct: false }
          ],
          feedback: "Correct! Scammers use urgency to bypass normal verification procedures and make people act emotionally rather than logically."
        },
        reply: {
          text: "🔍 What's suspicious about the Reply-To address?",
          options: [
            { text: "It uses a temporary email service", correct: true },
            { text: "It matches the sender's domain", correct: false },
            { text: "It's a valid business email", correct: false },
            { text: "Nothing seems wrong", correct: false }
          ],
          feedback: "Correct! The reply-to uses a temporary email service, not the company's official domain."
        },
        pressure: {
          text: "⚡ Why is 'urgent wire transfer' suspicious?",
          options: [
            { text: "It's a legitimate business term", correct: false },
            { text: "It creates psychological pressure", correct: true },
            { text: "It's written in bold", correct: false },
            { text: "It mentions money", correct: false }
          ],
          feedback: "Exactly! The word 'urgent' is used to create stress and bypass normal verification procedures."
        },
        secrecy: {
          text: "🤐 Why is 'confidential acquisition' suspicious?",
          options: [
            { text: "It's a normal business term", correct: false },
            { text: "It requests unusual secrecy", correct: true },
            { text: "It's written in italics", correct: false },
            { text: "It sounds professional", correct: false }
          ],
          feedback: "Correct! Legitimate business transactions don't typically require secrecy from the finance team."
        },
        deadline: {
          text: "⏰ Why is the same-day deadline suspicious?",
          options: [
            { text: "It's a normal business practice", correct: false },
            { text: "It's an unrealistic timeframe", correct: true },
            { text: "It shows urgency", correct: false },
            { text: "It's written clearly", correct: false }
          ],
          feedback: "Exactly! A same-day deadline for a large financial transaction is highly unusual in legitimate business."
        },
        silence: {
          text: "🤫 Why is 'Do not discuss this with anyone' suspicious?",
          options: [
            { text: "It's a security measure", correct: false },
            { text: "It prevents seeking advice", correct: true },
            { text: "It's a standard policy", correct: false },
            { text: "It protects confidentiality", correct: false }
          ],
          feedback: "Correct! Preventing the victim from discussing with others is a classic scammer technique."
        },
        signature: {
          text: "✍️ Why is the CEO signature suspicious?",
          options: [
            { text: "It's too simple for a CEO", correct: true },
            { text: "It's professionally formatted", correct: false },
            { text: "It includes contact info", correct: false },
            { text: "It looks normal", correct: false }
          ],
          feedback: "Exactly! Real CEO emails typically have detailed signatures with contact information."
        }
      }
    }
  };

  const mission = missionData[missionId] || missionData['email-imposter'];
  
  // Calculate score per step (8 total steps)
  const totalSteps = Object.keys(mission.clues).length;
  const scorePerStep = Math.round(100 / totalSteps);

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
    setScore(prev => Math.min(prev + points, 100));
  };

  const updateAccuracy = () => {
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100;
    return accuracy;
  };

  const handleHotspotClick = (clueKey) => {
    if (investigatedHotspots.has(clueKey)) return;

    const clue = mission.clues[clueKey];
    const quiz = mission.quizzes[clueKey];
    
    if (clue) {
      setInvestigatedHotspots(prev => new Set([...prev, clueKey]));
      addEvidence(clue.redFlag);
      addMessage(`🔍 Good eye! You found: ${clue.title}. ${clue.description}`, 'alli');
      setFlagsFound(prev => prev + 1);
      
      // If there's NO quiz, award points immediately
      if (!quiz) {
        updateScore(scorePerStep);
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
    const clue = mission.clues[clueKey];
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
      if (investigatedHotspots.size === Object.keys(mission.clues).length) {
        completeMission();
      }
    }
  };

  const handleAnswerClick = (isCorrect, feedback) => {
    setTotalQuestions(prev => prev + 1);
    setQuizAnswered(true);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      // Award points for correct quiz answers
      updateScore(scorePerStep);
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

  const completeMission = () => {
    // Save progress to localStorage or database
    const missionProgress = {
      missionId,
      score,
      flagsFound,
      totalQuestions,
      correctAnswers,
      accuracy: updateAccuracy(),
      evidence,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`mission_${missionId}_progress`, JSON.stringify(missionProgress));
    
    // Navigate to complete page
    navigate(`/mission/${missionId}/complete`);
  };

  const handleSubmitInvestigation = () => {
    // Calculate final results based on current progress
    const finalProgress = {
      missionId,
      score,
      flagsFound,
      totalQuestions,
      correctAnswers,
      accuracy: updateAccuracy(),
      evidence,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`mission_${missionId}_progress`, JSON.stringify(finalProgress));
    
    // Navigate to complete page
    navigate(`/mission/${missionId}/complete`);
  };



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
              <span>Step {investigatedHotspots.size} of {Object.keys(mission.clues).length}</span>
              <div className="w-24 h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${Math.min(investigatedHotspots.size / Object.keys(mission.clues).length * 100, 100)}%` }}
                ></div>
              </div>
              <span>Score: {score}/100</span>
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
          
          {/* Email Investigation Panel */}
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
                       investigatedHotspots.has('domain') ? 'bg-green-100 border border-green-300' : ''
                     }`}
                     onClick={() => handleHotspotClick('domain')}
                     onMouseEnter={(e) => handleHotspotMouseEnter(e, 'domain')}
                     onMouseLeave={handleHotspotMouseLeave}
                   >
                     ceo@techinnovation-corp.co
                   </span>
                   {!investigatedHotspots.has('domain') && (
                     <span className="ml-2 text-blue-600 text-xs">!</span>
                   )}
                 </div>
                <div className="mb-2">
                  <span className="text-gray-600 font-semibold w-16 inline-block">To:</span>
                  <span>finance@techinnovation.com</span>
                </div>
                                 <div className="mb-2">
                   <span className="text-gray-600 font-semibold w-16 inline-block">Subject:</span>
                   <span 
                     className={`cursor-pointer hover:bg-blue-100 hover:border hover:border-blue-300 rounded px-1 transition-all ${
                       investigatedHotspots.has('urgency') ? 'bg-green-100 border border-green-300' : ''
                     }`}
                     onClick={() => handleHotspotClick('urgency')}
                     onMouseEnter={(e) => handleHotspotMouseEnter(e, 'urgency')}
                     onMouseLeave={handleHotspotMouseLeave}
                   >
                     URGENT: Confidential Payment Required Today
                   </span>
                   {!investigatedHotspots.has('urgency') && (
                     <span className="ml-2 text-blue-600 text-xs">!</span>
                   )}
                 </div>
                <div className="mb-2">
                  <span className="text-gray-600 font-semibold w-16 inline-block">Date:</span>
                  <span>March 20, 2024 4:47 PM</span>
                </div>
                                 <div className="mb-2">
                   <span className="text-gray-600 font-semibold w-16 inline-block">Reply-To:</span>
                   <span 
                     className={`cursor-pointer hover:bg-blue-100 hover:border hover:border-blue-300 rounded px-1 transition-all ${
                       investigatedHotspots.has('reply') ? 'bg-green-100 border border-green-300' : ''
                     }`}
                     onClick={() => handleHotspotClick('reply')}
                     onMouseEnter={(e) => handleHotspotMouseEnter(e, 'reply')}
                     onMouseLeave={handleHotspotMouseLeave}
                   >
                     mchen.ceo@tempmail-service.net
                   </span>
                   {!investigatedHotspots.has('reply') && (
                     <span className="ml-2 text-blue-600 text-xs">!</span>
                   )}
                 </div>
              </div>

              {/* Email Body */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm leading-relaxed">
                <p>Dear Finance Team,</p>
                
                                 <p>I need you to process an{' '}
                   <span 
                     className={`cursor-pointer hover:bg-blue-100 hover:border hover:border-blue-300 rounded px-1 transition-all ${
                       investigatedHotspots.has('pressure') ? 'bg-green-100 border border-green-300' : ''
                     }`}
                     onClick={() => handleHotspotClick('pressure')}
                     onMouseEnter={(e) => handleHotspotMouseEnter(e, 'pressure')}
                     onMouseLeave={handleHotspotMouseLeave}
                   >
                     urgent wire transfer
                   </span>
                   {' '}for a{' '}
                   <span 
                     className={`cursor-pointer hover:bg-blue-100 hover:border hover:border-blue-300 rounded px-1 transition-all ${
                       investigatedHotspots.has('secrecy') ? 'bg-green-100 border border-green-300' : ''
                     }`}
                     onClick={() => handleHotspotClick('secrecy')}
                     onMouseEnter={(e) => handleHotspotMouseEnter(e, 'secrecy')}
                     onMouseLeave={handleHotspotMouseLeave}
                   >
                     confidential acquisition
                   </span>
                   {' '}we're closing today.
                 </p>
                
                <p className="my-4">
                  <strong>Amount:</strong> $15,000.00<br />
                  <strong>Recipient:</strong> Strategic Consulting LLC<br />
                  <strong>Account:</strong> 4789362501<br />
                  <strong>Routing:</strong> 021000021
                </p>
                
                                 <p>
                   <span 
                     className={`cursor-pointer hover:bg-blue-100 hover:border hover:border-blue-300 rounded px-1 transition-all ${
                       investigatedHotspots.has('deadline') ? 'bg-green-100 border border-green-300' : ''
                     }`}
                     onClick={() => handleHotspotClick('deadline')}
                     onMouseEnter={(e) => handleHotspotMouseEnter(e, 'deadline')}
                     onMouseLeave={handleHotspotMouseLeave}
                   >
                     This must be completed by 5 PM today
                   </span>
                   {' '}or we'll lose the deal. Please confirm once sent.
                 </p>
                
                                 <p>
                   <span 
                     className={`cursor-pointer hover:bg-blue-100 hover:border hover:border-blue-300 rounded px-1 transition-all ${
                       investigatedHotspots.has('silence') ? 'bg-green-100 border border-green-300' : ''
                     }`}
                     onClick={() => handleHotspotClick('silence')}
                     onMouseEnter={(e) => handleHotspotMouseEnter(e, 'silence')}
                     onMouseLeave={handleHotspotMouseLeave}
                   >
                     Do not discuss this with anyone
                   </span>
                   {' '}until the acquisition is announced.
                 </p>
                
                                 <p className="mt-4">
                   Best regards,<br />
                   <span 
                     className={`cursor-pointer hover:bg-blue-100 hover:border hover:border-blue-300 rounded px-1 transition-all ${
                       investigatedHotspots.has('signature') ? 'bg-green-100 border border-green-300' : ''
                     }`}
                     onClick={() => handleHotspotClick('signature')}
                     onMouseEnter={(e) => handleHotspotMouseEnter(e, 'signature')}
                     onMouseLeave={handleHotspotMouseLeave}
                   >
                     Michael Chen
                   </span><br />
                   CEO
                 </p>
              </div>
            </div>
          </div>

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
              isMissionComplete={investigatedHotspots.size === Object.keys(mission.clues).length}
              onCompleteMission={completeMission}
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

export default MissionInvestigation; 