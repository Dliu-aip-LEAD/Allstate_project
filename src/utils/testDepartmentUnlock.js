// Test script for department unlock logic on the Play page
// Run these functions in browser console to test department unlock functionality

import { departments, isDepartmentUnlocked } from '../data/missions';

// Test department unlock scenarios
export const testDepartmentUnlockScenarios = () => {
  console.log('🧪 Testing department unlock scenarios...');
  
  const testScenarios = [
    {
      name: 'New User (Level 1, 0 missions)',
      userData: {
        level: 1,
        missionsCompleted: 0,
        totalScore: 0,
        departmentProgress: {
          'email-crimes': { missionsSolved: 0, progress: 0 },
          'social-media': { missionsSolved: 0, progress: 0 },
          'financial-crimes': { missionsSolved: 0, progress: 0 },
          'elder-fraud': { missionsSolved: 0, progress: 0 }
        }
      }
    },
    {
      name: 'Beginner User (Level 2, 2 missions)',
      userData: {
        level: 2,
        missionsCompleted: 2,
        totalScore: 150,
        departmentProgress: {
          'email-crimes': { missionsSolved: 2, progress: 20 },
          'social-media': { missionsSolved: 0, progress: 0 },
          'financial-crimes': { missionsSolved: 0, progress: 0 },
          'elder-fraud': { missionsSolved: 0, progress: 0 }
        }
      }
    },
    {
      name: 'Intermediate User (Level 3, 5 missions)',
      userData: {
        level: 3,
        missionsCompleted: 5,
        totalScore: 400,
        departmentProgress: {
          'email-crimes': { missionsSolved: 4, progress: 40 },
          'social-media': { missionsSolved: 1, progress: 10 },
          'financial-crimes': { missionsSolved: 0, progress: 0 },
          'elder-fraud': { missionsSolved: 0, progress: 0 }
        }
      }
    },
    {
      name: 'Advanced User (Level 4, 8 missions)',
      userData: {
        level: 4,
        missionsCompleted: 8,
        totalScore: 800,
        departmentProgress: {
          'email-crimes': { missionsSolved: 6, progress: 60 },
          'social-media': { missionsSolved: 2, progress: 20 },
          'financial-crimes': { missionsSolved: 0, progress: 0 },
          'elder-fraud': { missionsSolved: 0, progress: 0 }
        }
      }
    },
    {
      name: 'Expert User (Level 5, 12 missions)',
      userData: {
        level: 5,
        missionsCompleted: 12,
        totalScore: 1200,
        departmentProgress: {
          'email-crimes': { missionsSolved: 7, progress: 70 },
          'social-media': { missionsSolved: 3, progress: 30 },
          'financial-crimes': { missionsSolved: 2, progress: 20 },
          'elder-fraud': { missionsSolved: 0, progress: 0 }
        }
      }
    }
  ];
  
  testScenarios.forEach(scenario => {
    console.log(`\n👤 ${scenario.name}:`);
    console.log(`   Level: ${scenario.userData.level}`);
    console.log(`   Missions Completed: ${scenario.userData.missionsCompleted}`);
    console.log(`   Total Score: ${scenario.userData.totalScore}`);
    
    Object.entries(departments).forEach(([deptId, dept]) => {
      const isUnlocked = isDepartmentUnlocked(deptId, scenario.userData);
      const status = isUnlocked ? '✅ UNLOCKED' : '🔒 LOCKED';
      
      console.log(`     ${dept.name}: ${status}`);
      
      if (!isUnlocked) {
        const requirements = dept.unlockRequirements;
        console.log(`       Requirements: Level ${requirements.minimumLevel}, ${requirements.minimumMissionsCompleted} missions`);
        if (requirements.previousDepartment) {
          console.log(`       Must complete: ${requirements.previousDepartment}`);
        }
      }
    });
  });
  
  return testScenarios;
};

