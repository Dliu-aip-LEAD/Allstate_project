// Test script for Play page data fetching and display
// Run these functions in browser console to debug Play page issues

import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

// Test Play page data fetching
export const testPlayPageDataFetching = async () => {
  console.log('🧪 Testing Play page data fetching...');
  
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No authenticated user found. Please log in first.');
      return null;
    }
    
    const userId = currentUser.uid;
    console.log('👤 Testing with user ID:', userId);
    
    // Get user document directly
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('❌ User document not found');
      return null;
    }
    
    const userData = userDoc.data();
    console.log('\n📊 Full user document data:');
    console.log(userData);
    
    // Check detective academy data
    const detectiveAcademy = userData.detectiveAcademy || {};
    console.log('\n🔍 Detective Academy data:');
    console.log('   Level:', detectiveAcademy.level);
    console.log('   Level Name:', detectiveAcademy.levelName);
    console.log('   Experience:', detectiveAcademy.experience);
    console.log('   Total Score:', detectiveAcademy.totalScore);
    console.log('   Missions Completed:', detectiveAcademy.missionsCompleted);
    console.log('   Success Rate:', detectiveAcademy.successRate);
    console.log('   Current Mission ID:', detectiveAcademy.currentMissionId);
    
    // Check department progress
    const departmentProgress = detectiveAcademy.departmentProgress || {};
    console.log('\n🏢 Department Progress:');
    Object.entries(departmentProgress).forEach(([deptId, progress]) => {
      console.log(`   ${deptId}:`, progress);
    });
    
    // Check if data matches what Play page expects
    const expectedFields = [
      'level', 'levelName', 'experience', 'totalScore', 
      'missionsCompleted', 'successRate', 'currentMissionId', 'departmentProgress'
    ];
    
    const missingFields = expectedFields.filter(field => 
      detectiveAcademy[field] === undefined || detectiveAcademy[field] === null
    );
    
    if (missingFields.length > 0) {
      console.log('\n⚠️  Missing or null fields:', missingFields);
    } else {
      console.log('\n✅ All expected fields are present');
    }
    
    return {
      userId,
      userData,
      detectiveAcademy,
      departmentProgress,
      missingFields,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Play page data fetching test failed:', error);
    return null;
  }
};

