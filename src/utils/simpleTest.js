// Simple test script to verify basic functionality
// This file tests the core imports without complex logic

import { missions, departments } from '../data/missions';

// Simple test function
export const simpleTest = () => {
  console.log('🧪 Running simple test...');
  
  try {
    // Test missions import
    console.log('✅ Missions imported successfully');
    console.log(`   Total missions: ${Object.keys(missions).length}`);
    
    // Test departments import
    console.log('✅ Departments imported successfully');
    console.log(`   Total departments: ${Object.keys(departments).length}`);
    
    // Test specific mission
    const testMission = missions['spot-red-flags'];
    if (testMission) {
      console.log('✅ Test mission found:', testMission.title);
    } else {
      console.log('❌ Test mission not found');
    }
    
    // Test specific department
    const testDepartment = departments['email-crimes'];
    if (testDepartment) {
      console.log('✅ Test department found:', testDepartment.name);
    } else {
      console.log('❌ Test department not found');
    }
    
    console.log('🎉 Simple test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Simple test failed:', error);
    return false;
  }
};

// Make available in browser console
if (typeof window !== 'undefined') {
  window.simpleTest = simpleTest;
  console.log('🧪 Simple test function loaded. Use window.simpleTest() to run.');
}

export default simpleTest; 