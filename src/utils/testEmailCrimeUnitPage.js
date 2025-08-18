// Test script for EmailCrimeUnit page functionality
// Run these functions in browser console to test EmailCrimeUnit page

import { missions } from '../data/missions';

// Test mission generation for EmailCrimeUnit page
export const testMissionGeneration = () => {
  console.log('🧪 Testing mission generation for EmailCrimeUnit page...');
  
  // Mock user progress data
  const mockUserProgress = {
    level: 3,
    missionsCompleted: 5,
    totalScore: 400,
    completedMissions: ['know-the-lingo', 'spot-red-flags', 'email-imposter'],
    currentMissionId: 'spear-phishing'
  };
  
  console.log(`\n👤 Mock User Progress:`);
  console.log(`   Level: ${mockUserProgress.level}`);
  console.log(`   Missions Completed: ${mockUserProgress.missionsCompleted}`);
  console.log(`   Total Score: ${mockUserProgress.totalScore}`);
  console.log(`   Completed: ${mockUserProgress.completedMissions.join(', ')}`);
  console.log(`   Current Mission: ${mockUserProgress.currentMissionId}`);
  
  // Get Email Crimes missions
  const emailCrimesMissions = [
    'know-the-lingo',
    'spot-red-flags',
    'email-imposter',
    'spear-phishing',
    'fake-account',
    'wire-transfer',
    'perfect-impersonation'
  ];
  
  console.log(`\n📧 Email Crimes Missions Analysis:`);
  
  const missionResults = {};
  
  emailCrimesMissions.forEach(missionId => {
    const mission = missions[missionId];
    if (mission) {
      // Determine mission status
      let status = 'locked';
      let unlockRequirement = '';
      
      if (mockUserProgress.completedMissions.includes(missionId)) {
        status = 'completed';
      } else if (mockUserProgress.currentMissionId === missionId) {
        status = 'in-progress';
      } else {
        // Check if mission can be unlocked
        const requirements = mission.unlockRequirements;
        const levelMet = mockUserProgress.level >= requirements.minimumLevel;
        const scoreMet = mockUserProgress.totalScore >= requirements.minimumScore;
        const previousMissionsMet = requirements.previousMissions.every(prevMission => 
          mockUserProgress.completedMissions.includes(prevMission)
        );
        
        if (levelMet && scoreMet && previousMissionsMet) {
          status = 'available';
        } else {
          status = 'locked';
          const issues = [];
          if (!levelMet) issues.push(`Level ${requirements.minimumLevel}`);
          if (!scoreMet) issues.push(`Score ${requirements.minimumScore}`);
          if (!previousMissionsMet) issues.push(`Complete previous missions`);
          unlockRequirement = issues.join(', ');
        }
      }
      
      // Group by difficulty
      const difficulty = mission.difficulty;
      
      console.log(`\n   ${mission.title}:`);
      console.log(`     Difficulty: ${difficulty}`);
      console.log(`     Status: ${status.toUpperCase()}`);
      console.log(`     Required Level: ${mission.unlockRequirements.minimumLevel}`);
      console.log(`     Required Score: ${mission.unlockRequirements.minimumScore}`);
      
      if (status === 'locked') {
        console.log(`     🔒 Locked - Requirements: ${unlockRequirement}`);
      } else if (status === 'completed') {
        console.log(`     ✅ Completed`);
      } else if (status === 'in-progress') {
        console.log(`     🔄 In Progress`);
      } else if (status === 'available') {
        console.log(`     🔓 Available`);
      }
      
      missionResults[missionId] = {
        title: mission.title,
        difficulty,
        status,
        unlockRequirement,
        requiredLevel: mission.unlockRequirements.minimumLevel,
        requiredScore: mission.unlockRequirements.minimumScore
      };
    }
  });
  
  return missionResults;
};

// Test mission status determination
export const testMissionStatus = () => {
  console.log('🧪 Testing mission status determination...');
  
  const testScenarios = [
    {
      name: 'New User',
      userData: {
        level: 1,
        missionsCompleted: 0,
        totalScore: 0,
        completedMissions: [],
        currentMissionId: null
      }
    },
    {
      name: 'Beginner User',
      userData: {
        level: 2,
        missionsCompleted: 2,
        totalScore: 150,
        completedMissions: ['know-the-lingo', 'spot-red-flags'],
        currentMissionId: 'email-imposter'
      }
    },
    {
      name: 'Intermediate User',
      userData: {
        level: 3,
        missionsCompleted: 5,
        totalScore: 400,
        completedMissions: ['know-the-lingo', 'spot-red-flags', 'email-imposter'],
        currentMissionId: 'spear-phishing'
      }
    }
  ];
  
  testScenarios.forEach(scenario => {
    console.log(`\n👤 ${scenario.name}:`);
    console.log(`   Level: ${scenario.userData.level}, Score: ${scenario.userData.totalScore}`);
    console.log(`   Completed: ${scenario.userData.completedMissions.join(', ')}`);
    console.log(`   Current: ${scenario.userData.currentMissionId || 'None'}`);
    
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
        let status = 'locked';
        
        if (scenario.userData.completedMissions.includes(missionId)) {
          status = 'completed';
        } else if (scenario.userData.currentMissionId === missionId) {
          status = 'in-progress';
        } else {
          const requirements = mission.unlockRequirements;
          const levelMet = scenario.userData.level >= requirements.minimumLevel;
          const scoreMet = scenario.userData.totalScore >= requirements.minimumScore;
          const previousMissionsMet = requirements.previousMissions.every(prevMission => 
            scenario.userData.completedMissions.includes(prevMission)
          );
          
          if (levelMet && scoreMet && previousMissionsMet) {
            status = 'available';
          }
        }
        
        const statusIcon = {
          'completed': '✅',
          'in-progress': '🔄',
          'available': '🔓',
          'locked': '🔒'
        };
        
        console.log(`     ${statusIcon[status]} ${mission.title}: ${status.toUpperCase()}`);
      }
    });
  });
  
  return testScenarios;
};

