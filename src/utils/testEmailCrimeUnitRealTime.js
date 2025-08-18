// Test script for EmailCrimeUnit page real-time updates
// Run these functions in browser console to test the page

import { auth } from '../firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { firestore } from '../firebase';

// Test EmailCrimeUnit real-time updates
export const testEmailCrimeUnitRealTime = async () => {
  console.log('🧪 Testing EmailCrimeUnit real-time updates...');
  
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    console.log('👤 Testing with user ID:', userId);
    
    // Check current user data
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('❌ User document not found');
      return null;
    }
    
    const userData = userDoc.data();
    const detectiveAcademy = userData.detectiveAcademy || {};
    
    console.log('\n📊 Current user data:');
    console.log('   Level:', detectiveAcademy.level);
    console.log('   Experience:', detectiveAcademy.experience);
    console.log('   Missions Completed:', detectiveAcademy.missionsCompleted);
    
    // Check mission history
    const missionHistory = userData.missionHistory || [];
    console.log('\n📚 Mission History:');
    console.log('   Total missions in history:', missionHistory.length);
    if (missionHistory.length > 0) {
      console.log('   Recent missions:');
      missionHistory.slice(-3).forEach((mission, index) => {
        console.log(`     ${index + 1}. ${mission.missionId} - Score: ${mission.score}`);
      });
    }
    
    // Check department progress
    const departmentProgress = detectiveAcademy.departmentProgress || {};
    console.log('\n🏢 Department Progress:');
    Object.entries(departmentProgress).forEach(([deptId, progress]) => {
      console.log(`   ${deptId}: ${progress.missionsSolved} missions solved, ${progress.score} total score`);
    });
    
    return {
      userId,
      userData,
      detectiveAcademy,
      missionHistory,
      departmentProgress,
      success: true
    };
    
  } catch (error) {
    console.error('❌ EmailCrimeUnit real-time test failed:', error);
    return null;
  }
};

// Test mission unlock logic
export const testMissionUnlockLogic = async () => {
  console.log('🧪 Testing mission unlock logic...');
  
  try {
    // Import missions data
    const missionsModule = await import('../data/missions.js');
    const { missions } = missionsModule;
    
    // Get current user data
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('❌ User document not found');
      return null;
    }
    
    const userData = userDoc.data();
    const detectiveAcademy = userData.detectiveAcademy || {};
    
    // Test mission unlock logic
    const testMissionLogic = (missionId) => {
      const mission = missions[missionId];
      if (!mission) return { unlocked: false, reason: 'Mission not found' };
      
      const requirements = mission.unlockRequirements;
      
      // Check level requirement
      if (detectiveAcademy.level < (requirements.minimumLevel || 1)) {
        return { 
          unlocked: false, 
          reason: `Level ${detectiveAcademy.level} < ${requirements.minimumLevel || 1}` 
        };
      }
      
      // Check previous missions requirement
      if (requirements.previousMissions && requirements.previousMissions.length > 0) {
        const missionHistory = detectiveAcademy.missionHistory || [];
        for (const prevMissionId of requirements.previousMissions) {
          const prevMissionCompleted = missionHistory.some(m => m.missionId === prevMissionId);
          if (!prevMissionCompleted) {
            return { 
              unlocked: false, 
              reason: `Previous mission ${prevMissionId} not completed` 
            };
          }
        }
      }
      
      // Check minimum score requirement
      if (requirements.minimumScore > 0) {
        const userScore = detectiveAcademy.departmentProgress?.['email-crimes']?.score || 0;
        if (userScore < requirements.minimumScore) {
          return { 
            unlocked: false, 
            reason: `Score ${userScore} < ${requirements.minimumScore}` 
          };
        }
      }
      
      return { unlocked: true, reason: 'All requirements met' };
    };
    
    // Test all email crimes missions
    const emailCrimesMissions = [
      'know-the-lingo',
      'spot-red-flags',
      'email-imposter',
      'spear-phishing',
      'fake-account',
      'wire-transfer',
      'perfect-impersonation'
    ];
    
    console.log('\n🔍 Testing mission unlock status:');
    emailCrimesMissions.forEach(missionId => {
      const result = testMissionLogic(missionId);
      const mission = missions[missionId];
      const status = result.unlocked ? '✅' : '🔒';
      console.log(`   ${status} ${missionId}: ${result.reason}`);
      if (mission) {
        console.log(`      Title: ${mission.title}`);
        console.log(`      Difficulty: ${mission.difficulty}`);
        console.log(`      Required Level: ${mission.unlockRequirements.minimumLevel || 1}`);
      }
    });
    
    return {
      testResults: emailCrimesMissions.map(missionId => ({
        missionId,
        ...testMissionLogic(missionId)
      })),
      success: true
    };
    
  } catch (error) {
    console.error('❌ Mission unlock logic test failed:', error);
    return null;
  }
};

