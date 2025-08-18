// Test script for verifying clues and quizzes mapping in all missions
// Run these functions in browser console to test the mapping

import { missions } from './test/missions';

// Test clues and quizzes mapping for all missions
export const testAllMissionsMapping = () => {
  console.log('🧪 Testing clues and quizzes mapping for all missions...');
  
  const emailMissions = [
    'know-the-lingo',
    'spot-red-flags',
    'email-imposter',
    'spear-phishing',
    'fake-account',
    'wire-transfer',
    'perfect-impersonation'
  ];
  
  const results = {};
  
  emailMissions.forEach(missionId => {
    const mission = missions[missionId];
    if (mission && mission.content.type === 'email') {
      console.log(`\n📧 ${mission.title}:`);
      
      const clues = mission.content.clues || {};
      const quizzes = mission.content.quizzes || {};
      
      const clueKeys = Object.keys(clues);
      const quizKeys = Object.keys(quizzes);
      
      console.log(`   Clues (${clueKeys.length}): ${clueKeys.join(', ')}`);
      console.log(`   Quizzes (${quizKeys.length}): ${quizKeys.join(', ')}`);
      
      // Check if all clues have corresponding quizzes
      const missingQuizzes = clueKeys.filter(clueKey => !quizzes[clueKey]);
      const extraQuizzes = quizKeys.filter(quizKey => !clues[quizKey]);
      
      if (missingQuizzes.length > 0) {
        console.log(`   ❌ Missing Quizzes: ${missingQuizzes.join(', ')}`);
      }
      
      if (extraQuizzes.length > 0) {
        console.log(`   ⚠️  Extra Quizzes: ${extraQuizzes.join(', ')}`);
      }
      
      if (missingQuizzes.length === 0 && extraQuizzes.length === 0) {
        console.log(`   ✅ Perfect Match! All clues have corresponding quizzes.`);
      }
      
      // Check individual clue-quiz pairs
      clueKeys.forEach(clueKey => {
        const clue = clues[clueKey];
        const quiz = quizzes[clueKey];
        
        if (quiz) {
          console.log(`     ${clueKey}: ✅ Has quiz - ${quiz.text.substring(0, 40)}...`);
        } else {
          console.log(`     ${clueKey}: ❌ Missing quiz`);
        }
      });
      
      results[missionId] = {
        clues: clueKeys,
        quizzes: quizKeys,
        missingQuizzes,
        extraQuizzes,
        isPerfectMatch: missingQuizzes.length === 0 && extraQuizzes.length === 0
      };
    }
  });
  
  return results;
};

// Test specific mission mapping
export const testMissionMapping = (missionId) => {
  console.log(`🧪 Testing mapping for mission: ${missionId}`);
  
  const mission = missions[missionId];
  if (!mission) {
    console.log(`❌ Mission ${missionId} not found`);
    return null;
  }
  
  if (mission.content.type !== 'email') {
    console.log(`❌ Mission ${missionId} is not an email type mission`);
    return null;
  }
  
  const clues = mission.content.clues || {};
  const quizzes = mission.content.quizzes || {};
  
  console.log(`\n📋 ${mission.title}:`);
  console.log(`   Difficulty: ${mission.difficulty}`);
  console.log(`   Estimated Time: ${mission.estimatedTime} minutes`);
  
  console.log(`\n🔍 Clues Analysis:`);
  Object.entries(clues).forEach(([clueKey, clue]) => {
    const hasQuiz = !!quizzes[clueKey];
    const status = hasQuiz ? '✅' : '❌';
    
    console.log(`   ${status} ${clueKey}:`);
    console.log(`     Title: ${clue.title}`);
    console.log(`     Red Flag: ${clue.redFlag}`);
    console.log(`     Has Quiz: ${hasQuiz ? 'Yes' : 'No'}`);
    
    if (hasQuiz) {
      const quiz = quizzes[clueKey];
      console.log(`     Quiz: ${quiz.text.substring(0, 50)}...`);
    }
  });
  
  console.log(`\n📝 Quizzes Analysis:`);
  Object.entries(quizzes).forEach(([quizKey, quiz]) => {
    const hasClue = !!clues[quizKey];
    const status = hasClue ? '✅' : '❌';
    
    console.log(`   ${status} ${quizKey}:`);
    console.log(`     Text: ${quiz.text.substring(0, 50)}...`);
    console.log(`     Has Clue: ${hasClue ? 'Yes' : 'No'}`);
    
    if (hasClue) {
      const clue = clues[quizKey];
      console.log(`     Clue: ${clue.title}`);
    }
  });
  
  // Calculate mapping statistics
  const totalClues = Object.keys(clues).length;
  const totalQuizzes = Object.keys(quizzes).length;
  const matchedPairs = Object.keys(clues).filter(clueKey => quizzes[clueKey]).length;
  const unmappedClues = Object.keys(clues).filter(clueKey => !quizzes[clueKey]);
  const unmappedQuizzes = Object.keys(quizzes).filter(quizKey => !clues[quizKey]);
  
  console.log(`\n📊 Mapping Statistics:`);
  console.log(`   Total Clues: ${totalClues}`);
  console.log(`   Total Quizzes: ${totalQuizzes}`);
  console.log(`   Matched Pairs: ${matchedPairs}`);
  console.log(`   Unmapped Clues: ${unmappedClues.length > 0 ? unmappedClues.join(', ') : 'None'}`);
  console.log(`   Unmapped Quizzes: ${unmappedQuizzes.length > 0 ? unmappedQuizzes.join(', ') : 'None'}`);
  
  const mappingScore = totalClues > 0 ? (matchedPairs / totalClues) * 100 : 0;
  console.log(`   Mapping Score: ${mappingScore.toFixed(1)}%`);
  
  return {
    missionId,
    clues: Object.keys(clues),
    quizzes: Object.keys(quizzes),
    matchedPairs,
    unmappedClues,
    unmappedQuizzes,
    mappingScore
  };
};