// Test mission grouping by difficulty
export const testMissionGrouping = () => {
  console.log('🧪 Testing mission grouping by difficulty...');
  
  const emailCrimesMissions = [
    'know-the-lingo',
    'spot-red-flags',
    'email-imposter',
    'spear-phishing',
    'fake-account',
    'wire-transfer',
    'perfect-impersonation'
  ];
  
  const difficultyGroups = {
    beginner: [],
    intermediate: [],
    advanced: [],
    expert: []
  };
  
  emailCrimesMissions.forEach(missionId => {
    const mission = missions[missionId];
    if (mission) {
      const difficulty = mission.difficulty;
      if (difficultyGroups[difficulty]) {
        difficultyGroups[difficulty].push({
          id: missionId,
          title: mission.title,
          requiredLevel: mission.unlockRequirements.minimumLevel,
          estimatedTime: mission.estimatedTime
        });
      }
    }
  });
  
  console.log(`\n📚 Mission Groups by Difficulty:`);
  
  Object.entries(difficultyGroups).forEach(([difficulty, missions]) => {
    if (missions.length > 0) {
      console.log(`\n   ${difficulty.toUpperCase()} (${missions.length} missions):`);
      missions.forEach(mission => {
        console.log(`     • ${mission.title}`);
        console.log(`       Level ${mission.requiredLevel}, ${mission.estimatedTime} min`);
      });
    }
  });
  
  return difficultyGroups;
};

// Test unlock requirement text generation
export const testUnlockRequirementText = () => {
  console.log('🧪 Testing unlock requirement text generation...');
  
  const testUser = {
    level: 2,
    missionsCompleted: 1,
    totalScore: 100
  };
  
  console.log(`\n📝 Testing with user: Level ${testUser.level}, Score ${testUser.totalScore}`);
  
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
      const levelMet = testUser.level >= requirements.minimumLevel;
      const scoreMet = testUser.totalScore >= requirements.minimumScore;
      
      if (!levelMet || !scoreMet) {
        let requirementText = `Level ${requirements.minimumLevel}`;
        
        if (requirements.minimumScore > 0) {
          requirementText += `, Score ${requirements.minimumScore}`;
        }
        
        if (requirements.previousMissions.length > 0) {
          requirementText += `, Complete: ${requirements.previousMissions.join(', ')}`;
        }
        
        console.log(`\n🔒 ${mission.title}:`);
        console.log(`   Requirement: ${requirementText}`);
        
        // Show what user needs
        const levelNeeded = Math.max(0, requirements.minimumLevel - testUser.level);
        const scoreNeeded = Math.max(0, requirements.minimumScore - testUser.totalScore);
        
        if (levelNeeded > 0) {
          console.log(`   Need ${levelNeeded} more level(s)`);
        }
        if (scoreNeeded > 0) {
          console.log(`   Need ${scoreNeeded} more score`);
        }
      }
    }
  });
  
  return 'Unlock requirement text generation completed';
};

// Test complete EmailCrimeUnit page system
export const testCompleteEmailCrimeUnitSystem = async () => {
  console.log('🧪 Testing complete EmailCrimeUnit page system...');
  
  try {
    // Test mission generation
    const missionGeneration = testMissionGeneration();
    
    // Test mission status
    const missionStatus = testMissionStatus();
    
    // Test mission grouping
    const missionGrouping = testMissionGrouping();
    
    // Test unlock requirement text
    const unlockRequirementText = testUnlockRequirementText();
    
    console.log('\n✅ All EmailCrimeUnit page tests completed successfully!');
    
    return {
      missionGeneration,
      missionStatus,
      missionGrouping,
      unlockRequirementText
    };
    
  } catch (error) {
    console.error('❌ Error testing EmailCrimeUnit page system:', error);
    return null;
  }
};

// Run all EmailCrimeUnit page tests
export const runAllEmailCrimeUnitTests = async () => {
  console.log('🚀 Starting all EmailCrimeUnit page tests...');
  console.log('==========================================');
  
  const results = {
    missionGeneration: testMissionGeneration(),
    missionStatus: testMissionStatus(),
    missionGrouping: testMissionGrouping(),
    unlockRequirementText: testUnlockRequirementText(),
    completeSystem: await testCompleteEmailCrimeUnitSystem()
  };
  
  console.log('==========================================');
  console.log('📊 EmailCrimeUnit Page Test Results Summary:');
  console.log(results);
  
  const successCount = Object.values(results).filter(result => result !== null).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`✅ ${successCount}/${totalCount} tests passed`);
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testEmailCrimeUnitPage = {
    testMissionGeneration,
    testMissionStatus,
    testMissionGrouping,
    testUnlockRequirementText,
    testCompleteEmailCrimeUnitSystem,
    runAllEmailCrimeUnitTests
  };
  
  console.log('🧪 EmailCrimeUnit page test functions loaded. Use window.testEmailCrimeUnitPage.runAllEmailCrimeUnitTests() to run all tests.');
}

// Export all test functions
export default {
  testMissionGeneration,
  testMissionStatus,
  testMissionGrouping,
  testUnlockRequirementText,
  testCompleteEmailCrimeUnitSystem,
  runAllEmailCrimeUnitTests
}; 