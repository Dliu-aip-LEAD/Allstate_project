// Test script for fixed mission service functionality
// Run these functions in browser console to test the fixed mission service

import { completeMission, getUserMissionStats } from '../services/missionService';
import { missions } from '../data/missions';
import { auth } from '../firebase';

// Test mission service with fixed timestamp handling
export const testFixedMissionService = async () => {
  console.log('🧪 Testing FIXED mission service functionality...');
  
  try {
    // Get current user ID from Firebase Auth
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
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
      
      // Check timestamp format
      if (result.missionResult.completedAt) {
        console.log('   Timestamp format:', typeof result.missionResult.completedAt);
        console.log('   Timestamp value:', result.missionResult.completedAt);
      }
    } else {
      console.log('❌ Mission completion failed:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Fixed mission service test failed:', error);
    return null;
  }
};

// Test timestamp handling specifically
export const testTimestampHandling = () => {
  console.log('🧪 Testing timestamp handling...');
  
  try {
    const testMission = missions['spot-red-flags'];
    if (!testMission) {
      console.log('❌ Test mission not found');
      return null;
    }
    
    const userPerformance = {
      score: 90,
      maxScore: 100,
      flagsFound: 5,
      totalQuestions: 6,
      correctAnswers: 5,
      accuracy: 83,
      evidence: ['Test evidence'],
      timeSpent: 250,
      hintsUsed: 0,
      mistakes: 1
    };
    
    // Test createMissionResult function
    console.log('\n📝 Testing mission result creation...');
    
    // Import the function directly for testing
    import('../services/missionService.js').then(module => {
      if (module.createMissionResult) {
        const missionResult = module.createMissionResult(testMission, userPerformance);
        console.log('✅ Mission result created successfully');
        console.log('   completedAt type:', typeof missionResult.completedAt);
        console.log('   completedAt value:', missionResult.completedAt);
        console.log('   Is ISO string:', /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(missionResult.completedAt));
      } else {
        console.log('❌ createMissionResult function not found');
      }
    }).catch(error => {
      console.error('❌ Error importing mission service:', error);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Timestamp handling test failed:', error);
    return null;
  }
};

// Test complete fixed mission service system
export const testCompleteFixedMissionServiceSystem = async () => {
  console.log('🧪 Testing complete fixed mission service system...');
  
  try {
    const results = {
      fixedMissionService: await testFixedMissionService(),
      timestampHandling: testTimestampHandling()
    };
    
    console.log('\n✅ All fixed mission service tests completed!');
    
    return results;
    
  } catch (error) {
    console.error('❌ Complete fixed mission service test failed:', error);
    return null;
  }
};

// Run all fixed mission service tests
export const runAllFixedMissionServiceTests = async () => {
  console.log('🚀 Starting all fixed mission service tests...');
  console.log('==========================================');
  
  const results = await testCompleteFixedMissionServiceSystem();
  
  console.log('==========================================');
  console.log('📊 Fixed Mission Service Test Results Summary:');
  console.log(results);
  
  if (results) {
    console.log('✅ Fixed mission service tests completed successfully!');
  } else {
    console.log('❌ Fixed mission service tests failed');
  }
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testMissionServiceFix = {
    testFixedMissionService,
    testTimestampHandling,
    testCompleteFixedMissionServiceSystem,
    runAllFixedMissionServiceTests
  };
  
  console.log('🧪 Fixed mission service test functions loaded. Use window.testMissionServiceFix.runAllFixedMissionServiceTests() to run all tests.');
}

// Export all test functions
export default {
  testFixedMissionService,
  testTimestampHandling,
  testCompleteFixedMissionServiceSystem,
  runAllFixedMissionServiceTests
}; 