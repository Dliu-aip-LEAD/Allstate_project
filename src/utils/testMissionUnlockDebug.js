// Test script for debugging mission unlock logic
// Run these functions in browser console to debug unlock issues

import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

// Debug mission unlock logic step by step
export const debugMissionUnlockLogic = async () => {
  console.log('🧪 Debugging mission unlock logic step by step...');
  
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    console.log('👤 Testing with user ID:', userId);
    
    // Get current user data
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
    console.log('   Total Score:', detectiveAcademy.totalScore);
    
    // Check mission history
    const missionHistory = userData.missionHistory || [];
    console.log('\n📚 Mission History:');
    console.log('   Total missions in history:', missionHistory.length);
    if (missionHistory.length > 0) {
      console.log('   Completed missions:');
      missionHistory.forEach((mission, index) => {
        console.log(`     ${index + 1}. ${mission.missionId} - Score: ${mission.score}`);
      });
    }
    
    // Check department progress
    const departmentProgress = detectiveAcademy.departmentProgress || {};
    console.log('\n🏢 Department Progress:');
    Object.entries(departmentProgress).forEach(([deptId, progress]) => {
      console.log(`   ${deptId}: ${progress.missionsSolved} missions solved, ${progress.score} total score`);
    });
    
    // Import missions data
    const missionsModule = await import('../data/missions.js');
    const { missions } = missionsModule;
    
    // Test specific mission unlock logic
    const testMissionUnlock = (missionId) => {
      console.log(`\n🔍 Testing unlock logic for: ${missionId}`);
      
      const mission = missions[missionId];
      if (!mission) {
        console.log('   ❌ Mission not found in missions.js');
        return false;
      }
      
      console.log(`   📋 Mission: ${mission.title}`);
      console.log(`   🎯 Difficulty: ${mission.difficulty}`);
      console.log(`   📊 Required Level: ${mission.unlockRequirements?.minimumLevel || 1}`);
      console.log(`   🏆 Required Score: ${mission.unlockRequirements?.minimumScore || 0}`);
      console.log(`   🔗 Previous Missions: ${mission.unlockRequirements?.previousMissions?.join(', ') || 'None'}`);
      
      const requirements = mission.unlockRequirements;
      
      // Check level requirement
      const levelCheck = detectiveAcademy.level >= (requirements.minimumLevel || 1);
      console.log(`   ✅ Level check: ${detectiveAcademy.level} >= ${requirements.minimumLevel || 1} = ${levelCheck}`);
      
      // Check previous missions requirement
      let previousMissionsCheck = true;
      if (requirements.previousMissions && requirements.previousMissions.length > 0) {
        console.log('   🔍 Checking previous missions...');
        for (const prevMissionId of requirements.previousMissions) {
          const prevMissionCompleted = missionHistory.some(m => m.missionId === prevMissionId);
          console.log(`     ${prevMissionId}: ${prevMissionCompleted ? '✅ Completed' : '❌ Not completed'}`);
          if (!prevMissionCompleted) {
            previousMissionsCheck = false;
          }
        }
      } else {
        console.log('   ✅ No previous missions required');
      }
      
      // Check minimum score requirement
      let scoreCheck = true;
      if (requirements.minimumScore > 0) {
        const userScore = departmentProgress['email-crimes']?.score || 0;
        scoreCheck = userScore >= requirements.minimumScore;
        console.log(`   🏆 Score check: ${userScore} >= ${requirements.minimumScore} = ${scoreCheck}`);
      } else {
        console.log('   ✅ No minimum score required');
      }
      
      const isUnlocked = levelCheck && previousMissionsCheck && scoreCheck;
      console.log(`   🎯 Final result: ${isUnlocked ? '✅ UNLOCKED' : '🔒 LOCKED'}`);
      
      if (!isUnlocked) {
        if (!levelCheck) console.log('     ❌ Level requirement not met');
        if (!previousMissionsCheck) console.log('     ❌ Previous missions requirement not met');
        if (!scoreCheck) console.log('     ❌ Score requirement not met');
      }
      
      return isUnlocked;
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
    
    console.log('\n🚀 Testing all Email Crimes missions:');
    const unlockResults = {};
    
    emailCrimesMissions.forEach(missionId => {
      unlockResults[missionId] = testMissionUnlock(missionId);
    });
    
    console.log('\n📊 Mission Unlock Summary:');
    Object.entries(unlockResults).forEach(([missionId, unlocked]) => {
      const status = unlocked ? '✅' : '🔒';
      console.log(`   ${status} ${missionId}: ${unlocked ? 'UNLOCKED' : 'LOCKED'}`);
    });
    
    return {
      userId,
      userData,
      detectiveAcademy,
      missionHistory,
      departmentProgress,
      unlockResults,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Mission unlock debug failed:', error);
    return null;
  }
};

// Test specific mission unlock scenarios
export const testSpecificMissionUnlocks = async () => {
  console.log('🧪 Testing specific mission unlock scenarios...');
  
  try {
    // Import missions data
    const missionsModule = await import('../data/missions.js');
    const { missions } = missionsModule;
    
    // Test spear-phishing unlock (requires email-imposter completion)
    console.log('\n🔍 Testing spear-phishing unlock logic:');
    const spearPhishing = missions['spear-phishing'];
    if (spearPhishing) {
      console.log('   📋 Mission:', spearPhishing.title);
      console.log('   🎯 Requirements:', spearPhishing.unlockRequirements);
      
      // Check if email-imposter exists
      const emailImposter = missions['email-imposter'];
      if (emailImposter) {
        console.log('   ✅ email-imposter mission found');
      } else {
        console.log('   ❌ email-imposter mission NOT found');
      }
    }
    
    // Test fake-account unlock (requires spear-phishing completion)
    console.log('\n🔍 Testing fake-account unlock logic:');
    const fakeAccount = missions['fake-account'];
    if (fakeAccount) {
      console.log('   📋 Mission:', fakeAccount.title);
      console.log('   🎯 Requirements:', fakeAccount.unlockRequirements);
      
      // Check if spear-phishing exists
      const spearPhishing = missions['spear-phishing'];
      if (spearPhishing) {
        console.log('   ✅ spear-phishing mission found');
      } else {
        console.log('   ❌ spear-phishing mission NOT found');
      }
    }
    
    return {
      success: true
    };
    
  } catch (error) {
    console.error('❌ Specific mission unlock test failed:', error);
    return null;
  }
};

// Test complete mission unlock debugging
export const testCompleteMissionUnlockDebugging = async () => {
  console.log('🧪 Testing complete mission unlock debugging...');
  
  try {
    const results = {
      unlockLogic: await debugMissionUnlockLogic(),
      specificUnlocks: await testSpecificMissionUnlocks()
    };
    
    console.log('\n🎉 All mission unlock debugging tests completed!');
    
    return results;
    
  } catch (error) {
    console.error('❌ Complete mission unlock debugging failed:', error);
    return null;
  }
};

// Run all mission unlock debugging tests
export const runAllMissionUnlockDebuggingTests = async () => {
  console.log('🚀 Starting all mission unlock debugging tests...');
  console.log('==========================================');
  
  const results = await testCompleteMissionUnlockDebugging();
  
  console.log('==========================================');
  console.log('📊 Mission Unlock Debugging Test Results Summary:');
  console.log(results);
  
  if (results) {
    console.log('✅ Mission unlock debugging tests completed successfully!');
    
    // Provide debugging suggestions
    if (results.unlockLogic?.unlockResults) {
      console.log('\n💡 Mission unlock analysis complete. Check:');
      console.log('   1. User level vs. required level');
      console.log('   2. Previous mission completion status');
      console.log('   3. Department score requirements');
      console.log('   4. Mission data structure in missions.js');
    } else {
      console.log('\n💡 Mission unlock analysis failed. Please check:');
      console.log('   1. User authentication status');
      console.log('   2. Firestore connection');
      console.log('   3. Mission data loading');
    }
  } else {
    console.log('❌ Mission unlock debugging tests failed');
  }
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testMissionUnlockDebug = {
    debugMissionUnlockLogic,
    testSpecificMissionUnlocks,
    testCompleteMissionUnlockDebugging,
    runAllMissionUnlockDebuggingTests
  };
  
  console.log('🧪 Mission unlock debugging test functions loaded. Use window.testMissionUnlockDebug.runAllMissionUnlockDebuggingTests() to run all tests.');
}

// Export all test functions
export default {
  debugMissionUnlockLogic,
  testSpecificMissionUnlocks,
  testCompleteMissionUnlockDebugging,
  runAllMissionUnlockDebuggingTests
}; 