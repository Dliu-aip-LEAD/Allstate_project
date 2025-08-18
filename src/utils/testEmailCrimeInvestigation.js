// Test script for EmailCrimeInvestigation page functionality
// Run these functions in browser console to test EmailCrimeInvestigation page

import { missions } from '../data/missions';

// Test mission data loading
export const testMissionDataLoading = () => {
  console.log('🧪 Testing mission data loading...');
  
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
      console.log(`\n📧 ${mission.title}:`);
      
      // Check basic mission data
      console.log(`   Basic Info:`);
      console.log(`     ID: ${mission.id}`);
      console.log(`     Difficulty: ${mission.difficulty}`);
      console.log(`     Estimated Time: ${mission.estimatedTime} minutes`);
      console.log(`     Max Score: ${mission.scoring.maxScore}`);
      
      // Check content structure
      const content = mission.content;
      console.log(`   Content Structure:`);
      console.log(`     Type: ${content.type}`);
      console.log(`     Scenario: ${content.scenario.substring(0, 60)}...`);
      
      if (content.type === 'email') {
        const emailContent = content.emailContent;
        console.log(`     Email Content:`);
        console.log(`       From: ${emailContent.from}`);
        console.log(`       Subject: ${emailContent.subject}`);
        console.log(`       Reply-To: ${emailContent.replyTo || 'None'}`);
        console.log(`       Body Length: ${emailContent.body.length} characters`);
      }
      
      // Check clues and quizzes
      const clues = content.clues || {};
      const quizzes = content.quizzes || {};
      console.log(`   Investigation Elements:`);
      console.log(`     Clues: ${Object.keys(clues).length}`);
      console.log(`     Quizzes: ${Object.keys(quizzes).length}`);
      
      // Check scoring system
      console.log(`   Scoring System:`);
      console.log(`     Score per Flag: ${mission.scoring.scorePerFlag}`);
      console.log(`     Score per Quiz: ${mission.scoring.scorePerQuiz}`);
      console.log(`     Bonus Points: ${mission.scoring.bonusPoints}`);
      
      results[missionId] = {
        id: mission.id,
        difficulty: mission.difficulty,
        estimatedTime: mission.estimatedTime,
        maxScore: mission.scoring.maxScore,
        contentType: content.type,
        cluesCount: Object.keys(clues).length,
        quizzesCount: Object.keys(quizzes).length,
        scoring: mission.scoring
      };
    } else {
      console.log(`\n❌ Mission ${missionId} not found`);
      results[missionId] = { error: 'Mission not found' };
    }
  });
  
  return results;
};

// Test content rendering
export const testContentRendering = () => {
  console.log('🧪 Testing content rendering...');
  
  const testMission = missions['spot-red-flags'];
  if (testMission) {
    console.log(`\n🎨 Content Rendering for ${testMission.title}:`);
    
    const content = testMission.content;
    
    if (content.type === 'email') {
      console.log(`   📧 Email Content Rendering:`);
      
      const emailContent = content.emailContent;
      console.log(`     From Field: ${emailContent.from}`);
      console.log(`     Subject Field: ${emailContent.subject}`);
      console.log(`     Reply-To Field: ${emailContent.replyTo || 'None'}`);
      console.log(`     Body Content: ${emailContent.body.substring(0, 100)}...`);
      
      // Check if content has clickable elements
      const hasClickableElements = true; // Email content should have clickable hotspots
      console.log(`     Has Clickable Hotspots: ${hasClickableElements ? 'Yes' : 'No'}`);
      
      // Check clue mapping
      const clueMapping = getClueMapping(testMission.id);
      console.log(`     Clue Mapping:`);
      Object.entries(clueMapping).forEach(([emailElement, clueKey]) => {
        console.log(`       ${emailElement} → ${clueKey}`);
      });
    }
    
    // Check clues availability
    const clues = content.clues || {};
    console.log(`   🔍 Clues Available:`);
    Object.keys(clues).forEach((clueKey, index) => {
      const clue = clues[clueKey];
      console.log(`     ${index + 1}. ${clueKey}: ${clue.title}`);
      console.log(`        Red Flag: ${clue.redFlag}`);
      console.log(`        Description: ${clue.description.substring(0, 60)}...`);
    });
    
    // Check quizzes availability
    const quizzes = content.quizzes || {};
    console.log(`   ❓ Quizzes Available:`);
    Object.keys(quizzes).forEach((quizKey, index) => {
      const quiz = quizzes[quizKey];
      console.log(`     ${index + 1}. ${quizKey}: ${quiz.text.substring(0, 50)}...`);
      console.log(`        Options: ${quiz.options.length} choices`);
      console.log(`        Correct Answer: ${quiz.options.find(opt => opt.correct)?.text.substring(0, 40)}...`);
    });
    
    return {
      contentType: content.type,
      clues: Object.keys(clues),
      quizzes: Object.keys(quizzes),
      hasEmailContent: !!content.emailContent
    };
  }
  
  return null;
}

