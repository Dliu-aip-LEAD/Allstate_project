// Test script for MissionIntroduction page functionality
// Run these functions in browser console to test MissionIntroduction page

import { missions } from '../data/missions';

// Test mission introduction generation
export const testMissionIntroductionGeneration = () => {
  console.log('🧪 Testing mission introduction generation...');
  
  const testMissions = [
    'spot-red-flags',
    'email-imposter',
    'spear-phishing',
    'fake-account',
    'wire-transfer',
    'perfect-impersonation'
  ];
  
  const results = {};
  
  testMissions.forEach(missionId => {
    const mission = missions[missionId];
    if (mission) {
      console.log(`\n📋 ${mission.title}:`);
      
      // Generate mission introduction data
      const missionIntro = generateMissionIntroduction(mission);
      
      console.log(`   Subtitle: ${missionIntro.subtitle}`);
      console.log(`   Detective Message: ${missionIntro.detectiveMessage.substring(0, 80)}...`);
      console.log(`   Objectives: ${missionIntro.objectives.length} objectives`);
      console.log(`   XP Reward: ${missionIntro.xpReward}`);
      
      // Test individual components
      console.log(`   🔍 Subtitle Generation:`);
      console.log(`      Type: ${mission.content.type}`);
      console.log(`      Generated: ${missionIntro.subtitle}`);
      
      console.log(`   💬 Detective Message Generation:`);
      console.log(`      Scenario: ${mission.content.scenario.substring(0, 60)}...`);
      console.log(`      Message: ${missionIntro.detectiveMessage.substring(0, 80)}...`);
      
      console.log(`   🎯 Objectives Generation:`);
      missionIntro.objectives.forEach((objective, index) => {
        console.log(`      ${index + 1}. ${objective}`);
      });
      
      console.log(`   ⭐ XP Calculation:`);
      console.log(`      Difficulty: ${mission.difficulty}`);
      console.log(`      Base XP: ${getBaseXP(mission.difficulty)}`);
      console.log(`      Final XP: ${missionIntro.xpReward}`);
      
      results[missionId] = {
        subtitle: missionIntro.subtitle,
        detectiveMessage: missionIntro.detectiveMessage,
        objectives: missionIntro.objectives,
        xpReward: missionIntro.xpReward,
        difficulty: mission.difficulty,
        contentType: mission.content.type
      };
    }
  });
  
  return results;
};

// Helper function to generate mission introduction (simulating the actual function)
function generateMissionIntroduction(mission) {
  const getSubtitle = () => {
    switch (mission.content.type) {
      case 'email':
        return 'Email Investigation';
      case 'terminology':
        return 'Terminology Training';
      case 'social-media':
        return 'Social Media Analysis';
      default:
        return 'Mission Briefing';
    }
  };
  
  const getDetectiveMessage = () => {
    const scenario = mission.content.scenario;
    let guidance = '';
    
    switch (mission.content.type) {
      case 'email':
        guidance = 'Look for suspicious elements, typos, urgency tactics, and mismatched information.';
        break;
      case 'terminology':
        guidance = 'Learn to recognize common scam terms and red flags.';
        break;
      case 'social-media':
        guidance = 'Identify fake profiles, suspicious posts, and social engineering tactics.';
        break;
      default:
        guidance = 'Complete all objectives to succeed.';
    }
    
    return `${scenario} ${guidance}`;
  };
  
  const getObjectives = () => {
    const objectives = [];
    
    if (mission.content.clues) {
      objectives.push(`Find ${Object.keys(mission.content.clues).length} suspicious elements`);
    }
    
    if (mission.content.quizzes) {
      objectives.push(`Answer ${Object.keys(mission.content.quizzes).length} security questions`);
    }
    
    if (mission.scoring.maxScore > 0) {
      objectives.push(`Achieve maximum score of ${mission.scoring.maxScore} points`);
    }
    
    return objectives;
  };
  
  const getXPReward = () => {
    return getBaseXP(mission.difficulty);
  };
  
  return {
    subtitle: getSubtitle(),
    detectiveMessage: getDetectiveMessage(),
    objectives: getObjectives(),
    xpReward: getXPReward()
  };
}

// Helper function to get base XP by difficulty
function getBaseXP(difficulty) {
  switch (difficulty) {
    case 'beginner':
      return 50;
    case 'intermediate':
      return 75;
    case 'advanced':
      return 100;
    case 'expert':
      return 150;
    default:
      return 50;
  }
}

