import React from 'react';
import { useNavigate } from 'react-router-dom';
import onboard1 from '../assets/alli_question.png';
import BackButton from '../components/BackButton';
import RoundedButton from '../components/RoundedButton';
import TextBubble from '../components/TextBubble';
import TypewriterText from '../components/TypewriterText';
import styles from './OnboardingQuestion1.module.css';

const ageOptions = [
  'Under 18',
  '18-29 years old',
  '30-49 years old',
  '50-64 years old',
  'Over 65+',
];

const questionText = "First question - what's your age group? This helps me understand what types of scams you might encounter! 🕵️‍♂️";

const OnboardingQuestion1 = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 w-full h-full min-h-screen bg-white flex flex-col items-center overflow-hidden">
      {/* Header */}
      <div className="w-full flex flex-col items-center bg-[#0033A0] py-6 px-4 md:py-8 md:px-12 relative">
        <div className="w-full flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center">
            <span className="text-white text-2xl font-bold mr-2">Allstate</span>
            <span className="text-white text-xs font-whitney tracking-widest">IDENTITY PROTECTION</span>
          </div>
          <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center text-blue-900 font-bold text-lg">{/* Shield icon placeholder */} </div>
        </div>
      </div>
      {/* Back Arrow */}
      <BackButton
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6"
        ariaLabel="Back"
      />
      {/* Main Content */}
      <div className="flex flex-col items-center w-full max-w-xl px-4 mt-8 relative">
        <div className={styles.bubbleRow}>
          <img
            src={onboard1}
            alt="Detective Alli"
            className={styles.alliImage}
          />
          <TextBubble className={styles.speechBubble}>
            <div className={styles.bubbleTail} />
            <span className={styles.speechText}>
              <TypewriterText text={questionText} />
            </span>
          </TextBubble>
        </div>
        {/* Age Options */}
        <div className="flex flex-col gap-4 w-full max-w-xs mt-2">
          {ageOptions.map(option => (
            <RoundedButton
              key={option}
              className="bg-[#E2F0FF] text-[#0662CD] font-bold text-lg hover:bg-[#d0e7ff]"
            >
              {option}
            </RoundedButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuestion1; 