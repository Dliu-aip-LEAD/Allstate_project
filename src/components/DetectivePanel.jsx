import React, { useRef, useEffect } from 'react';

const DetectivePanel = ({ 
  messages, 
  currentQuiz, 
  quizAnswered, 
  onAnswerClick, 
  evidence, 
  score, 
  flagsFound, 
  accuracy,
  isMissionComplete,
  onCompleteMission
}) => {
  const chatAreaRef = useRef(null);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-scroll to bottom when quiz appears
  useEffect(() => {
    if (chatAreaRef.current && currentQuiz) {
      setTimeout(() => {
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      }, 100);
    }
  }, [currentQuiz]);

  return (
    <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg flex flex-col h-full ">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg">
          🕵️
        </div>
        <div>
          <div className="font-semibold text-sm">Detective Alli</div>
          <div className="text-xs opacity-90">Analyzing with you</div>
        </div>
      </div>
      
      {/* Chat Area - Flexible height with scroll */}
      <div 
        className="flex-1 p-4 bg-gray-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0" 
        ref={chatAreaRef}
        style={{ 
          minHeight: '150px',
          maxHeight: '250px'
        }}
      >
        {messages.map((message, index) => (
          <div key={`message-${message.id}-${index}`} className={`mb-3 ${message.sender === 'alli' ? 'flex gap-2' : 'text-right'}`}>
            {message.sender === 'alli' && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0">
                🕵️
              </div>
            )}
            <div className={`px-3 py-2 rounded-lg text-sm ${
              message.sender === 'alli' 
                ? 'bg-white shadow-sm border border-gray-200' 
                : 'bg-blue-500 text-white inline-block'
            }`}>
              {message.text}
            </div>
          </div>
        ))}
        
        {/* Empty state when no messages */}
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-6">
            <div className="text-2xl mb-2">🕵️</div>
            <div>Ready to investigate!</div>
          </div>
        )}
      </div>
      
      {/* Action Panel - Scrollable if needed */}
      <div className="p-4 border-t border-gray-200 flex flex-col min-h-0 flex-1 overflow-hidden">
        {currentQuiz ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 flex-shrink-0">
            <div className="text-sm font-semibold text-blue-800 mb-2">
              {currentQuiz.quiz.text}
            </div>
            <div className="space-y-2">
              {currentQuiz.quiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onAnswerClick(option.correct, currentQuiz.quiz.feedback)}
                  disabled={quizAnswered}
                  className={`w-full text-left p-2 border rounded text-sm transition-all ${
                    quizAnswered
                      ? option.correct
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-red-100 border-red-300 text-red-800'
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ) : isMissionComplete ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 text-center flex-shrink-0">
            <div className="text-sm font-semibold text-green-800 mb-3">
              🎉 All steps complete!
            </div>
            <button
              onClick={onCompleteMission}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              Submit & View Results
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 text-center flex-shrink-0">
            <div className="text-sm text-gray-600">
              Click on suspicious elements in the email to investigate them
            </div>
          </div>
        )}
        
        {/* Evidence Panel - Scrollable */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 flex-shrink-0">
            🚩 Red Flags Discovered
          </div>
          <div className="space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 min-h-0">
            {evidence.length === 0 ? (
              <div className="text-center text-gray-400 text-xs py-4">
                No red flags discovered yet
              </div>
            ) : (
              evidence.map((item, index) => (
                <div key={`evidence-${item.id || index}-${index}`} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2 text-xs flex-shrink-0">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    !
                  </div>
                  <span className="text-gray-700 break-words">
                    {item.redFlag || item.text || item.title || 'Red flag discovered'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
 
      {/* Score Panel - Removed */}
    </div>
  );
};

export default DetectivePanel; 