import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import RoundedButton from './RoundedButton';
import TextBubble from './TextBubble';
import TypewriterText from './TypewriterText';
import styles from '../screens/OnboardingQuestions.module.css';

const OnboardingQuestion = ({ 
  questionData, 
  onOptionSelect, 
  showBackButton = true,
  backButtonAction = null 
}) => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    if (backButtonAction) {
      backButtonAction();
    } else {
      navigate(-1);
    }
  };

  const handleOptionClick = (option) => {
    if (onOptionSelect) {
      onOptionSelect(option);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen bg-white flex flex-col items-center overflow-hidden">
      {/* Header */}
      <div className="w-full flex flex-col items-center bg-[#0033A0] py-6 px-4 md:py-8 md:px-12 relative">
        <div className="w-full flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center">
            <span className="text-white text-2xl font-bold mr-2">Allstate</span>
            <span className="text-white text-xs font-whitney tracking-widest">IDENTITY PROTECTION</span>
          </div>
          <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center text-blue-900 font-bold text-lg">
            {/* Shield icon placeholder */}
          </div>
        </div>
      </div>
      
      {/* Back Arrow */}
      {showBackButton && (
        <BackButton
          onClick={handleBackClick}
          className="absolute top-6 left-6"
          ariaLabel="Back"
        />
      )}
      
      {/* Main Content */}
      <div className="flex flex-col items-center w-full max-w-xl px-4 mt-8 relative">
        <div className={styles.bubbleRow}>
          <img
            src={questionData.image}
            alt={questionData.imageAlt || "Detective Alli"}
            className={styles.alliImage}
          />
          <TextBubble className={styles.speechBubble}>
            <div className={styles.bubbleTail} />
            <span className={styles.speechText}>
              <TypewriterText text={questionData.question} />
            </span>
          </TextBubble>
        </div>
        
        {/* Options */}
        <div className="flex flex-col gap-4 w-full max-w-xs mt-2">
          {questionData.options.map((option, index) => (
            <RoundedButton
              key={index}
              onClick={() => handleOptionClick(option)}
              className="bg-[#E2F0FF] text-[#0662CD] font-bold text-lg hover:bg-[#d0e7ff] w-full px-8 py-4 text-left flex flex-col items-start"
            >
              <span className="font-bold text-[#0662CD] mb-1 leading-tight">{option.label}</span>
              {option.description && (
                <span className="font-normal text-[#0662CD] text-base leading-tight">{option.description}</span>
              )}
            </RoundedButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuestion; 