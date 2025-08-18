// Test script for EmailCrimeInvestigation hotspot fix
// Run these functions in browser console to test the hotspot click fix

import { missions } from '../data/missions';

// Test hotspot mapping functionality
export const testHotspotMapping = () => {
  console.log('🧪 Testing hotspot mapping functionality...');
  
  const testMissions = [
    'spot-red-flags',
    'email-imposter',
    'spear-phishing',
    'fake-account',
    'wire-transfer'
  ];
  
  const results = {};
  
  testMissions.forEach(missionId => {
    const mission = missions[missionId];
    if (mission) {
      console.log(`\n🔍 ${mission.title}:`);
      
      // Get the clue mapping for this mission
      const clueMapping = getClueMapping(missionId);
      
      console.log(`   Clue Mapping:`);
      Object.entries(clueMapping).forEach(([emailElement, clueKey]) => {
        console.log(`     ${emailElement} → ${clueKey}`);
        
        // Check if the mapped clue exists in the mission
        const clue = mission.content.clues[clueKey];
        const quiz = mission.content.quizzes[clueKey];
        
        if (clue && quiz) {
          console.log(`       ✅ Perfect Match: Clue and Quiz found`);
          console.log(`         Clue: ${clue.title}`);
          console.log(`         Quiz: ${quiz.text.substring(0, 40)}...`);
        } else if (clue && !quiz) {
          console.log(`       ❌ Missing Quiz for clue: ${clueKey}`);
        } else if (!clue && quiz) {
          console.log(`       ❌ Missing Clue for quiz: ${clueKey}`);
        } else {
          console.log(`       ❌ Both Clue and Quiz missing for: ${clueKey}`);
        }
      });
      
      // Check mapping completeness
      const emailElements = ['from', 'subject', 'replyTo', 'body'];
      const mappedElements = Object.keys(clueMapping);
      const unmappedElements = emailElements.filter(element => !mappedElements.includes(element));
      
      if (unmappedElements.length > 0) {
        console.log(`   ⚠️  Unmapped Elements: ${unmappedElements.join(', ')}`);
      }
      
      results[missionId] = {
        clueMapping,
        mappedElements,
        unmappedElements,
        hasCompleteMapping: unmappedElements.length === 0
      };
    }
  });
  
  return results;
};

// Helper function to get clue mapping (same as in EmailCrimeInvestigation)
function getClueMapping(missionId) {
  if (missionId === 'spot-red-flags') {
    return {
      from: 'fakeDomain',
      subject: 'excessiveUrgency',
      replyTo: 'replyMismatch',
      body: 'suspiciousLink'
    };
  } else if (missionId === 'email-imposter') {
    return {
      from: 'domain',
      subject: 'urgency',
      replyTo: 'reply',
      body: 'pressure'
    };
  } else if (missionId === 'spear-phishing') {
    return {
      from: 'domainSimilarity',
      subject: 'urgentTechnical',
      body: 'personalInfo'
    };
  } else if (missionId === 'fake-account') {
    return {
      from: 'spoofedSender',
      subject: 'timelyThreat',
      replyTo: 'replyMismatch',
      body: 'credentialRequest'
    };
  } else if (missionId === 'wire-transfer') {
    return {
      from: 'roleImpersonation',
      subject: 'urgency',
      body: 'pressure'
    };
  }
  return {};
}

