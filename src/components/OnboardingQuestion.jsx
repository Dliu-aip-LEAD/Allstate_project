import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import RoundedButton from './RoundedButton';
import TextBubble from './TextBubble';
import TypewriterText from './TypewriterText';
import Header from './Header';
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
    <div className="min-h-screen w-full bg-white flex flex-col items-center overflow-y-auto relative">
      {/* Header */}
      <Header variant="onboarding" />
      
      {/* Back Arrow */}
      {showBackButton && (
        <BackButton
          onClick={handleBackClick}
          className="absolute top-6 left-6 z-10"
          ariaLabel="Back"
        />
      )}
      
      {/* Main Content with top padding for fixed header */}
      <div className="flex flex-col items-center w-full max-w-xl px-4 py-8 pt-32 relative">
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
        <div className="flex flex-col gap-4 w-full max-w-xs mt-8">
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