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

const FakeGiveawayInvestigation = () => {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const tooltipRef = React.useRef(null);

  // State management
  const [score, setScore] = useState(0);
  const [flagsFound, setFlagsFound] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [investigatedHotspots, setInvestigatedHotspots] = useState(new Set());
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mission, setMission] = useState(null);
  const [messages, setMessages] = useState([]);
  const [verdicts, setVerdicts] = useState({}); // { postId: 'scam' | 'legitimate' }
  const [feedbackShown, setFeedbackShown] = useState({}); // { postId: true/false }

  // Initialize messages
  const initializeMessages = (missionData) => {
    if (missionData.content.type === 'social-media-posts') {
      const initialMessages = [
        {
          id: 1,
          sender: 'alli',
          text: missionData.content.scenario || "Welcome! Analyze these social media posts carefully to determine which are legitimate and which are scams."
        },
        {
          id: 2,
          sender: 'alli',
          text: "Click on highlighted suspicious elements in each post to investigate them. Then make your verdict for each post."
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

  // Handle clicking on highlighted elements
  const handleHotspotClick = (postId, element) => {
    if (!mission) return;
    
    const post = mission.content.posts.find(p => p.postId === postId);
    if (!post) return;

    const hotspotKey = `${postId}-${element.text}`;
    if (investigatedHotspots.has(hotspotKey)) return;

    // Mark as investigated
    setInvestigatedHotspots(prev => new Set([...prev, hotspotKey]));
    setFlagsFound(prev => prev + 1);

    // Add message about the red flag
    addMessage(`🚩 Red Flag Found: ${element.flagType}`, 'alli');
    addMessage(`📝 ${element.tooltip}`, 'alli');

    // Add to evidence
    setEvidence(prev => [...prev, {
      id: `evid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'redFlag',
      postId,
      title: element.flagType,
      description: element.tooltip,
      redFlag: element.text
    }]);
  };

  // Handle verdict submission
  const handleVerdictSubmit = (postId, verdict) => {
    if (!mission) return;
    if (verdicts[postId]) return; // Already submitted

    const post = mission.content.posts.find(p => p.postId === postId);
    if (!post) return;

    const isCorrect = verdict === post.correctVerdict;
    const feedback = isCorrect ? post.feedback.correct : post.feedback.incorrect;

    // Update verdicts
    setVerdicts(prev => ({ ...prev, [postId]: verdict }));
    setFeedbackShown(prev => ({ ...prev, [postId]: true }));

    // Update score
    if (isCorrect) {
      const pointsPerPost = mission.scoring.scorePerCorrectVerdict || 33;
      setScore(prev => Math.min(prev + pointsPerPost, 100));
      setCorrectAnswers(prev => prev + 1);
      addMessage(`✅ Correct! ${feedback.title}`, 'alli');
    } else {
      addMessage(`❌ Incorrect. ${feedback.title}`, 'alli');
    }

    setTotalQuestions(prev => prev + 1);

    // Add feedback message
    addMessage(feedback.message, 'alli');
    feedback.redFlags.forEach(flag => {
      addMessage(flag, 'alli');
    });
  };

  useEffect(() => {
    // Load mission data from missions.js
    if (missionId && missions[missionId]) {
      const missionData = missions[missionId];
      setMission(missionData);
      
      // Initialize messages
      initializeMessages(missionData);
      
      // Set total questions (number of posts)
      setTotalQuestions(missionData.content.posts?.length || 0);
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
    return Object.keys(verdicts).length === mission.content.posts.length;
  };

  // Handle mission completion
  const handleMissionCompletion = async () => {
    if (!mission) return;

    try {
      // Calculate final results
      const finalScore = score;
      const finalAccuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100;
      
      // Check if user passed (minimum correct verdicts)
      const correctCount = Object.keys(verdicts).filter(postId => {
        const post = mission.content.posts.find(p => p.postId === postId);
        return post && verdicts[postId] === post.correctVerdict;
      }).length;

      const minimumCorrect = mission.completionRequirements?.minimumCorrect || 2;
      const passed = correctCount >= minimumCorrect;

      // Prepare user performance data
      const userPerformance = {
        score: finalScore,
        maxScore: mission.scoring.maxScore,
        flagsFound,
        totalQuestions,
        correctAnswers,
        accuracy: finalAccuracy,
        evidence,
        verdicts,
        correctCount,
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

  // Helper function to render text with markdown-style formatting
  const renderFormattedText = (text) => {
    // Simple markdown rendering: **bold**
    const parts = [];
    let lastIndex = 0;
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      // Add bold text
      parts.push({ type: 'bold', content: match[1] });
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }
    
    if (parts.length === 0) {
      return text;
    }
    
    return parts.map((part, idx) => {
      if (part.type === 'bold') {
        return <strong key={idx}>{part.content}</strong>;
      }
      return <span key={idx}>{part.content}</span>;
    });
  };

  // Render post content with highlighted elements
  const renderPostContent = (post) => {
    if (!post.content.highlightedElements || post.content.highlightedElements.length === 0) {
      // No highlighted elements, render text as-is with formatting
      return (
        <div className="text-sm leading-relaxed whitespace-pre-line">
          {renderFormattedText(post.content.text)}
        </div>
      );
    }

    // Render text with highlighted clickable elements
    let text = post.content.text;
    const elements = post.content.highlightedElements;
    
    // Sort by length (longest first) to avoid partial matches
    const sortedElements = [...elements].sort((a, b) => b.text.length - a.text.length);
    
    // First, find all matches and their positions
    const matches = [];
    sortedElements.forEach((element) => {
      const searchText = text;
      const searchElement = element.text;
      let searchIndex = 0;
      
      while (true) {
        const index = searchText.indexOf(searchElement, searchIndex);
        if (index === -1) break;
        
        matches.push({
          index,
          length: searchElement.length,
          element,
          hotspotKey: `${post.postId}-${element.text}`
        });
        searchIndex = index + 1;
      }
    });
    
    // Sort matches by index
    matches.sort((a, b) => a.index - b.index);
    
    // Remove overlapping matches (keep first match)
    const nonOverlappingMatches = [];
    let lastEnd = 0;
    matches.forEach(match => {
      if (match.index >= lastEnd) {
        nonOverlappingMatches.push(match);
        lastEnd = match.index + match.length;
      }
    });
    
    // Build parts array
    const parts = [];
    let lastIndex = 0;
    
    nonOverlappingMatches.forEach((match) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({ 
          type: 'text', 
          content: text.slice(lastIndex, match.index) 
        });
      }
      
      // Add highlighted element
      const isInvestigated = investigatedHotspots.has(match.hotspotKey);
      parts.push({ 
        type: 'hotspot', 
        content: text.slice(match.index, match.index + match.length),
        element: match.element,
        hotspotKey: match.hotspotKey,
        isInvestigated
      });
      
      lastIndex = match.index + match.length;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }
    
    // If no matches found, render as plain text
    if (parts.length === 0) {
      return (
        <div className="text-sm leading-relaxed whitespace-pre-line">
          {renderFormattedText(text)}
        </div>
      );
    }
    
    return (
      <div className="text-sm leading-relaxed whitespace-pre-line">
        {parts.map((part, idx) => {
          if (part.type === 'hotspot') {
            return (
              <span
                key={idx}
                onClick={() => handleHotspotClick(post.postId, part.element)}
                className={`inline-block cursor-pointer px-1 rounded transition-all ${
                  part.isInvestigated
                    ? 'bg-green-100 border border-green-300 text-green-800'
                    : 'bg-yellow-100 border border-yellow-300 text-yellow-800 hover:bg-yellow-200'
                }`}
                title={part.element.tooltip}
              >
                {part.content}
              </span>
            );
          }
          return <span key={idx}>{renderFormattedText(part.content)}</span>;
        })}
      </div>
    );
  };

  // Render a single social media post
  const renderPost = (post) => {
    const verdictSubmitted = !!verdicts[post.postId];
    const showFeedback = feedbackShown[post.postId];
    const feedback = verdictSubmitted 
      ? (verdicts[post.postId] === post.correctVerdict ? post.feedback.correct : post.feedback.incorrect)
      : null;

    return (
      <div key={post.postId} className="bg-white rounded-xl overflow-hidden shadow-lg mb-6">
        {/* Post Header */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
            {post.header.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{post.header.username}</span>
              {post.header.verified && (
                <span className="text-blue-500 text-sm">✓</span>
              )}
              {!post.header.verified && post.header.verifiedBadge && (
                <span 
                  className="text-gray-400 text-sm cursor-pointer hover:text-yellow-500"
                  onClick={() => handleHotspotClick(post.postId, { 
                    text: post.header.verifiedBadge, 
                    flagType: 'fakeVerification',
                    tooltip: 'Fake verification badge'
                  })}
                  title="Click to flag: Fake verification badge"
                >
                  {post.header.verifiedBadge}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">{post.header.timestamp}</div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-4">
          {renderPostContent(post)}
        </div>

        {/* Post Stats */}
        <div className="px-4 py-3 border-t border-gray-200 flex gap-6 text-sm text-gray-600">
          <span>❤️ {post.stats.likes.toLocaleString()} likes</span>
          <span>💬 {post.stats.comments.toLocaleString()} comments</span>
          <span>🔄 {post.stats.shares.toLocaleString()} shares</span>
        </div>

        {/* Verdict Section */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="text-center font-semibold text-gray-800 mb-4">
            What's your verdict?
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleVerdictSubmit(post.postId, 'legitimate')}
              disabled={verdictSubmitted}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                verdictSubmitted
                  ? verdicts[post.postId] === 'legitimate'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
              }`}
            >
              ✅ Legitimate
            </button>
            <button
              onClick={() => handleVerdictSubmit(post.postId, 'scam')}
              disabled={verdictSubmitted}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                verdictSubmitted
                  ? verdicts[post.postId] === 'scam'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white hover:scale-105'
              }`}
            >
              🚨 SCAM
            </button>
          </div>

          {/* Feedback Box */}
          {showFeedback && feedback && (
            <div className={`mt-4 p-4 rounded-lg border-2 ${
              verdicts[post.postId] === post.correctVerdict
                ? 'bg-green-50 border-green-300'
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="font-semibold mb-2 text-sm">
                {feedback.title}
              </div>
              <div className="text-sm text-gray-700 mb-2">
                {feedback.message}
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                {feedback.redFlags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
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

  const totalPosts = mission.content.posts?.length || 0;
  const progress = totalPosts > 0 ? (Object.keys(verdicts).length / totalPosts) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-700">
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
              <span>Verdicts: {Object.keys(verdicts).length} of {totalPosts}</span>
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

      <div className="flex-1 max-w-7xl mx-auto w-full p-2 md:p-4">
        <div className="mission-layout">
          
          {/* Mission Content Panel */}
          <div className="min-h-0">
            {/* Mission Briefing */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 mb-6 shadow-lg">
              <div className="text-white">
                <div className="text-2xl font-bold mb-2">🎁 Social Media Giveaway Investigation</div>
                <div className="text-sm opacity-90">Legitimate vs. Scam Giveaway Detection</div>
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

            {/* Social Media Posts */}
            <div className="space-y-6">
              {mission.content.posts?.map(post => renderPost(post))}
            </div>
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

export default FakeGiveawayInvestigation;