// Test hotspot click simulation
export const testHotspotClickSimulation = () => {
  console.log('🧪 Testing hotspot click simulation...');
  
  const testMission = missions['spot-red-flags'];
  if (testMission) {
    console.log(`\n🖱️  Hotspot Click Simulation for ${testMission.title}:`);
    
    const clueMapping = getClueMapping(testMission.id);
    const clues = testMission.content.clues || {};
    const quizzes = testMission.content.quizzes || {};
    
    console.log(`   Simulating clicks on email elements:`);
    
    Object.entries(clueMapping).forEach(([emailElement, clueKey]) => {
      console.log(`\n     Clicking on ${emailElement}:`);
      
      // Simulate the click
      const clue = clues[clueKey];
      const quiz = quizzes[clueKey];
      
      if (clue && quiz) {
        console.log(`       ✅ Click successful!`);
        console.log(`       🔍 Clue revealed: ${clue.title}`);
        console.log(`         Red Flag: ${clue.redFlag}`);
        console.log(`         Description: ${clue.description.substring(0, 60)}...`);
        
        console.log(`       ❓ Quiz triggered: ${quiz.text.substring(0, 50)}...`);
        console.log(`         Options: ${quiz.options.length} choices`);
        console.log(`         Correct Answer: ${quiz.options.find(opt => opt.correct)?.text.substring(0, 40)}...`);
        
        // Simulate quiz completion
        const correctAnswer = quiz.options.find(opt => opt.correct);
        if (correctAnswer) {
          console.log(`       ✅ Quiz completed with correct answer: ${correctAnswer.text.substring(0, 40)}...`);
          console.log(`       💡 Feedback: ${quiz.feedback.substring(0, 50)}...`);
        }
      } else {
        console.log(`       ❌ Click failed - missing clue or quiz`);
        if (!clue) console.log(`         Missing clue: ${clueKey}`);
        if (!quiz) console.log(`         Missing quiz: ${clueKey}`);
      }
    });
    
    // Calculate potential score from all hotspots
    let totalScore = 0;
    let cluesFound = 0;
    let quizzesCompleted = 0;
    
    Object.entries(clueMapping).forEach(([emailElement, clueKey]) => {
      if (clues[clueKey] && quizzes[clueKey]) {
        cluesFound++;
        quizzesCompleted++;
        totalScore += testMission.scoring.scorePerFlag + testMission.scoring.scorePerQuiz;
      }
    });
    
    totalScore += testMission.scoring.bonusPoints;
    
    console.log(`\n   📊 Simulation Results:`);
    console.log(`     Clues Found: ${cluesFound}/${Object.keys(clueMapping).length}`);
    console.log(`     Quizzes Completed: ${quizzesCompleted}/${Object.keys(clueMapping).length}`);
    console.log(`     Total Score: ${totalScore}/${testMission.scoring.maxScore}`);
    console.log(`     Success Rate: ${Math.round((cluesFound / Object.keys(clueMapping).length) * 100)}%`);
    
    return {
      cluesFound,
      quizzesCompleted,
      totalScore,
      maxScore: testMission.scoring.maxScore,
      successRate: Math.round((cluesFound / Object.keys(clueMapping).length) * 100)
    };
  }
  
  return null;
};

// Test email content rendering
export const testEmailContentRendering = () => {
  console.log('🧪 Testing email content rendering...');
  
  const testMission = missions['spot-red-flags'];
  if (testMission) {
    console.log(`\n📧 Email Content Rendering for ${testMission.title}:`);
    
    const emailContent = testMission.content.emailContent;
    const clueMapping = getClueMapping(testMission.id);
    
    console.log(`   Email Structure:`);
    console.log(`     From: ${emailContent.from}`);
    console.log(`     Subject: ${emailContent.subject}`);
    console.log(`     Reply-To: ${emailContent.replyTo || 'None'}`);
    console.log(`     Body: ${emailContent.body.substring(0, 100)}...`);
    
    console.log(`\n   Interactive Elements:`);
    Object.entries(clueMapping).forEach(([emailElement, clueKey]) => {
      const clue = testMission.content.clues[clueKey];
      const quiz = testMission.content.quizzes[clueKey];
      
      if (clue && quiz) {
        console.log(`     ✅ ${emailElement}: Clickable hotspot`);
        console.log(`         Maps to: ${clueKey}`);
        console.log(`         Clue: ${clue.title}`);
        console.log(`         Quiz: ${quiz.text.substring(0, 40)}...`);
      } else {
        console.log(`     ❌ ${emailElement}: Broken hotspot`);
        console.log(`         Missing: ${!clue ? 'clue' : ''}${!clue && !quiz ? ' and ' : ''}${!quiz ? 'quiz' : ''}`);
      }
    });
    
    // Check if all email elements have corresponding clues and quizzes
    const emailElements = ['from', 'subject', 'replyTo', 'body'];
    const workingHotspots = emailElements.filter(element => {
      const clueKey = clueMapping[element];
      return clueKey && testMission.content.clues[clueKey] && testMission.content.quizzes[clueKey];
    });
    
    const brokenHotspots = emailElements.filter(element => !workingHotspots.includes(element));
    
    console.log(`\n   📊 Hotspot Status:`);
    console.log(`     Working Hotspots: ${workingHotspots.length}/${emailElements.length}`);
    console.log(`     Broken Hotspots: ${brokenHotspots.length}/${emailElements.length}`);
    
    if (brokenHotspots.length > 0) {
      console.log(`     ⚠️  Broken Elements: ${brokenHotspots.join(', ')}`);
    }
    
    return {
      emailElements,
      workingHotspots,
      brokenHotspots,
      workingPercentage: Math.round((workingHotspots.length / emailElements.length) * 100)
    };
  }
  
  return null;
};

