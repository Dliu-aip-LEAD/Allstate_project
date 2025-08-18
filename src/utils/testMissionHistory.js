// Test script specifically for testing mission history updates
// Run these functions in browser console to debug mission history issues

import { auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

// Test direct mission history update
export const testDirectMissionHistoryUpdate = async () => {
  console.log('🧪 Testing direct mission history update...');
  
  try {
    // Get current user ID from Firebase Auth
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    console.log('👤 Testing with user ID:', userId);
    
    // Get current user document
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('❌ User document not found');
      return null;
    }
    
    const userData = userDoc.data();
    const currentHistory = userData.missionHistory || [];
    
    console.log('\n📊 Current mission history:');
    console.log('   Length:', currentHistory.length);
    console.log('   Data:', currentHistory);
    
    // Create a test mission result
    const testMissionResult = {
      missionId: `test-mission-${Date.now()}`,
      title: 'Test Mission',
      score: 85,
      maxScore: 100,
      flagsFound: 5,
      totalQuestions: 6,
      correctAnswers: 5,
      accuracy: 83,
      evidence: ['Test evidence 1', 'Test evidence 2'],
      completedAt: new Date().toISOString(),
      department: 'email-crimes',
      difficulty: 'beginner',
      estimatedTime: 15
    };
    
    console.log('\n📝 Test mission result:');
    console.log(testMissionResult);
    
    // Test 1: Try arrayUnion
    console.log('\n🔧 Test 1: Using arrayUnion...');
    try {
      await updateDoc(userRef, {
        missionHistory: arrayUnion(testMissionResult)
      });
      console.log('✅ arrayUnion update successful');
    } catch (error) {
      console.log('❌ arrayUnion update failed:', error.message);
    }
    
    // Check if it was added
    const updatedDoc1 = await getDoc(userRef);
    const updatedData1 = updatedDoc1.data();
    const newHistory1 = updatedData1.missionHistory || [];
    
    console.log('   History length after arrayUnion:', newHistory1.length);
    console.log('   New history:', newHistory1);
    
    // Test 2: Try direct array update
    console.log('\n🔧 Test 2: Using direct array update...');
    try {
      const updatedHistory = [...newHistory1, testMissionResult];
      await updateDoc(userRef, {
        missionHistory: updatedHistory
      });
      console.log('✅ Direct array update successful');
    } catch (error) {
      console.log('❌ Direct array update failed:', error.message);
    }
    
    // Check final result
    const finalDoc = await getDoc(userRef);
    const finalData = finalDoc.data();
    const finalHistory = finalData.missionHistory || [];
    
    console.log('\n📊 Final mission history:');
    console.log('   Length:', finalHistory.length);
    console.log('   Data:', finalHistory);
    
    return {
      initialLength: currentHistory.length,
      finalLength: finalHistory.length,
      success: finalHistory.length > currentHistory.length
    };
    
  } catch (error) {
    console.error('❌ Direct mission history test failed:', error);
    return null;
  }
};

// Test mission result structure
export const testMissionResultStructure = () => {
  console.log('🧪 Testing mission result structure...');
  
  const testMissionResult = {
    missionId: 'test-structure',
    title: 'Test Mission',
    score: 85,
    maxScore: 100,
    flagsFound: 5,
    totalQuestions: 6,
    correctAnswers: 5,
    accuracy: 83,
    evidence: ['Test evidence'],
    completedAt: new Date().toISOString(),
    department: 'email-crimes',
    difficulty: 'beginner',
    estimatedTime: 15
  };
  
  console.log('\n📝 Mission result structure:');
  Object.entries(testMissionResult).forEach(([key, value]) => {
    console.log(`   ${key}: ${value} (${typeof value})`);
  });
  
  // Check for problematic fields
  const problematicFields = [];
  Object.entries(testMissionResult).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      problematicFields.push(key);
    }
  });
  
  if (problematicFields.length > 0) {
    console.log('\n⚠️  Problematic fields:', problematicFields);
  } else {
    console.log('\n✅ No problematic fields found');
  }
  
  return testMissionResult;
};

// Test Firestore array operations
export const testFirestoreArrayOperations = async () => {
  console.log('🧪 Testing Firestore array operations...');
  
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    const userRef = doc(firestore, 'users', userId);
    
    // Test simple array operations
    const testArray = ['item1', 'item2', 'item3'];
    
    console.log('\n🔧 Testing simple array operations...');
    
    // Test 1: Set array
    try {
      await updateDoc(userRef, {
        testArray: testArray
      });
      console.log('✅ Set array successful');
    } catch (error) {
      console.log('❌ Set array failed:', error.message);
    }
    
    // Test 2: arrayUnion with simple values
    try {
      await updateDoc(userRef, {
        testArray: arrayUnion('item4', 'item5')
      });
      console.log('✅ arrayUnion with simple values successful');
    } catch (error) {
      console.log('❌ arrayUnion with simple values failed:', error.message);
    }
    
    // Check result
    const updatedDoc = await getDoc(userRef);
    const updatedData = updatedDoc.data();
    console.log('   Final test array:', updatedData.testArray);
    
    return updatedData.testArray;
    
  } catch (error) {
    console.error('❌ Firestore array operations test failed:', error);
    return null;
  }
};

// Test complete mission history debugging
export const testCompleteMissionHistoryDebugging = async () => {
  console.log('🧪 Testing complete mission history debugging...');
  
  try {
    const results = {
      structure: testMissionResultStructure(),
      arrayOperations: await testFirestoreArrayOperations(),
      directUpdate: await testDirectMissionHistoryUpdate()
    };
    
    console.log('\n🎉 All mission history debugging tests completed!');
    
    return results;
    
  } catch (error) {
    console.error('❌ Complete mission history debugging failed:', error);
    return null;
  }
};

// Run all mission history debugging tests
export const runAllMissionHistoryDebuggingTests = async () => {
  console.log('🚀 Starting all mission history debugging tests...');
  console.log('==========================================');
  
  const results = await testCompleteMissionHistoryDebugging();
  
  console.log('==========================================');
  console.log('📊 Mission History Debugging Test Results Summary:');
  console.log(results);
  
  if (results) {
    console.log('✅ Mission history debugging tests completed successfully!');
  } else {
    console.log('❌ Mission history debugging tests failed');
  }
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testMissionHistory = {
    testDirectMissionHistoryUpdate,
    testMissionResultStructure,
    testFirestoreArrayOperations,
    testCompleteMissionHistoryDebugging,
    runAllMissionHistoryDebuggingTests
  };
  
  console.log('🧪 Mission history debugging test functions loaded. Use window.testMissionHistory.runAllMissionHistoryDebuggingTests() to run all tests.');
}

// Export all test functions
export default {
  testDirectMissionHistoryUpdate,
  testMissionResultStructure,
  testFirestoreArrayOperations,
  testCompleteMissionHistoryDebugging,
  runAllMissionHistoryDebuggingTests
}; 