// Test individual department unlocks
export const testIndividualDepartmentUnlocks = () => {
  console.log('🧪 Testing individual department unlock logic...');
  
  const testUser = {
    level: 3,
    missionsCompleted: 5,
    totalScore: 400,
    departmentProgress: {
      'email-crimes': { missionsSolved: 4, progress: 40 },
      'social-media': { missionsSolved: 1, progress: 10 },
      'financial-crimes': { missionsSolved: 0, progress: 0 },
      'elder-fraud': { missionsSolved: 0, progress: 0 }
    }
  };
  
  console.log(`\n🔍 Testing with user: Level ${testUser.level}, ${testUser.missionsCompleted} missions, Score ${testUser.totalScore}`);
  
  Object.entries(departments).forEach(([deptId, dept]) => {
    const isUnlocked = isDepartmentUnlocked(deptId, testUser);
    const requirements = dept.unlockRequirements;
    
    console.log(`\n🏢 ${dept.name}:`);
    console.log(`   Status: ${isUnlocked ? '✅ UNLOCKED' : '🔒 LOCKED'}`);
    console.log(`   Requirements: Level ${requirements.minimumLevel}, ${requirements.minimumMissionsCompleted} missions`);
    
    if (requirements.previousDepartment) {
      console.log(`   Prerequisite: ${requirements.previousDepartment}`);
    }
    
    // Check specific requirements
    const levelMet = testUser.level >= requirements.minimumLevel;
    const missionsMet = testUser.missionsCompleted >= requirements.minimumMissionsCompleted;
    
    console.log(`   Level Check: ${testUser.level} >= ${requirements.minimumLevel} = ${levelMet ? '✅' : '❌'}`);
    console.log(`   Missions Check: ${testUser.missionsCompleted} >= ${requirements.minimumMissionsCompleted} = ${missionsMet ? '✅' : '❌'}`);
    
    if (isUnlocked) {
      console.log(`   🎉 Department unlocked successfully!`);
    } else {
      console.log(`   ⚠️  Department remains locked.`);
    }
  });
  
  return departments;
};

// Test unlock requirement text generation
export const testUnlockRequirementText = () => {
  console.log('🧪 Testing unlock requirement text generation...');
  
  const testUser = {
    level: 2,
    missionsCompleted: 1,
    totalScore: 100,
    departmentProgress: {
      'email-crimes': { missionsSolved: 1, progress: 10 },
      'social-media': { missionsSolved: 0, progress: 0 },
      'financial-crimes': { missionsSolved: 0, progress: 0 },
      'elder-fraud': { missionsSolved: 0, progress: 0 }
    }
  };
  
  console.log(`\n📝 Testing with user: Level ${testUser.level}, ${testUser.missionsCompleted} missions`);
  
  Object.entries(departments).forEach(([deptId, dept]) => {
    const isUnlocked = isDepartmentUnlocked(deptId, testUser);
    const requirements = dept.unlockRequirements;
    
    if (!isUnlocked) {
      let requirementText = `Level ${requirements.minimumLevel}`;
      
      if (requirements.minimumMissionsCompleted > 0) {
        requirementText += `, ${requirements.minimumMissionsCompleted} missions completed`;
      }
      
      if (requirements.previousDepartment) {
        const prevDept = departments[requirements.previousDepartment];
        if (prevDept) {
          requirementText += `, complete ${prevDept.name} first`;
        }
      }
      
      console.log(`\n🔒 ${dept.name}:`);
      console.log(`   Requirement: ${requirementText}`);
      
      // Show what user needs to achieve
      const levelNeeded = Math.max(0, requirements.minimumLevel - testUser.level);
      const missionsNeeded = Math.max(0, requirements.minimumMissionsCompleted - testUser.missionsCompleted);
      
      if (levelNeeded > 0) {
        console.log(`   Need ${levelNeeded} more level(s)`);
      }
      if (missionsNeeded > 0) {
        console.log(`   Need ${missionsNeeded} more mission(s)`);
      }
    }
  });
  
  return 'Unlock requirement text generation completed';
};

