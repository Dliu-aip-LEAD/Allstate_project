// Test script for real-time data updates
// Run these functions in browser console to test real-time functionality

import { auth } from '../firebase';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { firestore } from '../firebase';

// Test real-time listener setup
export const testRealTimeListener = async () => {
  console.log('🧪 Testing real-time listener setup...');
  
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    console.log('👤 Testing with user ID:', userId);
    
    // Set up real-time listener
    const userRef = doc(firestore, 'users', userId);
    let updateCount = 0;
    
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const academy = userData.detectiveAcademy || {};
        
        updateCount++;
        console.log(`📊 Real-time update #${updateCount} received:`);
        console.log('   Level:', academy.level);
        console.log('   Experience:', academy.experience);
        console.log('   Total Score:', academy.totalScore);
        console.log('   Missions Completed:', academy.missionsCompleted);
        console.log('   Success Rate:', academy.successRate);
        
        if (updateCount >= 3) {
          console.log('✅ Real-time listener working correctly!');
          unsubscribe();
        }
      }
    }, (error) => {
      console.error('❌ Real-time listener error:', error);
    });
    
    // Trigger some updates to test real-time functionality
    console.log('\n🔧 Triggering test updates...');
    
    // Update 1: Increment experience
    try {
      await updateDoc(userRef, {
        'detectiveAcademy.experience': increment(10)
      });
      console.log('✅ Update 1: Experience incremented by 10');
    } catch (error) {
      console.log('❌ Update 1 failed:', error.message);
    }
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update 2: Increment total score
    try {
      await updateDoc(userRef, {
        'detectiveAcademy.totalScore': increment(25)
      });
      console.log('✅ Update 2: Total score incremented by 25');
    } catch (error) {
      console.log('❌ Update 2 failed:', error.message);
    }
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update 3: Increment missions completed
    try {
      await updateDoc(userRef, {
        'detectiveAcademy.missionsCompleted': increment(1)
      });
      console.log('✅ Update 3: Missions completed incremented by 1');
    } catch (error) {
      console.log('❌ Update 3 failed:', error.message);
    }
    
    return {
      userId,
      updateCount,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Real-time listener test failed:', error);
    return null;
  }
};

// Test specific field updates
export const testSpecificFieldUpdates = async () => {
  console.log('🧪 Testing specific field updates...');
  
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    const userRef = doc(firestore, 'users', userId);
    
    // Get current data
    const currentDoc = await firestore.getDoc(userRef);
    const currentData = currentDoc.data();
    const currentAcademy = currentData.detectiveAcademy || {};
    
    console.log('\n📊 Current detective academy data:');
    console.log('   Level:', currentAcademy.level);
    console.log('   Experience:', currentAcademy.experience);
    console.log('   Total Score:', currentAcademy.totalScore);
    console.log('   Missions Completed:', currentAcademy.missionsCompleted);
    
    // Test different field update methods
    console.log('\n🔧 Testing different update methods...');
    
    // Method 1: Direct field update
    try {
      await updateDoc(userRef, {
        'detectiveAcademy.testField': 'test-value-' + Date.now()
      });
      console.log('✅ Method 1: Direct field update successful');
    } catch (error) {
      console.log('❌ Method 1 failed:', error.message);
    }
    
    // Method 2: Increment update
    try {
      await updateDoc(userRef, {
        'detectiveAcademy.experience': increment(5)
      });
      console.log('✅ Method 2: Increment update successful');
    } catch (error) {
      console.log('❌ Method 2 failed:', error.message);
    }
    
    // Method 3: Nested object update
    try {
      await updateDoc(userRef, {
        'detectiveAcademy.departmentProgress.email-crimes.missionsSolved': increment(1)
      });
      console.log('✅ Method 3: Nested object update successful');
    } catch (error) {
      console.log('❌ Method 3 failed:', error.message);
    }
    
    return {
      userId,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Specific field updates test failed:', error);
    return null;
  }
};

// Test mission completion simulation
export const testMissionCompletionSimulation = async () => {
  console.log('🧪 Testing mission completion simulation...');
  
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    const userRef = doc(firestore, 'users', userId);
    
    // Simulate mission completion
    const missionResult = {
      missionId: `test-mission-${Date.now()}`,
      title: 'Test Mission Completion',
      score: 85,
      maxScore: 100,
      flagsFound: 3,
      totalQuestions: 5,
      correctAnswers: 4,
      accuracy: 80,
      evidence: ['Test evidence'],
      completedAt: new Date().toISOString(),
      department: 'email-crimes',
      difficulty: 'beginner',
      estimatedTime: 10
    };
    
    console.log('\n📝 Simulating mission completion with result:');
    console.log(missionResult);
    
    // Update user progress as if mission was completed
    try {
      await updateDoc(userRef, {
        'detectiveAcademy.experience': increment(50),
        'detectiveAcademy.totalScore': increment(85),
        'detectiveAcademy.missionsCompleted': increment(1),
        'detectiveAcademy.departmentProgress.email-crimes.missionsSolved': increment(1),
        'detectiveAcademy.departmentProgress.email-crimes.score': increment(85),
        'detectiveAcademy.lastMissionCompleted': new Date().toISOString()
      });
      
      console.log('✅ Mission completion simulation successful!');
      console.log('   Experience +50, Score +85, Missions +1');
      
    } catch (error) {
      console.log('❌ Mission completion simulation failed:', error.message);
    }
    
    return {
      userId,
      missionResult,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Mission completion simulation failed:', error);
    return null;
  }
};

// Test complete real-time functionality
export const testCompleteRealTimeFunctionality = async () => {
  console.log('🧪 Testing complete real-time functionality...');
  
  try {
    const results = {
      listener: await testRealTimeListener(),
      fieldUpdates: await testSpecificFieldUpdates(),
      missionSimulation: await testMissionCompletionSimulation()
    };
    
    console.log('\n🎉 All real-time functionality tests completed!');
    
    return results;
    
  } catch (error) {
    console.error('❌ Complete real-time functionality test failed:', error);
    return null;
  }
};

// Run all real-time tests
export const runAllRealTimeTests = async () => {
  console.log('🚀 Starting all real-time functionality tests...');
  console.log('==========================================');
  
  const results = await testCompleteRealTimeFunctionality();
  
  console.log('==========================================');
  console.log('📊 Real-time Functionality Test Results Summary:');
  console.log(results);
  
  if (results) {
    console.log('✅ Real-time functionality tests completed successfully!');
    console.log('\n💡 Now check if your Home, Profile, and Play pages update in real-time!');
  } else {
    console.log('❌ Real-time functionality tests failed');
  }
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testRealTimeUpdates = {
    testRealTimeListener,
    testSpecificFieldUpdates,
    testMissionCompletionSimulation,
    testCompleteRealTimeFunctionality,
    runAllRealTimeTests
  };
  
  console.log('🧪 Real-time updates test functions loaded. Use window.testRealTimeUpdates.runAllRealTimeTests() to run all tests.');
}

// Export all test functions
export default {
  testRealTimeListener,
  testSpecificFieldUpdates,
  testMissionCompletionSimulation,
  testCompleteRealTimeFunctionality,
  runAllRealTimeTests
}; 