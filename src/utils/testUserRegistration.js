// Test script for user registration functionality
// Run these functions in browser console to test new user registration

import { initializeNewUser, createProfileSummary, validateOnboardingAnswers } from './userInitialization';

// Test onboarding answers validation
export const testOnboardingValidation = () => {
  console.log('🧪 Testing onboarding answers validation...');
  
  // Test valid onboarding answers
  const validAnswers = {
    age: { label: '30-49 years old', value: '30_49' },
    experience: { label: 'Regular user', value: 'regular' },
    activity: { label: 'Online shopping and banking', value: 'online_shopping' },
    knowledge: { label: 'Some knowledge', value: 'some_knowledge' }
  };
  
  const isValid = validateOnboardingAnswers(validAnswers);
  console.log('✅ Valid answers validation:', isValid);
  
  // Test invalid onboarding answers (missing fields)
  const invalidAnswers = {
    age: { label: '30-49 years old', value: '30_49' },
    experience: { label: 'Regular user', value: 'regular' }
    // Missing activity and knowledge
  };
  
  const isInvalid = validateOnboardingAnswers(invalidAnswers);
  console.log('✅ Invalid answers validation:', isInvalid);
  
  return { valid: isValid, invalid: isInvalid };
};

// Test profile summary creation
export const testProfileSummary = () => {
  console.log('🧪 Testing profile summary creation...');
  
  const onboardingAnswers = {
    age: { label: '50-64 years old', value: '50_64' },
    experience: { label: 'Expert', value: 'expert' },
    activity: { label: 'Work emails and video calls', value: 'work_emails' },
    knowledge: { label: 'A lot', value: 'a_lot' }
  };
  
  const summary = createProfileSummary(onboardingAnswers);
  console.log('✅ Profile summary created:', summary);
  
  return summary;
};

// Test new user initialization (simulation)
export const testNewUserInitialization = async () => {
  console.log('🧪 Testing new user initialization (simulation)...');
  
  // Simulate user data
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    onboardingAnswers: {
      age: { label: '18-29 years old', value: '18_29' },
      experience: { label: 'Casual user', value: 'casual' },
      activity: { label: 'Social media and messaging', value: 'social_media' },
      knowledge: { label: 'A little', value: 'a_little' }
    }
  };
  
  try {
    // Note: This is a simulation - in real usage, you'd pass an actual user ID
    console.log('✅ User data structure prepared:', userData);
    console.log('📝 In real usage, this would be saved to Firestore with a user ID');
    
    return userData;
  } catch (error) {
    console.error('❌ Error in user initialization simulation:', error);
    return null;
  }
};

// Test onboarding flow simulation
export const testOnboardingFlow = () => {
  console.log('🧪 Testing complete onboarding flow simulation...');
  
  // Step 1: User answers onboarding questions
  const onboardingAnswers = {
    age: { label: 'Over 65+', value: 'over_65' },
    experience: { label: 'New to technology', value: 'new' },
    activity: { label: 'Basic browsing/entertainment', value: 'basic_browsing' },
    knowledge: { label: 'Very little', value: 'very_little' }
  };
  
  console.log('📋 Step 1: Onboarding answers collected:', onboardingAnswers);
  
  // Step 2: Validate answers
  const isValid = validateOnboardingAnswers(onboardingAnswers);
  console.log('✅ Step 2: Answers validation:', isValid);
  
  if (!isValid) {
    console.log('❌ Onboarding incomplete - cannot proceed');
    return false;
  }
  
  // Step 3: Create profile summary
  const profileSummary = createProfileSummary(onboardingAnswers);
  console.log('📊 Step 3: Profile summary created:', profileSummary);
  
  // Step 4: Prepare user data structure
  const userData = {
    name: 'Senior User',
    email: 'senior@example.com',
    onboardingAnswers
  };
  
  console.log('👤 Step 4: User data prepared:', userData);
  console.log('🎯 This user would get:');
  console.log('   - High risk level (age 65+)');
  console.log('   - Tutorial required (new to technology)');
  console.log('   - Beginner difficulty');
  console.log('   - Foundational learning path');
  
  return {
    success: true,
    onboardingAnswers,
    profileSummary,
    userData,
    recommendations: {
      riskLevel: 'high',
      tutorialRequired: true,
      startingDifficulty: 'beginner',
      learningPath: 'foundational'
    }
  };
};

// Test different user profiles
export const testUserProfiles = () => {
  console.log('🧪 Testing different user profile types...');
  
  const profiles = [
    {
      name: 'Young Expert',
      answers: {
        age: { label: '18-29 years old', value: '18_29' },
        experience: { label: 'Expert', value: 'expert' },
        activity: { label: 'Work emails and video calls', value: 'work_emails' },
        knowledge: { label: 'A lot', value: 'a_lot' }
      },
      expected: {
        riskLevel: 'medium',
        startingLevel: 2,
        experienceMultiplier: 1.2,
        priorityDepartment: 'email-crimes'
      }
    },
    {
      name: 'Shopping Enthusiast',
      answers: {
        age: { label: '30-49 years old', value: '30_49' },
        experience: { label: 'Regular user', value: 'regular' },
        activity: { label: 'Online shopping and banking', value: 'online_shopping' },
        knowledge: { label: 'Some knowledge', value: 'some_knowledge' }
      },
      expected: {
        riskLevel: 'medium',
        priorityDepartment: 'financial-crimes',
        riskAreas: ['payment_scams', 'fake_websites']
      }
    },
    {
      name: 'Social Media User',
      answers: {
        age: { label: '18-29 years old', value: '18_29' },
        experience: { label: 'Regular user', value: 'regular' },
        activity: { label: 'Social media and messaging', value: 'social_media' },
        knowledge: { label: 'A little', value: 'a_little' }
      },
      expected: {
        riskLevel: 'medium',
        priorityDepartment: 'social-media',
        riskAreas: ['romance_scams', 'fake_profiles']
      }
    }
  ];
  
  const results = profiles.map(profile => {
    const isValid = validateOnboardingAnswers(profile.answers);
    const summary = createProfileSummary(profile.answers);
    
    return {
      name: profile.name,
      isValid,
      summary,
      expected: profile.expected
    };
  });
  
  console.log('✅ User profile test results:', results);
  return results;
};

// Run all registration tests
export const runAllRegistrationTests = async () => {
  console.log('🚀 Starting all user registration tests...');
  console.log('=====================================');
  
  const results = {
    onboardingValidation: testOnboardingValidation(),
    profileSummary: testProfileSummary(),
    userInitialization: await testNewUserInitialization(),
    onboardingFlow: testOnboardingFlow(),
    userProfiles: testUserProfiles()
  };
  
  console.log('=====================================');
  console.log('📊 Registration Test Results Summary:');
  console.log(results);
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testUserRegistration = {
    testOnboardingValidation,
    testProfileSummary,
    testNewUserInitialization,
    testOnboardingFlow,
    testUserProfiles,
    runAllRegistrationTests
  };
  
  console.log('🧪 User registration test functions loaded. Use window.testUserRegistration.runAllRegistrationTests() to run all tests.');
}

// Export all test functions
export default {
  testOnboardingValidation,
  testProfileSummary,
  testNewUserInitialization,
  testOnboardingFlow,
  testUserProfiles,
  runAllRegistrationTests
}; 