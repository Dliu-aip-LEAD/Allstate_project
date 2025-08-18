// Test script for mission logic (new mission vs repeat mission)
// Run these functions in browser console to test the updated mission logic

import { completeMission, getUserMissionStats } from '../services/missionService';
import { missions } from '../data/missions';
import { auth } from '../firebase';

// Test new mission completion
export const testNewMission = async () => {
  console.log('🧪 Testing NEW mission completion...');
  
  try {
    // Get current user ID from Firebase Auth
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    console.log('👤 Current user ID:', userId);
    
    // Use a unique mission ID for testing
    const testMissionId = `test-new-mission-${Date.now()}`;
    const testMission = {
      ...missions['spot-red-flags'],
      id: testMissionId
    };
    
    const userPerformance = {
      score: 85,
      maxScore: 100,
      flagsFound: 5,
      totalQuestions: 6,
      correctAnswers: 5,
      accuracy: 83,
      evidence: ['Test evidence 1', 'Test evidence 2'],
      timeSpent: 300,
      hintsUsed: 1,
      mistakes: 1
    };
    
    console.log('📋 Test mission:', testMission.title);
    console.log('   Mission ID:', testMissionId);
    console.log('   Score:', userPerformance.score);
    
    const result = await completeMission(userId, testMission, userPerformance);
    
    if (result.success) {
      console.log('✅ New mission completed successfully!');
      console.log('   Experience gained:', result.experienceGained);
      console.log('   Leveled up:', result.leveledUp);
      console.log('   Progress update:', result.progressUpdate);
    } else {
      console.log('❌ New mission failed:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ New mission test failed:', error);
    return null;
  }
};

// Test repeat mission with higher score
export const testRepeatMissionHigherScore = async () => {
  console.log('🧪 Testing REPEAT mission with HIGHER score...');
  
  try {
    // Get current user ID from Firebase Auth
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    console.log('👤 Current user ID:', userId);
    
    // Use the same mission ID as the previous test
    const testMissionId = `test-new-mission-${Date.now() - 1000}`; // Slightly different timestamp
    const testMission = {
      ...missions['spot-red-flags'],
      id: testMissionId
    };
    
    // Higher score performance
    const userPerformance = {
      score: 95, // Higher score
      maxScore: 100,
      flagsFound: 6, // More flags found
      totalQuestions: 6,
      correctAnswers: 6, // Perfect answers
      accuracy: 100, // Perfect accuracy
      evidence: ['Test evidence 1', 'Test evidence 2', 'Test evidence 3'],
      timeSpent: 250, // Faster completion
      hintsUsed: 0, // No hints used
      mistakes: 0 // No mistakes
    };
    
    console.log('📋 Test mission:', testMission.title);
    console.log('   Mission ID:', testMissionId);
    console.log('   Previous Score: 85, New Score: 95');
    console.log('   Score Improvement: +10');
    
    const result = await completeMission(userId, testMission, userPerformance);
    
    if (result.success) {
      console.log('✅ Repeat mission with higher score completed!');
      console.log('   Experience gained:', result.experienceGained);
      console.log('   Leveled up:', result.leveledUp);
      console.log('   Progress update:', result.progressUpdate);
    } else {
      console.log('❌ Repeat mission failed:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Repeat mission test failed:', error);
    return null;
  }
};

// Test repeat mission with lower score
export const testRepeatMissionLowerScore = async () => {
  console.log('🧪 Testing REPEAT mission with LOWER score...');
  
  try {
    // Get current user ID from Firebase Auth
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    console.log('👤 Current user ID:', userId);
    
    // Use the same mission ID as the previous test
    const testMissionId = `test-new-mission-${Date.now() - 2000}`; // Slightly different timestamp
    const testMission = {
      ...missions['spot-red-flags'],
      id: testMissionId
    };
    
    // Lower score performance
    const userPerformance = {
      score: 75, // Lower score
      maxScore: 100,
      flagsFound: 4, // Fewer flags found
      totalQuestions: 6,
      correctAnswers: 4, // Fewer correct answers
      accuracy: 67, // Lower accuracy
      evidence: ['Test evidence 1'],
      timeSpent: 400, // Slower completion
      hintsUsed: 2, // More hints used
      mistakes: 2 // More mistakes
    };
    
    console.log('📋 Test mission:', testMission.title);
    console.log('   Mission ID:', testMissionId);
    console.log('   Previous Score: 95, New Score: 75');
    console.log('   Score Decrease: -20');
    
    const result = await completeMission(userId, testMission, userPerformance);
    
    if (result.success) {
      console.log('✅ Repeat mission with lower score completed!');
      console.log('   Experience gained:', result.experienceGained);
      console.log('   Leveled up:', result.leveledUp);
      console.log('   Progress update:', result.progressUpdate);
    } else {
      console.log('❌ Repeat mission failed:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Repeat mission test failed:', error);
    return null;
  }
};

// Test mission history updates
export const testMissionHistoryUpdates = async () => {
  console.log('🧪 Testing mission history updates...');
  
  try {
    // Get current user ID from Firebase Auth
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    console.log('👤 Current user ID:', userId);
    
    // Get current user stats
    const stats = await getUserMissionStats(userId);
    
    if (stats) {
      console.log('\n📊 Current Mission Statistics:');
      console.log('   Total Missions:', stats.totalMissions);
      console.log('   Total Score:', stats.totalScore);
      console.log('   Current Level:', stats.currentLevel);
      console.log('   Experience:', stats.experience);
      console.log('   Recent Missions:', stats.recentMissions.length);
      
      if (stats.recentMissions.length > 0) {
        console.log('\n📚 Recent Mission History:');
        stats.recentMissions.forEach((mission, index) => {
          console.log(`   ${index + 1}. ${mission.title}: ${mission.score}/${mission.maxScore} (${mission.accuracy}%)`);
          console.log(`      Completed: ${mission.completedAt?.toDate?.() || mission.completedAt}`);
        });
      }
      
      if (stats.departmentProgress) {
        console.log('\n🏢 Department Progress:');
        Object.entries(stats.departmentProgress).forEach(([dept, data]) => {
          console.log(`   ${dept}: ${data.missionsSolved}/${data.totalMissions} (${data.progress}%)`);
        });
      }
    }
    
    return stats;
    
  } catch (error) {
    console.error('❌ Error testing mission history updates:', error);
    return null;
  }
};

// Test complete mission logic system
export const testCompleteMissionLogicSystem = async () => {
  console.log('🧪 Testing complete mission logic system...');
  
  try {
    console.log('🚀 Starting mission logic tests...');
    console.log('==========================================');
    
    // Test 1: New mission
    console.log('\n1️⃣ Testing NEW mission...');
    const newMissionResult = await testNewMission();
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 2: Repeat mission with higher score
    console.log('\n2️⃣ Testing REPEAT mission with HIGHER score...');
    const repeatHigherResult = await testRepeatMissionHigherScore();
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 3: Repeat mission with lower score
    console.log('\n3️⃣ Testing REPEAT mission with LOWER score...');
    const repeatLowerResult = await testRepeatMissionLowerScore();
    
    // Test 4: Check mission history
    console.log('\n4️⃣ Checking mission history...');
    const historyResult = await testMissionHistoryUpdates();
    
    console.log('==========================================');
    console.log('📊 Mission Logic Test Results Summary:');
    
    const results = {
      newMission: newMissionResult,
      repeatHigher: repeatHigherResult,
      repeatLower: repeatLowerResult,
      history: historyResult
    };
    
    console.log(results);
    
    // Count successful tests
    const successCount = Object.values(results).filter(result => result !== null).length;
    const totalCount = Object.keys(results).length;
    
    console.log(`✅ ${successCount}/${totalCount} tests passed`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Complete mission logic test failed:', error);
    return null;
  }
};

// Run all mission logic tests
export const runAllMissionLogicTests = async () => {
  console.log('🚀 Starting all mission logic tests...');
  console.log('==========================================');
  
  const results = await testCompleteMissionLogicSystem();
  
  console.log('==========================================');
  console.log('📊 Mission Logic Test Results Summary:');
  console.log(results);
  
  if (results) {
    console.log('✅ Mission logic tests completed successfully!');
  } else {
    console.log('❌ Mission logic tests failed');
  }
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testMissionLogic = {
    testNewMission,
    testRepeatMissionHigherScore,
    testRepeatMissionLowerScore,
    testMissionHistoryUpdates,
    testCompleteMissionLogicSystem,
    runAllMissionLogicTests
  };
  
  console.log('🧪 Mission logic test functions loaded. Use window.testMissionLogic.runAllMissionLogicTests() to run all tests.');
}

// Export all test functions
export default {
  testNewMission,
  testRepeatMissionHigherScore,
  testRepeatMissionLowerScore,
  testMissionHistoryUpdates,
  testCompleteMissionLogicSystem,
  runAllMissionLogicTests
}; 