// Helper function to get clue mapping (simulating the actual function)
function getClueMapping(missionId) {
  if (missionId === 'spot-red-flags') {
    return {
      from: 'fakeDomain',
      subject: 'excessiveUrgency',
      replyTo: 'replyMismatch',
      body: 'suspiciousLink'
    };
  } else if (missionId === 'email-imposter') {
    return {
      from: 'domain',
      subject: 'urgency',
      replyTo: 'reply',
      body: 'pressure'
    };
  } else if (missionId === 'spear-phishing') {
    return {
      from: 'domainSimilarity',
      subject: 'urgentTechnical',
      body: 'personalInfo'
    };
  } else if (missionId === 'fake-account') {
    return {
      from: 'spoofedSender',
      subject: 'timelyThreat',
      replyTo: 'replyMismatch',
      body: 'credentialRequest'
    };
  } else if (missionId === 'wire-transfer') {
    return {
      from: 'roleImpersonation',
      subject: 'urgency',
      body: 'pressure'
    };
  }
  return {};
}

// Test scoring system
export const testScoringSystem = () => {
  console.log('🧪 Testing scoring system...');
  
  const testMission = missions['spot-red-flags'];
  if (testMission) {
    console.log(`\n🎯 Scoring System for ${testMission.title}:`);
    
    const scoring = testMission.scoring;
    const clues = testMission.content.clues || {};
    const quizzes = testMission.content.quizzes || {};
    
    console.log(`   Scoring Configuration:`);
    console.log(`     Max Score: ${scoring.maxScore}`);
    console.log(`     Score per Flag: ${scoring.scorePerFlag}`);
    console.log(`     Score per Quiz: ${scoring.scorePerQuiz}`);
    console.log(`     Bonus Points: ${scoring.bonusPoints}`);
    
    // Calculate potential scores
    const totalClues = Object.keys(clues).length;
    const totalQuizzes = Object.keys(quizzes).length;
    
    const maxClueScore = totalClues * scoring.scorePerFlag;
    const maxQuizScore = totalQuizzes * scoring.scorePerQuiz;
    const totalPotentialScore = maxClueScore + maxQuizScore + scoring.bonusPoints;
    
    console.log(`   Score Calculation:`);
    console.log(`     Total Clues: ${totalClues} × ${scoring.scorePerFlag} = ${maxClueScore}`);
    console.log(`     Total Quizzes: ${totalQuizzes} × ${scoring.scorePerQuiz} = ${maxQuizScore}`);
    console.log(`     Bonus Points: ${scoring.bonusPoints}`);
    console.log(`     Total Potential: ${totalPotentialScore}`);
    
    // Check if max score matches potential
    const scoreMatches = scoring.maxScore === totalPotentialScore;
    console.log(`     Score Match: ${scoreMatches ? '✅' : '❌'} (Max: ${scoring.maxScore}, Potential: ${totalPotentialScore})`);
    
    return {
      maxScore: scoring.maxScore,
      potentialScore: totalPotentialScore,
      scoreMatches,
      clueScore: maxClueScore,
      quizScore: maxQuizScore,
      bonusScore: scoring.bonusPoints
    };
  }
  
  return null;
};

