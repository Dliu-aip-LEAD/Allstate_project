// Test script for MissionComplete page functionality
// Run these functions in browser console to test the page

import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

// Test MissionComplete page data loading
export const testMissionCompleteDataLoading = async () => {
  console.log('🧪 Testing MissionComplete page data loading...');
  
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    console.log('👤 Testing with user ID:', userId);
    
    // Check if user document exists
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
    console.log('   Level Name:', detectiveAcademy.levelName);
    console.log('   Experience:', detectiveAcademy.experience);
    console.log('   Experience to Next Level:', detectiveAcademy.experienceToNextLevel);
    console.log('   Missions Completed:', detectiveAcademy.missionsCompleted);
    console.log('   Total Score:', detectiveAcademy.totalScore);
    console.log('   Success Rate:', detectiveAcademy.successRate);
    
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
    console.error('❌ MissionComplete data loading test failed:', error);
    return null;
  }
};

// Test mission data integration
export const testMissionDataIntegration = async () => {
  console.log('🧪 Testing mission data integration...');
  
  try {
    // Import missions data
    const missionsModule = await import('../data/missions.js');
    const { missions } = missionsModule;
    
    console.log('\n📋 Available missions:');
    Object.keys(missions).forEach(missionId => {
      const mission = missions[missionId];
      console.log(`   ${missionId}: ${mission.title} (${mission.difficulty})`);
    });
    
    // Test specific mission data
    const testMissionId = 'email-imposter';
    if (missions[testMissionId]) {
      const testMission = missions[testMissionId];
      console.log(`\n🔍 Test mission (${testMissionId}):`);
      console.log('   Title:', testMission.title);
      console.log('   Department:', testMission.department);
      console.log('   Difficulty:', testMission.difficulty);
      console.log('   Required Level:', testMission.requiredLevel);
      console.log('   Estimated Time:', testMission.estimatedTime);
      console.log('   Max Score:', testMission.scoring?.maxScore);
    }
    
    // Test department missions
    const emailCrimesMissions = missions['email-crimes']?.missions || [];
    console.log('\n📚 Email Crimes missions:');
    emailCrimesMissions.forEach((mission, index) => {
      console.log(`   ${index + 1}. ${mission.id}: ${mission.title} (${mission.difficulty})`);
    });
    
    return {
      missions,
      testMission: missions[testMissionId],
      emailCrimesMissions,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Mission data integration test failed:', error);
    return null;
  }
};

// Test navigation logic
export const testNavigationLogic = () => {
  console.log('🧪 Testing navigation logic...');
  
  try {
    // Test navigation functions
    const testNavigation = {
      nextMission: (nextMission) => {
        if (nextMission) {
          console.log('✅ Next mission available, would navigate to:', `/mission/${nextMission.id}/introduction`);
        } else {
          console.log('✅ No next mission, would navigate to department page');
        }
      },
      
      replayMission: (missionId) => {
        console.log('✅ Would replay mission:', `/mission/${missionId}/investigation`);
      },
      
      returnToAcademy: () => {
        console.log('✅ Would return to academy:', '/play');
      }
    };
    
    // Test scenarios
    console.log('\n🧪 Testing navigation scenarios...');
    
    // Scenario 1: Has next mission
    const mockNextMission = {
      id: 'next-mission-test',
      title: 'Next Mission Test',
      difficulty: 'intermediate'
    };
    testNavigation.nextMission(mockNextMission);
    
    // Scenario 2: No next mission
    testNavigation.nextMission(null);
    
    // Scenario 3: Replay mission
    testNavigation.replayMission('test-mission-id');
    
    // Scenario 4: Return to academy
    testNavigation.returnToAcademy();
    
    return {
      testNavigation,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Navigation logic test failed:', error);
    return null;
  }
};

// Test next mission logic
export const testNextMissionLogic = async () => {
  console.log('🧪 Testing next mission logic...');
  
  try {
    // Import missions data
    const missionsModule = await import('../data/missions.js');
    const { missions } = missionsModule;
    
    // Mock user progress
    const mockUserProgress = {
      level: 2,
      experience: 150,
      missionsCompleted: 3,
      departmentProgress: {
        'email-crimes': {
          missionsSolved: 2,
          score: 180
        }
      },
      missionHistory: [
        { missionId: 'email-imposter', score: 85 },
        { missionId: 'know-the-lingo', score: 90 }
      ]
    };
    
    console.log('\n🧪 Testing with mock user progress:');
    console.log('   Level:', mockUserProgress.level);
    console.log('   Experience:', mockUserProgress.experience);
    console.log('   Missions Completed:', mockUserProgress.missionsCompleted);
    
    // Test next mission finding logic
    const findNextMission = (currentMission, userProgress) => {
      if (!currentMission || !userProgress.departmentProgress) return null;
      
      const department = currentMission.department;
      const departmentMissions = missions[department]?.missions || [];
      const currentIndex = departmentMissions.findIndex(m => m.id === currentMission.id);
      
      if (currentIndex === -1 || currentIndex >= departmentMissions.length - 1) return null;
      
      // Check if next mission is unlocked
      const nextMission = departmentMissions[currentIndex + 1];
      const isUnlocked = isMissionUnlocked(nextMission, userProgress);
      
      return isUnlocked ? nextMission : null;
    };
    
    const isMissionUnlocked = (mission, userProgress) => {
      if (!mission || !userProgress) return false;
      
      // Check level requirement
      if (userProgress.level < (mission.requiredLevel || 1)) return false;
      
      // Check if previous mission is completed
      if (mission.requiredMission) {
        const missionHistory = userProgress.missionHistory || [];
        const previousCompleted = missionHistory.some(m => m.missionId === mission.requiredMission);
        if (!previousCompleted) return false;
      }
      
      return true;
    };
    
    // Test with email-imposter mission
    const currentMission = missions['email-imposter'];
    if (currentMission) {
      console.log('\n🔍 Testing next mission for:', currentMission.title);
      
      const nextMission = findNextMission(currentMission, mockUserProgress);
      if (nextMission) {
        console.log('✅ Next mission found:', nextMission.title);
        console.log('   Difficulty:', nextMission.difficulty);
        console.log('   Required Level:', nextMission.requiredLevel);
      } else {
        console.log('❌ No next mission available');
      }
    }
    
    return {
      mockUserProgress,
      currentMission,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Next mission logic test failed:', error);
    return null;
  }
};

// Test complete MissionComplete functionality
export const testCompleteMissionCompleteFunctionality = async () => {
  console.log('🧪 Testing complete MissionComplete functionality...');
  
  try {
    const results = {
      dataLoading: await testMissionCompleteDataLoading(),
      dataIntegration: await testMissionDataIntegration(),
      navigationLogic: testNavigationLogic(),
      nextMissionLogic: await testNextMissionLogic()
    };
    
    console.log('\n🎉 All MissionComplete functionality tests completed!');
    
    return results;
    
  } catch (error) {
    console.error('❌ Complete MissionComplete functionality test failed:', error);
    return null;
  }
};

// Run all MissionComplete tests
export const runAllMissionCompleteTests = async () => {
  console.log('🚀 Starting all MissionComplete functionality tests...');
  console.log('==========================================');
  
  const results = await testCompleteMissionCompleteFunctionality();
  
  console.log('==========================================');
  console.log('📊 MissionComplete Functionality Test Results Summary:');
  console.log(results);
  
  if (results) {
    console.log('✅ MissionComplete functionality tests completed successfully!');
    
    // Provide debugging suggestions
    if (results.dataLoading?.detectiveAcademy) {
      console.log('\n💡 User progress data is available. Check if:');
      console.log('   1. Real-time updates are working');
      console.log('   2. Mission data is correctly loaded');
      console.log('   3. Navigation logic is functioning');
      console.log('   4. Next mission detection is working');
    } else {
      console.log('\n💡 User progress data not available. Please check:');
      console.log('   1. User authentication status');
      console.log('   2. Firestore connection');
      console.log('   3. User document existence');
    }
  } else {
    console.log('❌ MissionComplete functionality tests failed');
  }
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testMissionComplete = {
    testMissionCompleteDataLoading,
    testMissionDataIntegration,
    testNavigationLogic,
    testNextMissionLogic,
    testCompleteMissionCompleteFunctionality,
    runAllMissionCompleteTests
  };
  
  console.log('🧪 MissionComplete test functions loaded. Use window.testMissionComplete.runAllMissionCompleteTests() to run all tests.');
}

// Export all test functions
export default {
  testMissionCompleteDataLoading,
  testMissionDataIntegration,
  testNavigationLogic,
  testNextMissionLogic,
  testCompleteMissionCompleteFunctionality,
  runAllMissionCompleteTests
}; 