import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingQuestion from '../components/OnboardingQuestion';
import { onboardingQuestions } from '../data/onboardingQuestions';

const OnboardingFlow = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const currentQuestion = onboardingQuestions[currentQuestionIndex];

  const handleOptionSelect = (selectedOption) => {
    // Save the answer
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: selectedOption
    };
    setAnswers(newAnswers);

    // Move to next question or finish onboarding
    if (currentQuestionIndex < onboardingQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Onboarding complete - you can navigate to results or next screen
      console.log('Onboarding complete!', newAnswers);
      // Navigate to next screen (you can customize this)
      navigate('/onboarding-complete', { state: { answers: newAnswers } });
    }
  };

  const handleBackClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Go back to previous screen if on first question
      navigate(-1);
    }
  };

  return (
    <OnboardingQuestion
      questionData={currentQuestion}
      onOptionSelect={handleOptionSelect}
      showBackButton={true}
      backButtonAction={handleBackClick}
    />
  );
};

export default OnboardingFlow; 