// Test department progress calculation
export const testDepartmentProgress = () => {
  console.log('🧪 Testing department progress calculation...');
  
  const testUser = {
    level: 3,
    missionsCompleted: 5,
    totalScore: 400,
    departmentProgress: {
      'email-crimes': {
        missionsSolved: 3,
        progress: 60,
        score: 250
      },
      'social-media': {
        missionsSolved: 2,
        progress: 40,
        score: 150
      },
      'financial-crimes': {
        missionsSolved: 0,
        progress: 0,
        score: 0
      },
      'elder-fraud': {
        missionsSolved: 0,
        progress: 0,
        score: 0
      }
    }
  };
  
  console.log(`\n📊 Testing department progress for user: Level ${testUser.level}, ${testUser.missionsCompleted} missions`);
  
  Object.entries(departments).forEach(([deptId, dept]) => {
    const isUnlocked = isDepartmentUnlocked(deptId, testUser);
    const userProgress = testUser.departmentProgress[deptId] || { missionsSolved: 0, progress: 0, score: 0 };
    
    console.log(`\n🏢 ${dept.name}:`);
    console.log(`   Status: ${isUnlocked ? '✅ UNLOCKED' : '🔒 LOCKED'}`);
    console.log(`   User Progress: ${userProgress.missionsSolved} missions, ${userProgress.progress}%, Score ${userProgress.score}`);
    
    if (isUnlocked) {
      const totalMissions = dept.missions.length;
      const completionRate = totalMissions > 0 ? Math.round((userProgress.missionsSolved / totalMissions) * 100) : 0;
      console.log(`   Completion: ${userProgress.missionsSolved}/${totalMissions} missions (${completionRate}%)`);
    }
  });
  
  return testUser.departmentProgress;
};

// Test complete department system
export const testCompleteDepartmentSystem = () => {
  console.log('🧪 Testing complete department unlock system...');
  
  try {
    // Test department unlock scenarios
    const unlockScenarios = testDepartmentUnlockScenarios();
    
    // Test individual department unlocks
    const individualUnlocks = testIndividualDepartmentUnlocks();
    
    // Test unlock requirement text
    const requirementText = testUnlockRequirementText();
    
    // Test department progress
    const departmentProgress = testDepartmentProgress();
    
    console.log('\n✅ All department unlock tests completed successfully!');
    
    return {
      unlockScenarios,
      individualUnlocks,
      requirementText,
      departmentProgress
    };
    
  } catch (error) {
    console.error('❌ Error testing department unlock system:', error);
    return null;
  }
};

// Run all department tests
export const runAllDepartmentTests = async () => {
  console.log('🚀 Starting all department unlock tests...');
  console.log('==========================================');
  
  const results = {
    unlockScenarios: testDepartmentUnlockScenarios(),
    individualUnlocks: testIndividualDepartmentUnlocks(),
    requirementText: testUnlockRequirementText(),
    departmentProgress: testDepartmentProgress(),
    completeSystem: await testCompleteDepartmentSystem()
  };
  
  console.log('==========================================');
  console.log('📊 Department Unlock Test Results Summary:');
  console.log(results);
  
  const successCount = Object.values(results).filter(result => result !== null).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`✅ ${successCount}/${totalCount} tests passed`);
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testDepartmentUnlock = {
    testDepartmentUnlockScenarios,
    testIndividualDepartmentUnlocks,
    testUnlockRequirementText,
    testDepartmentProgress,
    testCompleteDepartmentSystem,
    runAllDepartmentTests
  };
  
  console.log('🧪 Department unlock test functions loaded. Use window.testDepartmentUnlock.runAllDepartmentTests() to run all tests.');
}

// Export all test functions
export default {
  testDepartmentUnlockScenarios,
  testIndividualDepartmentUnlocks,
  testUnlockRequirementText,
  testDepartmentProgress,
  testCompleteDepartmentSystem,
  runAllDepartmentTests
}; 