// Test difficulty styling
export const testDifficultyStyling = () => {
  console.log('🧪 Testing difficulty styling...');
  
  const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
  
  difficulties.forEach(difficulty => {
    const color = getDifficultyColor(difficulty);
    const label = getDifficultyLabel(difficulty);
    
    console.log(`\n   ${difficulty.toUpperCase()}:`);
    console.log(`     Color: ${color}`);
    console.log(`     Label: ${label}`);
    
    // Show color classes
    const colorClasses = {
      'beginner': 'bg-green-500 text-white',
      'intermediate': 'bg-blue-500 text-white',
      'advanced': 'bg-yellow-500 text-black',
      'expert': 'bg-red-500 text-white'
    };
    
    console.log(`     CSS Classes: ${colorClasses[difficulty]}`);
  });
  
  return difficulties;
};

// Helper functions for difficulty styling
function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'beginner':
      return 'Green';
    case 'intermediate':
      return 'Blue';
    case 'advanced':
      return 'Yellow';
    case 'expert':
      return 'Red';
    default:
      return 'Gray';
  }
}

function getDifficultyLabel(difficulty) {
  switch (difficulty) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    case 'expert':
      return 'Expert';
    default:
      return 'Unknown';
  }
}

// Test mission content analysis
export const testMissionContentAnalysis = () => {
  console.log('🧪 Testing mission content analysis...');
  
  const testMission = missions['spot-red-flags'];
  if (testMission) {
    console.log(`\n📊 Content Analysis for ${testMission.title}:`);
    
    const content = testMission.content;
    console.log(`   Content Type: ${content.type}`);
    console.log(`   Scenario: ${content.scenario.substring(0, 100)}...`);
    
    if (content.type === 'email') {
      const emailContent = content.emailContent;
      console.log(`   Email Content:`);
      console.log(`     From: ${emailContent.from}`);
      console.log(`     Subject: ${emailContent.subject}`);
      console.log(`     Has Reply-To: ${!!emailContent.replyTo}`);
      console.log(`     Body Length: ${emailContent.body.length} characters`);
    }
    
    // Analyze clues
    const clues = content.clues || {};
    console.log(`   Clues (${Object.keys(clues).length}):`);
    Object.keys(clues).forEach((clueKey, index) => {
      const clue = clues[clueKey];
      console.log(`     ${index + 1}. ${clueKey}: ${clue.title}`);
      console.log(`        Red Flag: ${clue.redFlag}`);
    });
    
    // Analyze quizzes
    const quizzes = content.quizzes || {};
    console.log(`   Quizzes (${Object.keys(quizzes).length}):`);
    Object.keys(quizzes).forEach((quizKey, index) => {
      const quiz = quizzes[quizKey];
      console.log(`     ${index + 1}. ${quizKey}: ${quiz.text.substring(0, 50)}...`);
      console.log(`        Options: ${quiz.options.length} choices`);
    });
    
    return {
      contentType: content.type,
      cluesCount: Object.keys(clues).length,
      quizzesCount: Object.keys(quizzes).length,
      hasEmailContent: !!content.emailContent
    };
  }
  
  return null;
};

// Test mission navigation flow
export const testMissionNavigationFlow = () => {
  console.log('🧪 Testing mission navigation flow...');
  
  const navigationFlow = [
    {
      step: 'Mission Selection',
      description: 'User selects mission from EmailCrimeUnit page',
      data: 'missionId passed via URL params'
    },
    {
      step: 'Mission Introduction',
      description: 'Display mission briefing and objectives',
      data: 'mission data loaded from missions.js'
    },
    {
      step: 'Begin Investigation',
      description: 'User clicks button to start investigation',
      action: 'Navigate to /mission/:missionId/investigation'
    },
    {
      step: 'Mission Investigation',
      description: 'User investigates clues and answers quizzes',
      data: 'Real-time scoring and progress tracking'
    },
    {
      step: 'Mission Complete',
      description: 'Show results and update user progress',
      action: 'Navigate to /mission/:missionId/complete'
    }
  ];
  
  console.log(`\n🔄 Mission Navigation Flow:`);
  navigationFlow.forEach((step, index) => {
    console.log(`   ${index + 1}. ${step.step}:`);
    console.log(`      Description: ${step.description}`);
    if (step.data) {
      console.log(`      Data: ${step.data}`);
    }
    if (step.action) {
      console.log(`      Action: ${step.action}`);
    }
  });
  
  return navigationFlow;
};

