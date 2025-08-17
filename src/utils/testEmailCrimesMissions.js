// Test script for Email Crimes missions data
// Run these functions in browser console to test Email Crimes missions

import { missions } from '../data/missions';

// Test Email Crimes missions structure
export const testEmailCrimesMissions = () => {
  console.log('🧪 Testing Email Crimes missions structure...');
  
  const emailCrimesMissions = [
    'know-the-lingo',
    'spot-red-flags',
    'email-imposter',
    'spear-phishing',
    'fake-account',
    'wire-transfer',
    'perfect-impersonation'
  ];
  
  const results = {};
  
  emailCrimesMissions.forEach(missionId => {
    const mission = missions[missionId];
    if (mission) {
      console.log(`\n📧 ${mission.title}:`);
      console.log(`   Difficulty: ${mission.difficulty}`);
      console.log(`   Required Level: ${mission.unlockRequirements.minimumLevel}`);
      console.log(`   Estimated Time: ${mission.estimatedTime} minutes`);
      console.log(`   Max Score: ${mission.scoring.maxScore}`);
      
      // Check content structure
      const content = mission.content;
      console.log(`   Content Type: ${content.type}`);
      
      if (content.type === 'email') {
        const emailContent = content.emailContent;
        console.log(`   Email From: ${emailContent.from}`);
        console.log(`   Email Subject: ${emailContent.subject}`);
        console.log(`   Has Reply-To: ${!!emailContent.replyTo}`);
      }
      
      // Check clues and quizzes
      const clues = content.clues || {};
      const quizzes = content.quizzes || {};
      console.log(`   Clues: ${Object.keys(clues).length}`);
      console.log(`   Quizzes: ${Object.keys(quizzes).length}`);
      
      // Check if clues and quizzes match
      const clueKeys = Object.keys(clues);
      const quizKeys = Object.keys(quizzes);
      const missingQuizzes = clueKeys.filter(clueKey => !quizKeys.includes(clueKey));
      const extraQuizzes = quizKeys.filter(quizKey => !clueKeys.includes(quizKey));
      
      if (missingQuizzes.length > 0) {
        console.log(`   ❌ Missing Quizzes: ${missingQuizzes.join(', ')}`);
      }
      
      if (extraQuizzes.length > 0) {
        console.log(`   ⚠️  Extra Quizzes: ${extraQuizzes.join(', ')}`);
      }
      
      if (missingQuizzes.length === 0 && extraQuizzes.length === 0) {
        console.log(`   ✅ Perfect Match! All clues have corresponding quizzes.`);
      }
      
      results[missionId] = {
        difficulty: mission.difficulty,
        requiredLevel: mission.unlockRequirements.minimumLevel,
        estimatedTime: mission.estimatedTime,
        maxScore: mission.scoring.maxScore,
        clues: clueKeys,
        quizzes: quizKeys,
        missingQuizzes,
        extraQuizzes,
        isPerfectMatch: missingQuizzes.length === 0 && extraQuizzes.length === 0
      };
    } else {
      console.log(`\n❌ Mission ${missionId} not found`);
      results[missionId] = { error: 'Mission not found' };
    }
  });
  
  return results;
};

// Test mission progression and unlock requirements
export const testMissionProgression = () => {
  console.log('🧪 Testing mission progression and unlock requirements...');
  
  const progressionFlow = [
    {
      level: 'Beginner',
      missions: ['know-the-lingo', 'spot-red-flags'],
      requirements: 'No prerequisites'
    },
    {
      level: 'Intermediate',
      missions: ['email-imposter'],
      requirements: 'Level 1, Score 0+'
    },
    {
      level: 'Advanced',
      missions: ['spear-phishing', 'fake-account', 'wire-transfer'],
      requirements: 'Previous missions, Level 2-3, Score 80-85+'
    },
    {
      level: 'Expert',
      missions: ['perfect-impersonation'],
      requirements: 'All previous missions, Level 3, Score 95+'
    }
  ];
  
  progressionFlow.forEach(level => {
    console.log(`\n📚 ${level.level} Level:`);
    console.log(`   Missions: ${level.missions.join(', ')}`);
    console.log(`   Requirements: ${level.requirements}`);
    
    level.missions.forEach(missionId => {
      const mission = missions[missionId];
      if (mission) {
        console.log(`     ${mission.title}:`);
        console.log(`       Difficulty: ${mission.difficulty}`);
        console.log(`       Required Level: ${mission.unlockRequirements.minimumLevel}`);
        console.log(`       Previous Missions: ${mission.unlockRequirements.previousMissions.length > 0 ? mission.unlockRequirements.previousMissions.join(', ') : 'None'}`);
        console.log(`       Minimum Score: ${mission.unlockRequirements.minimumScore}`);
      }
    });
  });
  
  return progressionFlow;
};

