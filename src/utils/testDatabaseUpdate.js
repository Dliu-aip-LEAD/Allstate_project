// Test script for database update functionality
// Run these functions in browser console to test database updates

import { updateUserProgress, addMissionToHistory, getUserProgress } from './userProgress';
import { auth } from '../firebase';

// Test database update with increment
export const testDatabaseUpdate = async () => {
  console.log('🧪 Testing database update functionality...');
  
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
    
    // Get current user progress
    console.log('\n📊 Current user progress:');
    const currentProgress = await getUserProgress(userId);
    if (currentProgress) {
      console.log('   Level:', currentProgress.level);
      console.log('   Experience:', currentProgress.experience);
      console.log('   Missions Completed:', currentProgress.missionsCompleted);
      console.log('   Total Score:', currentProgress.totalScore);
      console.log('   Department Progress:', currentProgress.departmentProgress);
    } else {
      console.log('   No progress data found');
    }
    
    // Test mission completion data
    const mockMissionResults = {
      missionId: 'test-mission-123',
      score: 85,
      maxScore: 100,
      flagsFound: 5,
      totalQuestions: 6,
      correctAnswers: 5,
      accuracy: 83,
      evidence: ['Test evidence 1', 'Test evidence 2'],
      completedAt: new Date().toISOString(),
      department: 'email-crimes',
      difficulty: 'beginner'
    };
    
    console.log('\n📝 Test mission results:');
    console.log(mockMissionResults);
    
    // Test adding mission to history
    console.log('\n📚 Testing addMissionToHistory...');
    const historyResult = await addMissionToHistory(userId, mockMissionResults);
    if (historyResult) {
      console.log('✅ Mission added to history successfully');
      console.log('   New history length:', historyResult.length);
    } else {
      console.log('❌ Failed to add mission to history');
    }
    
    // Test updating user progress
    console.log('\n📈 Testing updateUserProgress...');
    const progressUpdate = {
      missionsCompleted: 1,
      totalScore: 85,
      departmentProgress: {
        'email-crimes': {
          missionsSolved: 1,
          progress: 85,
          score: 85
        }
      }
    };
    
    console.log('   Progress update data:', progressUpdate);
    await updateUserProgress(userId, progressUpdate);
    console.log('✅ User progress updated successfully');
    
    // Get updated user progress
    console.log('\n📊 Updated user progress:');
    const updatedProgress = await getUserProgress(userId);
    if (updatedProgress) {
      console.log('   Level:', updatedProgress.level);
      console.log('   Experience:', updatedProgress.experience);
      console.log('   Missions Completed:', updatedProgress.missionsCompleted);
      console.log('   Total Score:', updatedProgress.totalScore);
      console.log('   Department Progress:', updatedProgress.departmentProgress);
    }
    
    console.log('\n🎉 Database update test completed successfully!');
    
    return {
      currentProgress,
      updatedProgress,
      historyResult,
      mockMissionResults
    };
    
  } catch (error) {
    console.error('❌ Database update test failed:', error);
    return null;
  }
};

// Test specific increment functionality
export const testIncrementFunctionality = async () => {
  console.log('🧪 Testing increment functionality...');
  
  try {
    const userId = localStorage.getItem('userId');
    if (!userId || userId === 'anonymous') {
      console.log('❌ No valid user ID found. Please log in first.');
      return null;
    }
    
    console.log('👤 Testing increment with user ID:', userId);
    
    // Test multiple increments
    const incrementTests = [
      { missionsCompleted: 1, totalScore: 50 },
      { missionsCompleted: 1, totalScore: 75 },
      { missionsCompleted: 1, totalScore: 100 }
    ];
    
    for (let i = 0; i < incrementTests.length; i++) {
      const test = incrementTests[i];
      console.log(`\n📈 Test ${i + 1}: Incrementing missions +${test.missionsCompleted}, score +${test.totalScore}`);
      
      await updateUserProgress(userId, {
        missionsCompleted: test.missionsCompleted,
        totalScore: test.totalScore,
        departmentProgress: {
          'email-crimes': {
            missionsSolved: test.missionsCompleted,
            progress: 90,
            score: test.totalScore
          }
        }
      });
      
      console.log(`✅ Increment test ${i + 1} completed`);
    }
    
    // Get final progress
    const finalProgress = await getUserProgress(userId);
    console.log('\n📊 Final progress after increments:');
    console.log('   Missions Completed:', finalProgress.missionsCompleted);
    console.log('   Total Score:', finalProgress.totalScore);
    console.log('   Department Progress:', finalProgress.departmentProgress);
    
    console.log('\n🎉 Increment functionality test completed!');
    
    return finalProgress;
    
  } catch (error) {
    console.error('❌ Increment functionality test failed:', error);
    return null;
  }
};

// Test error handling
export const testErrorHandling = async () => {
  console.log('🧪 Testing error handling...');
  
  try {
    // Test with invalid user ID
    console.log('\n⚠️  Testing with invalid user ID...');
    try {
      await updateUserProgress('invalid-user-id', { missionsCompleted: 1 });
      console.log('❌ Should have failed with invalid user ID');
    } catch (error) {
      console.log('✅ Correctly handled invalid user ID error:', error.message);
    }
    
    // Test with invalid data
    console.log('\n⚠️  Testing with invalid data...');
    try {
      await updateUserProgress('test-user', { invalidField: 'invalidValue' });
      console.log('✅ Handled invalid data gracefully');
    } catch (error) {
      console.log('✅ Correctly handled invalid data error:', error.message);
    }
    
    console.log('\n🎉 Error handling test completed!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error handling test failed:', error);
    return false;
  }
};

// Run all database update tests
export const runAllDatabaseUpdateTests = async () => {
  console.log('🚀 Starting all database update tests...');
  console.log('==========================================');
  
  const results = {
    databaseUpdate: await testDatabaseUpdate(),
    incrementFunctionality: await testIncrementFunctionality(),
    errorHandling: await testErrorHandling()
  };
  
  console.log('==========================================');
  console.log('📊 Database Update Test Results Summary:');
  console.log(results);
  
  const successCount = Object.values(results).filter(result => result !== null && result !== false).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`✅ ${successCount}/${totalCount} tests passed`);
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testDatabaseUpdate = {
    testDatabaseUpdate,
    testIncrementFunctionality,
    testErrorHandling,
    runAllDatabaseUpdateTests
  };
  
  console.log('🧪 Database update test functions loaded. Use window.testDatabaseUpdate.runAllDatabaseUpdateTests() to run all tests.');
}

// Export all test functions
export default {
  testDatabaseUpdate,
  testIncrementFunctionality,
  testErrorHandling,
  runAllDatabaseUpdateTests
}; 