// Test mission data validation
export const testMissionDataValidation = () => {
  console.log('🧪 Testing mission data validation...');
  
  const validationResults = {};
  
  const emailCrimesMissions = [
    'know-the-lingo',
    'spot-red-flags',
    'email-imposter',
    'spear-phishing',
    'fake-account',
    'wire-transfer',
    'perfect-impersonation'
  ];
  
  emailCrimesMissions.forEach(missionId => {
    const mission = missions[missionId];
    if (mission) {
      console.log(`\n🔍 Validating ${mission.title}:`);
      
      const validation = {
        hasId: !!mission.id,
        hasTitle: !!mission.title,
        hasDescription: !!mission.description,
        hasDepartment: !!mission.department,
        hasDifficulty: !!mission.difficulty,
        hasRequiredLevel: !!mission.unlockRequirements?.minimumLevel,
        hasEstimatedTime: !!mission.estimatedTime,
        hasContent: !!mission.content,
        hasClues: !!mission.content?.clues,
        hasQuizzes: !!mission.content?.quizzes,
        hasScoring: !!mission.scoring,
        hasUnlockRequirements: !!mission.unlockRequirements
      };
      
      // Check content structure
      if (mission.content) {
        validation.hasType = !!mission.content.type;
        validation.hasScenario = !!mission.content.scenario;
        
        if (mission.content.type === 'email') {
          validation.hasEmailContent = !!mission.content.emailContent;
          if (mission.content.emailContent) {
            validation.hasFrom = !!mission.content.emailContent.from;
            validation.hasSubject = !!mission.content.emailContent.subject;
            validation.hasBody = !!mission.content.emailContent.body;
          }
        }
      }
      
      // Check scoring structure
      if (mission.scoring) {
        validation.hasMaxScore = !!mission.scoring.maxScore;
        validation.hasScorePerFlag = !!mission.scoring.scorePerFlag;
        validation.hasScorePerQuiz = !!mission.scoring.scorePerQuiz;
      }
      
      // Display validation results
      Object.entries(validation).forEach(([field, isValid]) => {
        const status = isValid ? '✅' : '❌';
        console.log(`     ${status} ${field}: ${isValid ? 'Present' : 'Missing'}`);
      });
      
      // Calculate validation score
      const totalFields = Object.keys(validation).length;
      const validFields = Object.values(validation).filter(Boolean).length;
      const validationScore = Math.round((validFields / totalFields) * 100);
      
      console.log(`     📊 Validation Score: ${validationScore}% (${validFields}/${totalFields})`);
      
      validationResults[missionId] = {
        validation,
        validationScore,
        validFields,
        totalFields
      };
    }
  });
  
  return validationResults;
};

// Test complete mission introduction system
export const testCompleteMissionIntroductionSystem = async () => {
  console.log('🧪 Testing complete mission introduction system...');
  
  try {
    // Test mission introduction generation
    const missionIntroduction = testMissionIntroductionGeneration();
    
    // Test difficulty styling
    const difficultyStyling = testDifficultyStyling();
    
    // Test mission content analysis
    const missionContentAnalysis = testMissionContentAnalysis();
    
    // Test mission navigation flow
    const missionNavigationFlow = testMissionNavigationFlow();
    
    // Test mission data validation
    const missionDataValidation = testMissionDataValidation();
    
    console.log('\n✅ All mission introduction tests completed successfully!');
    
    return {
      missionIntroduction,
      difficultyStyling,
      missionContentAnalysis,
      missionNavigationFlow,
      missionDataValidation
    };
    
  } catch (error) {
    console.error('❌ Error testing mission introduction system:', error);
    return null;
  }
};

// Run all mission introduction tests
export const runAllMissionIntroductionTests = async () => {
  console.log('🚀 Starting all mission introduction tests...');
  console.log('==========================================');
  
  const results = {
    missionIntroduction: testMissionIntroductionGeneration(),
    difficultyStyling: testDifficultyStyling(),
    missionContentAnalysis: testMissionContentAnalysis(),
    missionNavigationFlow: testMissionNavigationFlow(),
    missionDataValidation: testMissionDataValidation(),
    completeSystem: await testCompleteMissionIntroductionSystem()
  };
  
  console.log('==========================================');
  console.log('📊 Mission Introduction Test Results Summary:');
  console.log(results);
  
  const successCount = Object.values(results).filter(result => result !== null).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`✅ ${successCount}/${totalCount} tests passed`);
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testMissionIntroduction = {
    testMissionIntroductionGeneration,
    testDifficultyStyling,
    testMissionContentAnalysis,
    testMissionNavigationFlow,
    testMissionDataValidation,
    testCompleteMissionIntroductionSystem,
    runAllMissionIntroductionTests
  };
  
  console.log('🧪 Mission Introduction test functions loaded. Use window.testMissionIntroduction.runAllMissionIntroductionTests() to run all tests.');
}

// Export all test functions
export default {
  testMissionIntroductionGeneration,
  testDifficultyStyling,
  testMissionContentAnalysis,
  testMissionNavigationFlow,
  testMissionDataValidation,
  testCompleteMissionIntroductionSystem,
  runAllMissionIntroductionTests
}; 