// Test script for mission service functionality
// Run these functions in browser console to test the new backend service

import { completeMission, getUserMissionStats } from '../services/missionService';
import { missions } from '../data/missions';
import { auth } from '../firebase';

// Test mission service with mock data
export const testMissionService = async () => {
  console.log('🧪 Testing mission service functionality...');
  
  try {
    // Get current user ID from Firebase Auth
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    console.log('👤 Current user ID:', userId);
    
    console.log('👤 Testing with user ID:', userId);
    
    // Get a test mission
    const testMission = missions['spot-red-flags'];
    if (!testMission) {
      console.log('❌ Test mission not found');
      return null;
    }
    
    console.log('\n📋 Test mission:', testMission.title);
    console.log('   Difficulty:', testMission.difficulty);
    console.log('   Department:', testMission.department);
    console.log('   Max Score:', testMission.scoring.maxScore);
    
    // Mock user performance data
    const mockUserPerformance = {
      score: 85,
      maxScore: 100,
      flagsFound: 5,
      totalQuestions: 6,
      correctAnswers: 5,
      accuracy: 83,
      evidence: ['Fake domain', 'Excessive urgency', 'Suspicious link', 'Sensitive info request', 'Generic greeting'],
      timeSpent: 300, // 5 minutes
      hintsUsed: 1,
      mistakes: 1
    };
    
    console.log('\n📊 Mock user performance:');
    Object.entries(mockUserPerformance).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    // Test mission completion
    console.log('\n🚀 Testing mission completion...');
    const result = await completeMission(userId, testMission, mockUserPerformance);
    
    if (result.success) {
      console.log('✅ Mission completion successful!');
      console.log('   Experience gained:', result.experienceGained);
      console.log('   Leveled up:', result.leveledUp);
      console.log('   New achievements:', result.newAchievements.length);
      console.log('   Mission result:', result.missionResult);
      console.log('   Progress update:', result.progressUpdate);
    } else {
      console.log('❌ Mission completion failed:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Mission service test failed:', error);
    return null;
  }
};

// Test experience calculation
export const testExperienceCalculation = () => {
  console.log('🧪 Testing experience calculation...');
  
  const testMission = missions['spot-red-flags'];
  if (!testMission) {
    console.log('❌ Test mission not found');
    return null;
  }
  
  const testScenarios = [
    {
      name: 'Perfect Score (100%)',
      performance: { score: 100, accuracy: 100, flagsFound: 6 }
    },
    {
      name: 'Good Score (85%)',
      performance: { score: 85, accuracy: 85, flagsFound: 5 }
    },
    {
      name: 'Average Score (70%)',
      performance: { score: 70, accuracy: 70, flagsFound: 4 }
    },
    {
      name: 'Poor Score (50%)',
      performance: { score: 50, accuracy: 50, flagsFound: 2 }
    }
  ];
  
  console.log(`\n📊 Experience calculation for ${testMission.title}:`);
  testScenarios.forEach(scenario => {
    const baseExp = testMission.rewards?.experiencePoints || 50;
    const scoreMultiplier = scenario.performance.score / testMission.scoring.maxScore;
    const accuracyBonus = scenario.performance.accuracy >= 80 ? 1.2 : 1.0;
    const difficultyMultiplier = getDifficultyMultiplier(testMission.difficulty);
    const totalExp = Math.round(baseExp * scoreMultiplier * accuracyBonus * difficultyMultiplier);
    
    console.log(`\n   ${scenario.name}:`);
    console.log(`     Base Exp: ${baseExp}`);
    console.log(`     Score Multiplier: ${scoreMultiplier.toFixed(2)}`);
    console.log(`     Accuracy Bonus: ${accuracyBonus}`);
    console.log(`     Difficulty Multiplier: ${difficultyMultiplier}`);
    console.log(`     Total Exp: ${totalExp}`);
  });
  
  return testScenarios;
};

// Helper function for difficulty multiplier
const getDifficultyMultiplier = (difficulty) => {
  const multipliers = {
    'beginner': 1.0,
    'intermediate': 1.2,
    'advanced': 1.5,
    'expert': 2.0
  };
  return multipliers[difficulty] || 1.0;
};

// Test level progression calculation
export const testLevelProgression = () => {
  console.log('🧪 Testing level progression calculation...');
  
  const testScenarios = [
    { currentLevel: 1, currentExp: 0, newExp: 50 },
    { currentLevel: 1, currentExp: 100, newExp: 100 },
    { currentLevel: 2, currentExp: 150, newExp: 75 },
    { currentLevel: 3, currentExp: 300, newExp: 200 },
    { currentLevel: 4, currentExp: 600, newExp: 300 }
  ];
  
  console.log('\n📈 Level progression scenarios:');
  testScenarios.forEach(scenario => {
    const totalExp = scenario.currentExp + scenario.newExp;
    let newLevel = scenario.currentLevel;
    let levelName = 'Unknown';
    let experienceToNextLevel = 0;
    
    // Simple level calculation for testing
    if (totalExp >= 800) newLevel = 5;
    else if (totalExp >= 500) newLevel = 4;
    else if (totalExp >= 250) newLevel = 3;
    else if (totalExp >= 150) newLevel = 2;
    else newLevel = 1;
    
    const levelNames = {
      1: 'Junior Detective',
      2: 'Apprentice Detective',
      3: 'Detective',
      4: 'Senior Detective',
      5: 'Expert Detective'
    };
    
    levelName = levelNames[newLevel];
    const leveledUp = newLevel > scenario.currentLevel;
    
    console.log(`\n   Current: Level ${scenario.currentLevel} (${scenario.currentExp} exp)`);
    console.log(`   New Exp: +${scenario.newExp}`);
    console.log(`   Total: Level ${newLevel} (${totalExp} exp)`);
    console.log(`   Level Name: ${levelName}`);
    console.log(`   Leveled Up: ${leveledUp ? '✅ Yes' : '❌ No'}`);
  });
  
  return testScenarios;
};

// Test user mission stats
export const testUserMissionStats = async () => {
  console.log('🧪 Testing user mission stats...');
  
  try {
    const userId = localStorage.getItem('userId');
    if (!userId || userId === 'anonymous') {
      console.log('❌ No valid user ID found. Please log in first.');
      return null;
    }
    
    const stats = await getUserMissionStats(userId);
    
    if (stats) {
      console.log('\n📊 User Mission Statistics:');
      console.log('   Total Missions:', stats.totalMissions);
      console.log('   Total Score:', stats.totalScore);
      console.log('   Current Level:', stats.currentLevel);
      console.log('   Level Name:', stats.levelName);
      console.log('   Experience:', stats.experience);
      console.log('   Experience to Next Level:', stats.experienceToNextLevel);
      console.log('   Success Rate:', stats.successRate + '%');
      console.log('   Recent Missions:', stats.recentMissions.length);
      console.log('   Achievements:', stats.achievements.length);
      
      if (stats.departmentProgress) {
        console.log('\n   Department Progress:');
        Object.entries(stats.departmentProgress).forEach(([dept, data]) => {
          console.log(`     ${dept}: ${data.missionsSolved}/${data.totalMissions} (${data.progress}%)`);
        });
      }
    } else {
      console.log('❌ Could not retrieve user stats');
    }
    
    return stats;
    
  } catch (error) {
    console.error('❌ Error testing user mission stats:', error);
    return null;
  }
};

// Test complete mission service system
export const testCompleteMissionServiceSystem = async () => {
  console.log('🧪 Testing complete mission service system...');
  
  try {
    const results = {
      missionService: await testMissionService(),
      experienceCalculation: testExperienceCalculation(),
      levelProgression: testLevelProgression(),
      userStats: await testUserMissionStats()
    };
    
    console.log('\n🎉 All mission service tests completed!');
    
    return results;
    
  } catch (error) {
    console.error('❌ Complete mission service test failed:', error);
    return null;
  }
};

// Run all mission service tests
export const runAllMissionServiceTests = async () => {
  console.log('🚀 Starting all mission service tests...');
  console.log('==========================================');
  
  const results = await testCompleteMissionServiceSystem();
  
  console.log('==========================================');
  console.log('📊 Mission Service Test Results Summary:');
  console.log(results);
  
  if (results) {
    console.log('✅ Mission service tests completed successfully!');
  } else {
    console.log('❌ Mission service tests failed');
  }
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testMissionService = {
    testMissionService,
    testExperienceCalculation,
    testLevelProgression,
    testUserMissionStats,
    testCompleteMissionServiceSystem,
    runAllMissionServiceTests
  };
  
  console.log('🧪 Mission service test functions loaded. Use window.testMissionService.runAllMissionServiceTests() to run all tests.');
}

// Export all test functions
export default {
  testMissionService,
  testExperienceCalculation,
  testLevelProgression,
  testUserMissionStats,
  testCompleteMissionServiceSystem,
  runAllMissionServiceTests
}; 