// Test Play page state management
export const testPlayPageStateManagement = () => {
  console.log('🧪 Testing Play page state management...');
  
  try {
    // Check if we can access the Play component's state
    const playElement = document.querySelector('[data-testid="play-page"]') || 
                       document.querySelector('.play-page') ||
                       document.querySelector('main');
    
    if (playElement) {
      console.log('✅ Play page element found:', playElement);
      
      // Look for detective academy data in the DOM
      const welcomeElement = document.querySelector('[data-testid="welcome-message"]') ||
                            document.querySelector('.text-2xl.font-bold');
      
      const statsElement = document.querySelector('[data-testid="quick-stats"]') ||
                           document.querySelector('.grid.grid-cols-3');
      
      if (welcomeElement) {
        console.log('✅ Welcome message element found:', welcomeElement.textContent);
      } else {
        console.log('❌ Welcome message element not found');
      }
      
      if (statsElement) {
        console.log('✅ Quick stats element found:', statsElement.textContent);
      } else {
        console.log('❌ Quick stats element not found');
      }
      
      // Look for department cards
      const departmentCards = document.querySelectorAll('[data-testid="department-card"]') ||
                             document.querySelectorAll('.bg-gradient-to-br');
      
      console.log(`✅ Found ${departmentCards.length} department cards`);
      
    } else {
      console.log('❌ Play page element not found');
    }
    
    return {
      playElementFound: !!playElement,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Play page state management test failed:', error);
    return null;
  }
};

// Test department unlock logic
export const testDepartmentUnlockLogic = () => {
  console.log('🧪 Testing department unlock logic...');
  
  try {
    // Import departments and unlock logic
    import('../data/missions.js').then(module => {
      const { departments, isDepartmentUnlocked } = module;
      
      console.log('\n🏢 Available departments:');
      Object.keys(departments).forEach(deptId => {
        const dept = departments[deptId];
        console.log(`   ${deptId}: ${dept.name}`);
        console.log(`     Unlock requirements:`, dept.unlockRequirements);
      });
      
      // Test with mock user data
      const mockUserData = {
        level: 1,
        experience: 0,
        missionsCompleted: 0,
        departmentProgress: {}
      };
      
      console.log('\n🧪 Testing unlock logic with mock user data:');
      console.log('   Mock user:', mockUserData);
      
      Object.keys(departments).forEach(deptId => {
        const isUnlocked = isDepartmentUnlocked(mockUserData, deptId);
        console.log(`   ${deptId}: ${isUnlocked ? '✅ Unlocked' : '🔒 Locked'}`);
      });
      
    }).catch(error => {
      console.error('❌ Could not import missions module:', error);
    });
    
    return {
      success: true
    };
    
  } catch (error) {
    console.error('❌ Department unlock logic test failed:', error);
    return null;
  }
};

// Test Firebase Auth state
export const testFirebaseAuthState = () => {
  console.log('🧪 Testing Firebase Auth state...');
  
  try {
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      console.log('✅ User is authenticated:');
      console.log('   UID:', currentUser.uid);
      console.log('   Email:', currentUser.email);
      console.log('   Display Name:', currentUser.displayName);
      console.log('   Email Verified:', currentUser.emailVerified);
      
      return {
        authenticated: true,
        uid: currentUser.uid,
        email: currentUser.email,
        success: true
      };
    } else {
      console.log('❌ No user is currently authenticated');
      
      return {
        authenticated: false,
        success: true
      };
    }
    
  } catch (error) {
    console.error('❌ Firebase Auth state test failed:', error);
    return null;
  }
};

// Test complete Play page functionality
export const testCompletePlayPageFunctionality = async () => {
  console.log('🧪 Testing complete Play page functionality...');
  
  try {
    const results = {
      authState: testFirebaseAuthState(),
      dataFetching: await testPlayPageDataFetching(),
      stateManagement: testPlayPageStateManagement(),
      unlockLogic: testDepartmentUnlockLogic()
    };
    
    console.log('\n🎉 All Play page functionality tests completed!');
    
    return results;
    
  } catch (error) {
    console.error('❌ Complete Play page functionality test failed:', error);
    return null;
  }
};

// Run all Play page tests
export const runAllPlayPageTests = async () => {
  console.log('🚀 Starting all Play page functionality tests...');
  console.log('==========================================');
  
  const results = await testCompletePlayPageFunctionality();
  
  console.log('==========================================');
  console.log('📊 Play Page Functionality Test Results Summary:');
  console.log(results);
  
  if (results) {
    console.log('✅ Play page functionality tests completed successfully!');
    
    // Provide debugging suggestions
    if (results.authState?.authenticated) {
      console.log('\n💡 User is authenticated. Check if:');
      console.log('   1. Real-time listener is working');
      console.log('   2. User document exists in Firestore');
      console.log('   3. Detective academy data is present');
      console.log('   4. Department progress data is available');
    } else {
      console.log('\n💡 User is not authenticated. Please log in first.');
    }
  } else {
    console.log('❌ Play page functionality tests failed');
  }
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testPlayPage = {
    testPlayPageDataFetching,
    testPlayPageStateManagement,
    testDepartmentUnlockLogic,
    testFirebaseAuthState,
    testCompletePlayPageFunctionality,
    runAllPlayPageTests
  };
  
  console.log('🧪 Play page test functions loaded. Use window.testPlayPage.runAllPlayPageTests() to run all tests.');
}

// Export all test functions
export default {
  testPlayPageDataFetching,
  testPlayPageStateManagement,
  testDepartmentUnlockLogic,
  testFirebaseAuthState,
  testCompletePlayPageFunctionality,
  runAllPlayPageTests
}; 