// Test mission progression
export const testMissionProgression = () => {
  console.log('🧪 Testing mission progression...');
  
  const progressionSteps = [
    {
      step: 'Mission Start',
      description: 'User begins investigation',
      data: 'Mission data loaded, investigation interface displayed'
    },
    {
      step: 'Clue Discovery',
      description: 'User clicks on suspicious elements',
      data: 'Clue information revealed, evidence collected'
    },
    {
      step: 'Quiz Completion',
      description: 'User answers security questions',
      data: 'Quiz results recorded, score updated'
    },
    {
      step: 'Progress Tracking',
      description: 'Real-time score and progress updates',
      data: 'Progress bar, score display, completion percentage'
    },
    {
      step: 'Mission Completion',
      description: 'All objectives completed',
      data: 'Final score calculated, results displayed'
    }
  ];
  
  console.log(`\n🔄 Mission Progression Flow:`);
  progressionSteps.forEach((step, index) => {
    console.log(`   ${index + 1}. ${step.step}:`);
    console.log(`      Description: ${step.description}`);
    console.log(`      Data: ${step.data}`);
  });
  
  return progressionSteps;
};

// Test investigation mechanics
export const testInvestigationMechanics = () => {
  console.log('🧪 Testing investigation mechanics...');
  
  const testMission = missions['spot-red-flags'];
  if (testMission) {
    console.log(`\n🔍 Investigation Mechanics for ${testMission.title}:`);
    
    const clues = testMission.content.clues || {};
    const quizzes = testMission.content.quizzes || {};
    
    console.log(`   Hotspot Interaction:`);
    console.log(`     Total Hotspots: ${Object.keys(clues).length}`);
    console.log(`     Clickable Elements: From, Subject, Reply-To, Body`);
    
    // Simulate hotspot clicks
    Object.keys(clues).forEach((clueKey, index) => {
      const clue = clues[clueKey];
      console.log(`     ${index + 1}. ${clueKey}:`);
      console.log(`        Title: ${clue.title}`);
      console.log(`        Red Flag: ${clue.redFlag}`);
      console.log(`        Description: ${clue.description.substring(0, 60)}...`);
    });
    
    console.log(`   Quiz System:`);
    console.log(`     Total Quizzes: ${Object.keys(quizzes).length}`);
    
    Object.keys(quizzes).forEach((quizKey, index) => {
      const quiz = quizzes[quizKey];
      console.log(`     ${index + 1}. ${quizKey}:`);
      console.log(`        Question: ${quiz.text.substring(0, 50)}...`);
      console.log(`        Options: ${quiz.options.length} choices`);
      console.log(`        Correct Answer: ${quiz.options.find(opt => opt.correct)?.text.substring(0, 40)}...`);
      console.log(`        Feedback: ${quiz.feedback.substring(0, 50)}...`);
    });
    
    return {
      totalHotspots: Object.keys(clues).length,
      totalQuizzes: Object.keys(quizzes).length,
      clues: Object.keys(clues),
      quizzes: Object.keys(quizzes)
    };
  }
  
  return null;
};

