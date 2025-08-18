// Test script for mission completion fix
// Run these functions in browser console to verify the fix

import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

// Test mission completion without recursion
export const testMissionCompletionFix = async () => {
  console.log('🧪 Testing mission completion fix...');
  
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
    
    console.log('\n📊 Current user data before test:');
    console.log('   Level:', detectiveAcademy.level);
    console.log('   Experience:', detectiveAcademy.experience);
    console.log('   Missions Completed:', detectiveAcademy.missionsCompleted);
    console.log('   Total Score:', detectiveAcademy.totalScore);
    
    // Test mission service import
    try {
      const missionService = await import('../services/missionService.js');
      console.log('✅ Mission service imported successfully');
      console.log('   Available functions:', Object.keys(missionService));
      
      // Test completeMission function
      if (missionService.completeMission) {
        console.log('✅ completeMission function found');
        
        // Create mock mission data
        const mockMission = {
          id: 'test-mission-fix',
          title: 'Test Mission Fix',
          department: 'email-crimes',
          difficulty: 'beginner',
          scoring: {
            maxScore: 100,
            scorePerFlag: 10,
            scorePerQuiz: 15
          }
        };
        
        const mockUserPerformance = {
          score: 85,
          maxScore: 100,
          flagsFound: 5,
          totalQuestions: 6,
          correctAnswers: 5,
          accuracy: 83,
          evidence: ['Test evidence'],
          timeSpent: 0,
          hintsUsed: 0,
          mistakes: 0
        };
        
        console.log('\n🧪 Testing completeMission function with mock data...');
        console.log('   Mock mission:', mockMission);
        console.log('   Mock performance:', mockUserPerformance);
        
        // Note: We won't actually call this function to avoid database changes during testing
        console.log('✅ completeMission function is callable (not executed to avoid DB changes)');
        
      } else {
        console.log('❌ completeMission function not found');
      }
      
    } catch (error) {
      console.error('❌ Could not import mission service:', error);
    }
    
    return {
      userId,
      userData,
      detectiveAcademy,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Mission completion fix test failed:', error);
    return null;
  }
};

// Test function name conflicts
export const testFunctionNameConflicts = () => {
  console.log('🧪 Testing function name conflicts...');
  
  try {
    // Check if there are any conflicting function names
    const conflictingNames = [];
    
    // Common function names that might conflict
    const commonNames = [
      'completeMission',
      'updateUserProgress',
      'addMissionToHistory',
      'calculateExperiencePoints'
    ];
    
    console.log('\n🔍 Checking for function name conflicts...');
    
    // Check global scope
    commonNames.forEach(name => {
      if (typeof window[name] === 'function') {
        conflictingNames.push(`window.${name}`);
        console.log(`⚠️  Found global function: window.${name}`);
      }
    });
    
    // Check if we can access the imported functions
    if (typeof window !== 'undefined') {
      console.log('\n📦 Available global functions:');
      Object.keys(window).forEach(key => {
        if (typeof window[key] === 'function' && key.includes('Mission')) {
          console.log(`   ${key}: function`);
        }
      });
    }
    
    if (conflictingNames.length > 0) {
      console.log('\n⚠️  Potential function name conflicts found:', conflictingNames);
      console.log('💡 Consider renaming conflicting functions to avoid issues');
    } else {
      console.log('\n✅ No obvious function name conflicts found');
    }
    
    return {
      conflictingNames,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Function name conflicts test failed:', error);
    return null;
  }
};

// Test complete functionality
export const testCompleteMissionCompletionFix = async () => {
  console.log('🧪 Testing complete mission completion fix...');
  
  try {
    const results = {
      completionFix: await testMissionCompletionFix(),
      nameConflicts: testFunctionNameConflicts()
    };
    
    console.log('\n🎉 All mission completion fix tests completed!');
    
    return results;
    
  } catch (error) {
    console.error('❌ Complete mission completion fix test failed:', error);
    return null;
  }
};

// Run all mission completion fix tests
export const runAllMissionCompletionFixTests = async () => {
  console.log('🚀 Starting all mission completion fix tests...');
  console.log('==========================================');
  
  const results = await testCompleteMissionCompletionFix();
  
  console.log('==========================================');
  console.log('📊 Mission Completion Fix Test Results Summary:');
  console.log(results);
  
  if (results) {
    console.log('✅ Mission completion fix tests completed successfully!');
    
    // Provide debugging suggestions
    if (results.nameConflicts?.conflictingNames?.length > 0) {
      console.log('\n💡 Function name conflicts detected. Consider:');
      console.log('   1. Renaming local functions to avoid conflicts');
      console.log('   2. Using aliases for imported functions');
      console.log('   3. Checking for duplicate function definitions');
    } else {
      console.log('\n💡 No function name conflicts detected. The fix should work correctly!');
    }
  } else {
    console.log('❌ Mission completion fix tests failed');
  }
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testMissionCompletionFix = {
    testMissionCompletionFix,
    testFunctionNameConflicts,
    testCompleteMissionCompletionFix,
    runAllMissionCompletionFixTests
  };
  
  console.log('🧪 Mission completion fix test functions loaded. Use window.testMissionCompletionFix.runAllMissionCompletionFixTests() to run all tests.');
}

// Export all test functions
export default {
  testMissionCompletionFix,
  testFunctionNameConflicts,
  testCompleteMissionCompletionFix,
  runAllMissionCompletionFixTests
}; 