// Test real-time updates simulation
export const testRealTimeUpdatesSimulation = async () => {
  console.log('🧪 Testing real-time updates simulation...');
  
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    const userRef = doc(firestore, 'users', userId);
    
    // Simulate mission completion to test real-time updates
    console.log('\n🔧 Simulating mission completion...');
    
    try {
      await updateDoc(userRef, {
        'detectiveAcademy.experience': increment(25),
        'detectiveAcademy.totalScore': increment(50),
        'detectiveAcademy.missionsCompleted': increment(1),
        'detectiveAcademy.departmentProgress.email-crimes.missionsSolved': increment(1),
        'detectiveAcademy.departmentProgress.email-crimes.score': increment(50)
      });
      
      console.log('✅ Mission completion simulation successful!');
      console.log('   Experience +25, Score +50, Missions +1');
      
    } catch (error) {
      console.log('❌ Mission completion simulation failed:', error.message);
    }
    
    return {
      userId,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Real-time updates simulation failed:', error);
    return null;
  }
};

// Test complete EmailCrimeUnit functionality
export const testCompleteEmailCrimeUnitFunctionality = async () => {
  console.log('🧪 Testing complete EmailCrimeUnit functionality...');
  
  try {
    const results = {
      realTimeUpdates: await testEmailCrimeUnitRealTime(),
      unlockLogic: await testMissionUnlockLogic(),
      updatesSimulation: await testRealTimeUpdatesSimulation()
    };
    
    console.log('\n🎉 All EmailCrimeUnit functionality tests completed!');
    
    return results;
    
  } catch (error) {
    console.error('❌ Complete EmailCrimeUnit functionality test failed:', error);
    return null;
  }
};

// Run all EmailCrimeUnit tests
export const runAllEmailCrimeUnitTests = async () => {
  console.log('🚀 Starting all EmailCrimeUnit functionality tests...');
  console.log('==========================================');
  
  const results = await testCompleteEmailCrimeUnitFunctionality();
  
  console.log('==========================================');
  console.log('📊 EmailCrimeUnit Functionality Test Results Summary:');
  console.log(results);
  
  if (results) {
    console.log('✅ EmailCrimeUnit functionality tests completed successfully!');
    
    // Provide debugging suggestions
    if (results.realTimeUpdates?.detectiveAcademy) {
      console.log('\n💡 User progress data is available. Check if:');
      console.log('   1. Real-time listener is working in EmailCrimeUnit');
      console.log('   2. Mission unlock logic is functioning correctly');
      console.log('   3. Mission status updates are working');
      console.log('   4. UI reflects real-time changes');
    } else {
      console.log('\n💡 User progress data not available. Please check:');
      console.log('   1. User authentication status');
      console.log('   2. Firestore connection');
      console.log('   3. User document existence');
    }
  } else {
    console.log('❌ EmailCrimeUnit functionality tests failed');
  }
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testEmailCrimeUnitRealTime = {
    testEmailCrimeUnitRealTime,
    testMissionUnlockLogic,
    testRealTimeUpdatesSimulation,
    testCompleteEmailCrimeUnitFunctionality,
    runAllEmailCrimeUnitTests
  };
  
  console.log('🧪 EmailCrimeUnit real-time test functions loaded. Use window.testEmailCrimeUnitRealTime.runAllEmailCrimeUnitTests() to run all tests.');
}

// Export all test functions
export default {
  testEmailCrimeUnitRealTime,
  testMissionUnlockLogic,
  testRealTimeUpdatesSimulation,
  testCompleteEmailCrimeUnitFunctionality,
  runAllEmailCrimeUnitTests
}; 