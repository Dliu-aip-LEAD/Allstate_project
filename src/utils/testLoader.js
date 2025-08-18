// Test Loader for Browser Environment
// This file loads all test functions into the global window object

// Load test functions when this file is imported
console.log('🧪 Loading test functions...');

// Import and load all test functions
import('./testDepartmentUnlock.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testDepartmentUnlock = module.default;
    console.log('✅ testDepartmentUnlock loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testDepartmentUnlock:', error);
});

import('./testEmailCrimesMissions.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testEmailCrimes = module.default;
    console.log('✅ testEmailCrimes loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testEmailCrimes:', error);
});

import('./testEmailCrimeUnitPage.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testEmailCrimeUnitPage = module.default;
    console.log('✅ testEmailCrimeUnitPage loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testEmailCrimeUnitPage:', error);
});

import('./testMissionIntroduction.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testMissionIntroduction = module.default;
    console.log('✅ testMissionIntroduction loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testMissionIntroduction:', error);
});

import('./testEmailCrimeInvestigation.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testEmailCrimeInvestigation = module.default;
    console.log('✅ testEmailCrimeInvestigation loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testEmailCrimeInvestigation:', error);
});

import('./testEmailCrimeInvestigationFix.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testEmailCrimeInvestigationFix = module.default;
    console.log('✅ testEmailCrimeInvestigationFix loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testEmailCrimeInvestigationFix:', error);
});

// Load simple test
import('./simpleTest.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.simpleTest = module.default;
    console.log('✅ simpleTest loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load simpleTest:', error);
});

// Load mission completion test
import('./testMissionCompletion.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testMissionCompletion = module.default;
    console.log('✅ testMissionCompletion loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testMissionCompletion:', error);
});

// Load database update test
import('./testDatabaseUpdate.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testDatabaseUpdate = module.default;
    console.log('✅ testDatabaseUpdate loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testDatabaseUpdate:', error);
});

// Load mission service test
import('./testMissionService.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testMissionService = module.default;
    console.log('✅ testMissionService loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testMissionService:', error);
});

// Load mission unlock debug test
import('./testMissionUnlockDebug.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testMissionUnlockDebug = module.default;
    console.log('✅ testMissionUnlockDebug loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testMissionUnlockDebug:', error);
});

// Load mission logic test
import('./testMissionLogic.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testMissionLogic = module.default;
    console.log('✅ testMissionLogic loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testMissionLogic:', error);
});

// Load auth test
import('./testAuth.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testAuth = module.default;
    console.log('✅ testAuth loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testAuth:', error);
});

// Load mission history debugging test
import('./testMissionHistory.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testMissionHistory = module.default;
    console.log('✅ testMissionHistory loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testMissionHistory:', error);
});

// Load real-time updates test
import('./testRealTimeUpdates.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testRealTimeUpdates = module.default;
    console.log('✅ testRealTimeUpdates loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testRealTimeUpdates:', error);
});

// Load Home page test
import('./testHomePageData.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testHomePage = module.default;
    console.log('✅ testHomePage loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testHomePage:', error);
});

// Load Play page test
import('./testPlayPageData.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testPlayPage = module.default;
    console.log('✅ testPlayPage loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testPlayPage:', error);
});

// Load EmailCrimeUnit real-time test
import('./testEmailCrimeUnitRealTime.js').then(module => {
  if (module.default && typeof window !== 'undefined') {
    window.testEmailCrimeUnitRealTime = module.default;
    console.log('✅ testEmailCrimeUnitRealTime loaded');
  }
}).catch(error => {
  console.warn('⚠️ Could not load testEmailCrimeUnitRealTime:', error);
});

// Alternative: Load test functions directly if dynamic imports fail
if (typeof window !== 'undefined') {
  // Create a simple test loader function
  window.loadAllTests = async () => {
    console.log('🚀 Loading all test functions...');
    
    try {
      // Load each test module
      const modules = await Promise.all([
        import('./testDepartmentUnlock.js'),
        import('./testEmailCrimesMissions.js'),
        import('./testEmailCrimeUnitPage.js'),
        import('./testMissionIntroduction.js'),
        import('./testEmailCrimeInvestigation.js'),
        import('./testEmailCrimeInvestigationFix.js'),
        import('./simpleTest.js'),
        import('./testMissionCompletion.js'),
        import('./testDatabaseUpdate.js'),
        import('./testMissionService.js'),
        import('./testMissionLogic.js'),
        import('./testAuth.js'),
        import('./testMissionServiceFix.js'),
        import('./testMissionHistory.js'),
        import('./testRealTimeUpdates.js'),
        import('./testHomePageData.js'),
        import('./testPlayPageData.js'),
        import('./testMissionUnlockDebug.js'),
        import('./testEmailCrimeUnitRealTime.js')
      ]);
      
      // Assign to window object
      if (modules[0]?.default) window.testDepartmentUnlock = modules[0].default;
      if (modules[1]?.default) window.testEmailCrimes = modules[1].default;
      if (modules[2]?.default) window.testEmailCrimeUnitPage = modules[2].default;
      if (modules[3]?.default) window.testMissionIntroduction = modules[3].default;
      if (modules[4]?.default) window.testEmailCrimeInvestigation = modules[4].default;
      if (modules[5]?.default) window.testEmailCrimeInvestigationFix = modules[5].default;
      if (modules[6]?.default) window.simpleTest = modules[6].default;
      if (modules[7]?.default) window.testMissionCompletion = modules[7].default;
      if (modules[8]?.default) window.testDatabaseUpdate = modules[8].default;
      if (modules[9]?.default) window.testMissionService = modules[9].default;
      if (modules[10]?.default) window.testMissionLogic = modules[10].default;
      if (modules[11]?.default) window.testAuth = modules[11].default;
      if (modules[12]?.default) window.testMissionServiceFix = modules[12].default;
      if (modules[13]?.default) window.testMissionHistory = modules[13].default;
      if (modules[14]?.default) window.testRealTimeUpdates = modules[14].default;
      if (modules[15]?.default) window.testHomePage = modules[15].default;
      if (modules[16]?.default) window.testPlayPage = modules[16].default;
      if (modules[17]?.default) window.testMissionUnlockDebug = modules[17].default;
      if (modules[18]?.default) window.testEmailCrimeUnitRealTime = modules[18].default;
      
      console.log('✅ All test functions loaded successfully!');
      console.log('Available test functions:');
      console.log('- window.testDepartmentUnlock');
      console.log('- window.testEmailCrimes');
      console.log('- window.testEmailCrimeUnitPage');
      console.log('- window.testMissionIntroduction');
      console.log('- window.testEmailCrimeInvestigation');
      console.log('- window.testEmailCrimeInvestigationFix');
      console.log('- window.testAuth');
      console.log('- window.testMissionServiceFix');
      console.log('- window.testMissionHistory');
      console.log('- window.testRealTimeUpdates');
      console.log('- window.testHomePage');
      console.log('- window.testPlayPage');
      console.log('- window.testMissionUnlockDebug');
      console.log('- window.testEmailCrimeUnitRealTime');
      
    } catch (error) {
      console.error('❌ Error loading test functions:', error);
    }
  };
  
  console.log('🧪 Test loader ready. Use window.loadAllTests() to load all test functions.');
} 