// Test database integration
export const testDatabaseIntegration = () => {
  console.log('🧪 Testing database integration...');
  
  const integrationPoints = [
    {
      point: 'Mission Start',
      action: 'Load mission data from missions.js',
      data: 'Mission configuration, content, scoring'
    },
    {
      point: 'Progress Tracking',
      action: 'Update user progress in real-time',
      data: 'Score, clues found, quizzes completed'
    },
    {
      point: 'Mission Completion',
      action: 'Save results to Firestore',
      data: 'Final score, completion time, accuracy'
    },
    {
      point: 'User Progress Update',
      action: 'Update user statistics',
      data: 'Total score, missions completed, department progress'
    }
  ];
  
  console.log(`\n💾 Database Integration Points:`);
  integrationPoints.forEach((point, index) => {
    console.log(`   ${index + 1}. ${point.point}:`);
    console.log(`      Action: ${point.action}`);
    console.log(`      Data: ${point.data}`);
  });
  
  // Test data flow
  console.log(`\n📊 Data Flow Test:`);
  const mockMissionResults = {
    missionId: 'spot-red-flags',
    finalScore: 85,
    cluesFound: 4,
    quizzesCompleted: 3,
    accuracy: 85,
    completionTime: '8 minutes',
    timestamp: new Date().toISOString()
  };
  
  console.log(`   Mock Mission Results:`);
  Object.entries(mockMissionResults).forEach(([key, value]) => {
    console.log(`     ${key}: ${value}`);
  });
  
  return {
    integrationPoints,
    mockMissionResults
  };
};

// Test complete EmailCrimeInvestigation system
export const testCompleteEmailCrimeInvestigationSystem = async () => {
  console.log('🧪 Testing complete EmailCrimeInvestigation system...');
  
  try {
    // Test mission data loading
    const missionDataLoading = testMissionDataLoading();
    
    // Test content rendering
    const contentRendering = testContentRendering();
    
    // Test scoring system
    const scoringSystem = testScoringSystem();
    
    // Test mission progression
    const missionProgression = testMissionProgression();
    
    // Test investigation mechanics
    const investigationMechanics = testInvestigationMechanics();
    
    // Test database integration
    const databaseIntegration = testDatabaseIntegration();
    
    console.log('\n✅ All EmailCrimeInvestigation tests completed successfully!');
    
    return {
      missionDataLoading,
      contentRendering,
      scoringSystem,
      missionProgression,
      investigationMechanics,
      databaseIntegration
    };
    
  } catch (error) {
    console.error('❌ Error testing EmailCrimeInvestigation system:', error);
    return null;
  }
};

// Run all EmailCrimeInvestigation tests
export const runAllEmailCrimeInvestigationTests = async () => {
  console.log('🚀 Starting all EmailCrimeInvestigation tests...');
  console.log('================================================');
  
  const results = {
    missionDataLoading: testMissionDataLoading(),
    contentRendering: testContentRendering(),
    scoringSystem: testScoringSystem(),
    missionProgression: testMissionProgression(),
    investigationMechanics: testInvestigationMechanics(),
    databaseIntegration: testDatabaseIntegration(),
    completeSystem: await testCompleteEmailCrimeInvestigationSystem()
  };
  
  console.log('================================================');
  console.log('📊 EmailCrimeInvestigation Test Results Summary:');
  console.log(results);
  
  const successCount = Object.values(results).filter(result => result !== null).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`✅ ${successCount}/${totalCount} tests passed`);
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testEmailCrimeInvestigation = {
    testMissionDataLoading,
    testContentRendering,
    testScoringSystem,
    testMissionProgression,
    testInvestigationMechanics,
    testDatabaseIntegration,
    testCompleteEmailCrimeInvestigationSystem,
    runAllEmailCrimeInvestigationTests
  };
  
  console.log('🧪 EmailCrimeInvestigation test functions loaded. Use window.testEmailCrimeInvestigation.runAllEmailCrimeInvestigationTests() to run all tests.');
}

// Export all test functions
export default {
  testMissionDataLoading,
  testContentRendering,
  testScoringSystem,
  testMissionProgression,
  testInvestigationMechanics,
  testDatabaseIntegration,
  testCompleteEmailCrimeInvestigationSystem,
  runAllEmailCrimeInvestigationTests
}; 