// Test hotspot functionality simulation
export const testHotspotFunctionality = () => {
  console.log('🧪 Testing hotspot functionality simulation...');
  
  const testMission = missions['spot-red-flags'];
  if (!testMission) {
    console.log('❌ Test mission not found');
    return null;
  }
  
  console.log(`\n🔍 Simulating hotspot clicks for ${testMission.title}:`);
  
  // Simulate the clue mapping from EmailCrimeInvestigation
  const clueMapping = {
    from: 'fakeDomain',
    subject: 'excessiveUrgency',
    replyTo: 'replyMismatch',
    body: 'suspiciousLink'
  };
  
  const simulationResults = [];
  
  Object.entries(clueMapping).forEach(([emailElement, clueKey]) => {
    const clue = testMission.content.clues[clueKey];
    const quiz = testMission.content.quizzes[clueKey];
    
    if (clue && quiz) {
      simulationResults.push({
        emailElement,
        clueKey,
        status: '✅ Perfect Match',
        clueTitle: clue.title,
        quizText: quiz.text.substring(0, 40) + '...'
      });
      
      console.log(`   ✅ ${emailElement} → ${clueKey}:`);
      console.log(`      Clue: ${clue.title}`);
      console.log(`      Quiz: ${quiz.text.substring(0, 50)}...`);
    } else if (clue && !quiz) {
      simulationResults.push({
        emailElement,
        clueKey,
        status: '❌ Missing Quiz',
        clueTitle: clue.title,
        quizText: 'No quiz found'
      });
      
      console.log(`   ❌ ${emailElement} → ${clueKey}:`);
      console.log(`      Clue: ${clue.title}`);
      console.log(`      Quiz: Missing!`);
    } else if (!clue && quiz) {
      simulationResults.push({
        emailElement,
        clueKey,
        status: '❌ Missing Clue',
        clueTitle: 'No clue found',
        quizText: quiz.text.substring(0, 40) + '...'
      });
      
      console.log(`   ❌ ${emailElement} → ${clueKey}:`);
      console.log(`      Clue: Missing!`);
      console.log(`      Quiz: ${quiz.text.substring(0, 50)}...`);
    } else {
      simulationResults.push({
        emailElement,
        clueKey,
        status: '❌ Both Missing',
        clueTitle: 'No clue found',
        quizText: 'No quiz found'
      });
      
      console.log(`   ❌ ${emailElement} → ${clueKey}:`);
      console.log(`      Clue: Missing!`);
      console.log(`      Quiz: Missing!`);
    }
  });
  
  // Summary
  const perfectMatches = simulationResults.filter(r => r.status === '✅ Perfect Match').length;
  const totalElements = simulationResults.length;
  
  console.log(`\n📊 Hotspot Simulation Summary:`);
  console.log(`   Total Elements: ${totalElements}`);
  console.log(`   Perfect Matches: ${perfectMatches}`);
  console.log(`   Issues Found: ${totalElements - perfectMatches}`);
  
  if (perfectMatches === totalElements) {
    console.log(`   🎉 All hotspots should work perfectly!`);
  } else {
    console.log(`   ⚠️  Some hotspots may not trigger quizzes properly.`);
  }
  
  return simulationResults;
};

// Run all mapping tests
export const runAllMappingTests = async () => {
  console.log('🚀 Starting all clues and quizzes mapping tests...');
  console.log('================================================');
  
  const results = {
    allMissionsMapping: testAllMissionsMapping(),
    spotRedFlagsMapping: testMissionMapping('spot-red-flags'),
    emailImposterMapping: testMissionMapping('email-imposter'),
    spearPhishingMapping: testMissionMapping('spear-phishing'),
    fakeAccountMapping: testMissionMapping('fake-account'),
    wireTransferMapping: testMissionMapping('wire-transfer'),
    perfectImpersonationMapping: testMissionMapping('perfect-impersonation'),
    hotspotFunctionality: testHotspotFunctionality()
  };
  
  console.log('================================================');
  console.log('📊 Mapping Test Results Summary:');
  console.log(results);
  
  // Calculate overall success rate
  const emailMissions = ['spot-red-flags', 'email-imposter', 'spear-phishing', 'fake-account', 'wire-transfer', 'perfect-impersonation'];
  const successCount = emailMissions.filter(missionId => {
    const result = results[`${missionId.replace(/-/g, '')}Mapping`];
    return result && result.mappingScore === 100;
  }).length;
  
  console.log(`\n🎯 Overall Success Rate: ${successCount}/${emailMissions.length} missions have perfect mapping`);
  
  if (successCount === emailMissions.length) {
    console.log('🎉 All missions have perfect clues and quizzes mapping!');
  } else {
    console.log('⚠️  Some missions need mapping fixes.');
  }
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testCluesQuizzesMapping = {
    testAllMissionsMapping,
    testMissionMapping,
    testHotspotFunctionality,
    runAllMappingTests
  };
  
  console.log('🧪 Clues and Quizzes mapping test functions loaded. Use window.testCluesQuizzesMapping.runAllMappingTests() to run all tests.');
}

// Export all test functions
export default {
  testAllMissionsMapping,
  testMissionMapping,
  testHotspotFunctionality,
  runAllMappingTests
}; 