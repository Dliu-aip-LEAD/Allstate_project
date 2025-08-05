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

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-white bg-opacity-95 rounded-2xl shadow-lg flex flex-col h-full">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center gap-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg">
          🕵️
        </div>
        <div>
          <div className="font-semibold text-sm">Detective Alli</div>
          <div className="text-xs opacity-90">Analyzing with you</div>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto" ref={chatAreaRef}>
        {messages.map((message) => (
          <div key={message.id} className={`mb-3 ${message.sender === 'alli' ? 'flex gap-2' : 'text-right'}`}>
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
      </div>
      
      {/* Action Panel */}
      <div className="p-4 border-t border-gray-200">
        {currentQuiz ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 text-center">
            <div className="text-sm font-semibold text-green-800 mb-3">
              🎉 Investigation Complete!
            </div>
            <button
              onClick={onCompleteMission}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all"
            >
              View Results & Continue
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 text-center">
            <div className="text-sm text-gray-600">
              Click on suspicious elements in the email to investigate them
            </div>
          </div>
        )}
        
        {/* Evidence Panel */}
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
            🚩 Red Flags Discovered
          </div>
          <div className="space-y-1">
            {evidence.map((item) => (
              <div key={item.id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2 text-xs">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  !
                </div>
                <span className="text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Score Panel */}
      <div className="bg-gray-800 text-white p-3 rounded-b-2xl">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold">{score}</div>
            <div className="text-xs opacity-70 uppercase tracking-wider">Score</div>
          </div>
          <div>
            <div className="text-lg font-bold">{flagsFound}</div>
            <div className="text-xs opacity-70 uppercase tracking-wider">Red Flags</div>
          </div>
          <div>
            <div className="text-lg font-bold">{accuracy}%</div>
            <div className="text-xs opacity-70 uppercase tracking-wider">Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectivePanel; 