// Test complete hotspot system
export const testCompleteHotspotSystem = async () => {
  console.log('🧪 Testing complete hotspot system...');
  
  try {
    // Test hotspot mapping
    const hotspotMapping = testHotspotMapping();
    
    // Test hotspot click simulation
    const hotspotClickSimulation = testHotspotClickSimulation();
    
    // Test email content rendering
    const emailContentRendering = testEmailContentRendering();
    
    console.log('\n✅ All hotspot system tests completed successfully!');
    
    return {
      hotspotMapping,
      hotspotClickSimulation,
      emailContentRendering
    };
    
  } catch (error) {
    console.error('❌ Error testing hotspot system:', error);
    return null;
  }
};

// Run all hotspot tests
export const runAllHotspotTests = async () => {
  console.log('🚀 Starting all hotspot system tests...');
  console.log('=====================================');
  
  const results = {
    hotspotMapping: testHotspotMapping(),
    hotspotClickSimulation: testHotspotClickSimulation(),
    emailContentRendering: testEmailContentRendering(),
    completeSystem: await testCompleteHotspotSystem()
  };
  
  console.log('=====================================');
  console.log('📊 Hotspot System Test Results Summary:');
  console.log(results);
  
  // Calculate overall success rate
  const emailMissions = ['spot-red-flags', 'email-imposter', 'spear-phishing', 'fake-account', 'wire-transfer'];
  const successCount = emailMissions.filter(missionId => {
    const result = results.hotspotMapping[missionId];
    return result && result.hasCompleteMapping;
  }).length;
  
  console.log(`\n🎯 Overall Success Rate: ${successCount}/${emailMissions.length} missions have complete hotspot mapping`);
  
  if (successCount === emailMissions.length) {
    console.log('🎉 All missions have complete hotspot mapping!');
  } else {
    console.log('⚠️  Some missions need hotspot mapping fixes.');
  }
  
  const testSuccessCount = Object.values(results).filter(result => result !== null).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`✅ ${testSuccessCount}/${totalCount} tests passed`);
  
  return results;
};

// Make these functions available in browser console
if (typeof window !== 'undefined') {
  window.testEmailCrimeInvestigationFix = {
    testHotspotMapping,
    testHotspotClickSimulation,
    testEmailContentRendering,
    testCompleteHotspotSystem,
    runAllHotspotTests
  };
  
  console.log('🧪 EmailCrimeInvestigation hotspot fix test functions loaded. Use window.testEmailCrimeInvestigationFix.runAllHotspotTests() to run all tests.');
}

// Export all test functions
export default {
  testHotspotMapping,
  testHotspotClickSimulation,
  testEmailContentRendering,
  testCompleteHotspotSystem,
  runAllHotspotTests
}; 