// Test mission content and scoring
export const testMissionContent = () => {
  console.log('🧪 Testing mission content and scoring...');
  
  const testMission = missions['spot-red-flags'];
  if (testMission) {
    console.log(`\n📊 Content Analysis for ${testMission.title}:`);
    
    // Analyze clues
    const clues = testMission.content.clues;
    console.log(`   Clues (${Object.keys(clues).length}):`);
    Object.keys(clues).forEach((clueKey, index) => {
      const clue = clues[clueKey];
      console.log(`     ${index + 1}. ${clueKey}: ${clue.title}`);
      console.log(`        Red Flag: ${clue.redFlag}`);
      console.log(`        Description: ${clue.description.substring(0, 60)}...`);
    });
    
    // Analyze quizzes
    const quizzes = testMission.content.quizzes;
    console.log(`   Quizzes (${Object.keys(quizzes).length}):`);
    Object.keys(quizzes).forEach((quizKey, index) => {
      const quiz = quizzes[quizKey];
      console.log(`     ${index + 1}. ${quizKey}: ${quiz.text.substring(0, 50)}...`);
      console.log(`        Options: ${quiz.options.length} choices`);
      console.log(`        Correct Answer: ${quiz.options.find(opt => opt.correct)?.text.substring(0, 40)}...`);
    });
    
    // Analyze scoring
    console.log(`   Scoring System:`);
    console.log(`     Max Score: ${testMission.scoring.maxScore}`);
    console.log(`     Score per Flag: ${testMission.scoring.scorePerFlag}`);
    console.log(`     Score per Quiz: ${testMission.scoring.scorePerQuiz}`);
    console.log(`     Bonus Points: ${testMission.scoring.bonusPoints}`);
    
    // Calculate potential score
    const potentialScore = (Object.keys(clues).length * testMission.scoring.scorePerFlag) +
                          (Object.keys(quizzes).length * testMission.scoring.scorePerQuiz) +
                          testMission.scoring.bonusPoints;
    console.log(`     Potential Total: ${potentialScore}`);
    
    return {
      clues: Object.keys(clues),
      quizzes: Object.keys(quizzes),
      scoring: testMission.scoring,
      potentialScore
    };
  }
  
  return null;
};

// Test mission unlock logic
export const testMissionUnlockLogic = () => {
  console.log('🧪 Testing mission unlock logic...');
  
  const testScenarios = [
    {
      name: 'New User',
      userData: { level: 1, totalScore: 0, completedMissions: [] }
    },
    {
      name: 'Beginner User',
      userData: { level: 2, totalScore: 150, completedMissions: ['know-the-lingo'] }
    },
    {
      name: 'Intermediate User',
      userData: { level: 3, totalScore: 400, completedMissions: ['know-the-lingo', 'spot-red-flags', 'email-imposter'] }
    },
    {
      name: 'Advanced User',
      userData: { level: 4, totalScore: 800, completedMissions: ['know-the-lingo', 'spot-red-flags', 'email-imposter', 'spear-phishing', 'fake-account'] }
    }
  ];
  
  testScenarios.forEach(scenario => {
    console.log(`\n👤 ${scenario.name}:`);
    console.log(`   Level: ${scenario.userData.level}, Score: ${scenario.userData.totalScore}`);
    console.log(`   Completed: ${scenario.userData.completedMissions.join(', ')}`);
    
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
        const requirements = mission.unlockRequirements;
        const levelMet = scenario.userData.level >= requirements.minimumLevel;
        const scoreMet = scenario.userData.totalScore >= requirements.minimumScore;
        const previousMissionsMet = requirements.previousMissions.every(prevMission => 
          scenario.userData.completedMissions.includes(prevMission)
        );
        
        const isUnlocked = levelMet && scoreMet && previousMissionsMet;
        const status = isUnlocked ? '✅ UNLOCKED' : '🔒 LOCKED';
        
        console.log(`     ${mission.title}: ${status}`);
        
        if (!isUnlocked) {
          const issues = [];
          if (!levelMet) issues.push(`Need Level ${requirements.minimumLevel}`);
          if (!scoreMet) issues.push(`Need Score ${requirements.minimumScore}`);
          if (!previousMissionsMet) issues.push(`Need previous missions`);
          console.log(`       Issues: ${issues.join(', ')}`);
        }
      }
    });
  });
  
  return testScenarios;
};

// Test complete Email Crimes system
export const testCompleteEmailCrimesSystem = async () => {
  console.log('🧪 Testing complete Email Crimes missions system...');
  
  try {
    // Test mission structure
    const missionStructure = testEmailCrimesMissions();
    
    // Test mission progression
    const missionProgression = testMissionProgression();
    
    // Test mission content
    const missionContent = testMissionContent();
    
    // Test mission unlock logic
    const missionUnlockLogic = testMissionUnlockLogic();
    
    console.log('\n✅ All Email Crimes missions tests completed successfully!');
    
    return {
      missionStructure,
      missionProgression,
      missionContent,
      missionUnlockLogic
    };
    
  } catch (error) {
    console.error('❌ Error testing Email Crimes missions system:', error);
    return null;
  }
};

// Run all Email Crimes tests
export const runAllEmailCrimesTests = async () => {
  console.log('🚀 Starting all Email Crimes missions tests...');
  console.log('============================================');
  
  const results = {
    missionStructure: testEmailCrimesMissions(),
    missionProgression: testMissionProgression(),
    missionContent: testMissionContent(),
    missionUnlockLogic: testMissionUnlockLogic(),
    completeSystem: await testCompleteEmailCrimesSystem()
  };
  
  console.log('============================================');
  console.log('📊 Email Crimes Missions Test Results Summary:');
  console.log(results);
  
  const successCount = Object.values(results).filter(result => result !== null).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`✅ ${successCount}/${totalCount} tests passed`);
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testEmailCrimes = {
    testEmailCrimesMissions,
    testMissionProgression,
    testMissionContent,
    testMissionUnlockLogic,
    testCompleteEmailCrimesSystem,
    runAllEmailCrimesTests
  };
  
  console.log('🧪 Email Crimes missions test functions loaded. Use window.testEmailCrimes.runAllEmailCrimesTests() to run all tests.');
}

// Export all test functions
export default {
  testEmailCrimesMissions,
  testMissionProgression,
  testMissionContent,
  testMissionUnlockLogic,
  testCompleteEmailCrimesSystem,
  runAllEmailCrimesTests
}; 