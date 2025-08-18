import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { defaultDetectiveAcademy } from './userProgress';

// Initialize complete user data structure for new registrations
export const initializeNewUser = async (userId, userData) => {
  try {
    const { name, email, onboardingAnswers } = userData;
    
    // Create complete user document structure
    const completeUserData = {
      // Basic user information
      name,
      email,
      onboardingAnswers,
      
      // Detective Academy data
      detectiveAcademy: {
        ...defaultDetectiveAcademy,
        // Customize initial values based on onboarding answers if needed
        level: 1,
        levelName: "Junior Detective",
        experience: 0,
        experienceToNextLevel: 100,
        totalScore: 0,
        currentScore: 0,
        missionsCompleted: 0,
        totalMissions: 0,
        successRate: 0,
        currentMissionId: null,
        currentMissionProgress: 0,
        departmentProgress: {
          'email-crimes': {
            progress: 0,
            missionsSolved: 0,
            totalMissions: 10,
            unlocked: true
          },
          'social-media': {
            progress: 0,
            missionsSolved: 0,
            totalMissions: 10,
            unlocked: true
          },
          'financial-crimes': {
            progress: 0,
            missionsSolved: 0,
            totalMissions: 10,
            unlocked: true
          },
          'elder-fraud': {
            progress: 0,
            missionsSolved: 0,
            totalMissions: 10,
            unlocked: false
          }
        }
      },
      
      // Mission and achievement tracking
      missionHistory: [],
      achievements: [],
      
      // Profile metadata
      createdAt: new Date(),
      lastLoginAt: new Date(),
      profileComplete: true,
      isActive: true,
      
      // Optional: Customize based on onboarding answers
      ...customizeUserProfile(onboardingAnswers)
    };
    
    // Save to Firestore
    await setDoc(doc(firestore, 'users', userId), completeUserData);
    
    console.log('New user initialized successfully:', userId);
    return completeUserData;
    
  } catch (error) {
    console.error('Error initializing new user:', error);
    throw error;
  }
};

// Customize user profile based on onboarding answers
const customizeUserProfile = (onboardingAnswers) => {
  const customizations = {};
  
  if (onboardingAnswers) {
    // Age-based customizations (question ID: 1)
    if (onboardingAnswers[1]) {
      const age = onboardingAnswers[1].value;
      if (age === 'under_18' || age === 'over_65') {
        customizations.riskLevel = 'high';
        customizations.recommendedMissions = ['email-imposter', 'social-media-scam'];
      } else if (age === '50_64') {
        customizations.riskLevel = 'medium-high';
        customizations.recommendedMissions = ['email-imposter'];
      } else {
        customizations.riskLevel = 'medium';
        customizations.recommendedMissions = ['email-imposter'];
      }
    }
    
    // Experience-based customizations (question ID: 2)
    if (onboardingAnswers[2]) {
      const experience = onboardingAnswers[2].value;
      if (experience === 'expert') {
        customizations.startingLevel = 2;
        customizations.experienceMultiplier = 1.2;
      } else if (experience === 'new') {
        customizations.startingLevel = 1;
        customizations.experienceMultiplier = 0.8;
        customizations.tutorialRequired = true;
      } else {
        customizations.startingLevel = 1;
        customizations.experienceMultiplier = 1.0;
      }
    }
    
    // Online activity-based customizations (question ID: 3)
    if (onboardingAnswers[3]) {
      const activity = onboardingAnswers[3].value;
      if (activity === 'online_shopping') {
        customizations.priorityDepartment = 'financial-crimes';
        customizations.riskAreas = ['payment_scams', 'fake_websites'];
      } else if (activity === 'social_media') {
        customizations.priorityDepartment = 'social-media';
        customizations.riskAreas = ['romance_scams', 'fake_profiles'];
      } else if (activity === 'work_emails') {
        customizations.priorityDepartment = 'email-crimes';
        customizations.riskAreas = ['phishing', 'business_email_compromise'];
      }
    }
    
    // Knowledge-based customizations (question ID: 4)
    if (onboardingAnswers[4]) {
      const knowledge = onboardingAnswers[4].value;
      if (knowledge === 'very_little') {
        customizations.tutorialRequired = true;
        customizations.startingDifficulty = 'beginner';
        customizations.learningPath = 'foundational';
      } else if (knowledge === 'a_lot') {
        customizations.startingDifficulty = 'intermediate';
        customizations.learningPath = 'advanced';
      } else {
        customizations.startingDifficulty = 'beginner';
        customizations.learningPath = 'standard';
      }
    }
  }
  
  return customizations;
};

// Create user profile summary for display
export const createProfileSummary = (onboardingAnswers) => {
  if (!onboardingAnswers || Object.keys(onboardingAnswers).length === 0) {
    return null;
  }
  
  const summary = [];
  
  Object.entries(onboardingAnswers).forEach(([key, value]) => {
    if (value && value.label) {
      summary.push({
        question: getQuestionText(key),
        answer: value.label,
        category: key
      });
    }
  });
  
  return summary;
};

// Get human-readable question text
const getQuestionText = (key) => {
  const questionMap = {
    1: "Age Group",
    2: "Online Experience", 
    3: "Primary Online Activity",
    4: "Scam Knowledge Level"
  };
  
  return questionMap[key] || key.toString();
};

// Validate onboarding answers
export const validateOnboardingAnswers = (onboardingAnswers) => {
  if (!onboardingAnswers) return false;
  
  // Check for the 4 required onboarding questions (IDs 1, 2, 3, 4)
  const requiredFields = [1, 2, 3, 4];
  const hasAllFields = requiredFields.every(fieldId => 
    onboardingAnswers[fieldId] && onboardingAnswers[fieldId].value
  );
  
  return hasAllFields;
};

// Get recommended starting mission based on profile
export const getRecommendedStartingMission = (userProfile) => {
  if (!userProfile || !userProfile.detectiveAcademy) {
    return 'email-imposter'; // Default starting mission
  }
  
  // Check if user has custom recommendations
  if (userProfile.recommendedMissions && userProfile.recommendedMissions.length > 0) {
    return userProfile.recommendedMissions[0];
  }
  
  // Default recommendation based on risk level
  if (userProfile.riskLevel === 'high') {
    return 'email-imposter'; // Start with most common scam type
  } else if (userProfile.riskLevel === 'medium-high') {
    return 'email-imposter';
  } else {
    return 'email-imposter';
  }
};

// Initialize user's first mission
export const initializeFirstMission = async (userId, userProfile) => {
  try {
    const startingMission = getRecommendedStartingMission(userProfile);
    
    // Update user's current mission
    const userRef = doc(firestore, 'users', userId);
    await setDoc(userRef, {
      'detectiveAcademy.currentMissionId': startingMission,
      'detectiveAcademy.currentMissionProgress': 0
    }, { merge: true });
    
    return startingMission;
    
  } catch (error) {
    console.error('Error initializing first mission:', error);
    throw error;
  }
};

// Complete user onboarding process
export const completeUserOnboarding = async (userId, onboardingAnswers) => {
  try {
    // Validate onboarding answers
    if (!validateOnboardingAnswers(onboardingAnswers)) {
      throw new Error('Invalid onboarding answers');
    }
    
    // Create user profile
    const userProfile = customizeUserProfile(onboardingAnswers);
    
    // Initialize first mission
    const startingMission = await initializeFirstMission(userId, userProfile);
    
    console.log('User onboarding completed successfully');
    return {
      success: true,
      startingMission,
      userProfile
    };
    
  } catch (error) {
    console.error('Error completing user onboarding:', error);
    throw error;
  }
}; 