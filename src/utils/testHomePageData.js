// Test script for Home page data fetching and display
// Run these functions in browser console to debug Home page issues

import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

// Test Home page data fetching
export const testHomePageDataFetching = async () => {
  console.log('🧪 Testing Home page data fetching...');
  
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
    
    // Check if data matches what Home page expects
    const expectedFields = [
      'level', 'levelName', 'experience', 'totalScore', 
      'missionsCompleted', 'successRate', 'currentMissionId'
    ];
    
    const missingFields = expectedFields.filter(field => 
      detectiveAcademy[field] === undefined || detectiveAcademy[field] === null
    );
    
    if (missingFields.length > 0) {
      console.log('\n⚠️  Missing or null fields:', missingFields);
    } else {
      console.log('\n✅ All expected fields are present');
    }
    
    // Check data types
    console.log('\n🔍 Data type analysis:');
    Object.entries(detectiveAcademy).forEach(([key, value]) => {
      console.log(`   ${key}: ${value} (${typeof value})`);
    });
    
    return {
      userId,
      userData,
      detectiveAcademy,
      missingFields,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Home page data fetching test failed:', error);
    return null;
  }
};

// Test Home page state management
export const testHomePageStateManagement = () => {
  console.log('🧪 Testing Home page state management...');
  
  try {
    // Check if we can access the Home component's state
    const homeElement = document.querySelector('[data-testid="home-page"]') || 
                       document.querySelector('.home-page') ||
                       document.querySelector('main');
    
    if (homeElement) {
      console.log('✅ Home page element found:', homeElement);
      
      // Look for detective academy data in the DOM
      const levelElement = document.querySelector('[data-testid="detective-level"]') ||
                          document.querySelector('.text-2xl.font-bold');
      
      const experienceElement = document.querySelector('[data-testid="detective-experience"]') ||
                               document.querySelector('.bg-white\\/20.text-white');
      
      if (levelElement) {
        console.log('✅ Level element found:', levelElement.textContent);
      } else {
        console.log('❌ Level element not found');
      }
      
      if (experienceElement) {
        console.log('✅ Experience element found:', experienceElement.textContent);
      } else {
        console.log('❌ Experience element not found');
      }
      
    } else {
      console.log('❌ Home page element not found');
    }
    
    // Check localStorage for user info
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      console.log('📱 LocalStorage userInfo:', JSON.parse(userInfo));
    } else {
      console.log('📱 No userInfo in localStorage');
    }
    
    return {
      homeElementFound: !!homeElement,
      userInfoInStorage: !!userInfo,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Home page state management test failed:', error);
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

// Test complete Home page functionality
export const testCompleteHomePageFunctionality = async () => {
  console.log('🧪 Testing complete Home page functionality...');
  
  try {
    const results = {
      authState: testFirebaseAuthState(),
      dataFetching: await testHomePageDataFetching(),
      stateManagement: testHomePageStateManagement()
    };
    
    console.log('\n🎉 All Home page functionality tests completed!');
    
    return results;
    
  } catch (error) {
    console.error('❌ Complete Home page functionality test failed:', error);
    return null;
  }
};

// Run all Home page tests
export const runAllHomePageTests = async () => {
  console.log('🚀 Starting all Home page functionality tests...');
  console.log('==========================================');
  
  const results = await testCompleteHomePageFunctionality();
  
  console.log('==========================================');
  console.log('📊 Home Page Functionality Test Results Summary:');
  console.log(results);
  
  if (results) {
    console.log('✅ Home page functionality tests completed successfully!');
    
    // Provide debugging suggestions
    if (results.authState?.authenticated) {
      console.log('\n💡 User is authenticated. Check if:');
      console.log('   1. Real-time listener is working');
      console.log('   2. User document exists in Firestore');
      console.log('   3. Detective academy data is present');
    } else {
      console.log('\n💡 User is not authenticated. Please log in first.');
    }
  } else {
    console.log('❌ Home page functionality tests failed');
  }
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testHomePage = {
    testHomePageDataFetching,
    testHomePageStateManagement,
    testFirebaseAuthState,
    testCompleteHomePageFunctionality,
    runAllHomePageTests
  };
  
  console.log('🧪 Home page test functions loaded. Use window.testHomePage.runAllHomePageTests() to run all tests.');
}

// Export all test functions
export default {
  testHomePageDataFetching,
  testHomePageStateManagement,
  testFirebaseAuthState,
  testCompleteHomePageFunctionality,
  runAllHomePageTests
}; 