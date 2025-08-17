// Simple test script to verify user authentication status
// Run this function in browser console to check if user is logged in

import { auth } from '../firebase';

// Test user authentication status
export const testAuthStatus = () => {
  console.log('🧪 Testing user authentication status...');
  
  try {
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      console.log('✅ User is authenticated!');
      console.log('   User ID:', currentUser.uid);
      console.log('   Email:', currentUser.email);
      console.log('   Display Name:', currentUser.displayName);
      console.log('   Email Verified:', currentUser.emailVerified);
      
      return {
        authenticated: true,
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName
      };
    } else {
      console.log('❌ No user is currently authenticated');
      console.log('   Please log in first to run mission tests');
      
      return {
        authenticated: false,
        uid: null,
        email: null,
        displayName: null
      };
    }
    
  } catch (error) {
    console.error('❌ Error checking authentication status:', error);
    return {
      authenticated: false,
      error: error.message
    };
  }
};

// Test Firebase auth state
export const testFirebaseAuth = () => {
  console.log('🧪 Testing Firebase authentication...');
  
  try {
    console.log('   Auth object:', auth);
    console.log('   Current user:', auth.currentUser);
    console.log('   Auth state:', auth.authStateReady ? 'Ready' : 'Not ready');
    
    return {
      authObject: auth,
      currentUser: auth.currentUser,
      authStateReady: auth.authStateReady
    };
    
  } catch (error) {
    console.error('❌ Error testing Firebase auth:', error);
    return {
      error: error.message
    };
  }
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testAuth = {
    testAuthStatus,
    testFirebaseAuth
  };
  
  console.log('🧪 Auth test functions loaded. Use window.testAuth.testAuthStatus() to check authentication.');
}

// Export all test functions
export default {
  testAuthStatus,
  testFirebaseAuth
}; 