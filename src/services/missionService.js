// Mission Service - Backend service for handling mission completion and database updates
// This service handles all database operations related to mission completion
// Can be reused across different mission investigation pages

import { 
  doc, 
  getDoc, 
  updateDoc, 
  increment,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { firestore } from '../firebase';

// Mission completion result structure
export const createMissionResult = (missionData, userPerformance) => {
  return {
    missionId: missionData.id,
    title: missionData.title,
    score: userPerformance.score,
    maxScore: missionData.scoring.maxScore,
    flagsFound: userPerformance.flagsFound || 0,
    totalQuestions: userPerformance.totalQuestions || 0,
    correctAnswers: userPerformance.correctAnswers || 0,
    accuracy: userPerformance.accuracy || 0,
    evidence: userPerformance.evidence || [],
    completedAt: new Date().toISOString(), // Use ISO string instead of serverTimestamp
    department: missionData.department,
    difficulty: missionData.difficulty,
    estimatedTime: missionData.estimatedTime
  };
};

// Calculate experience points based on mission performance
export const calculateExperiencePoints = (missionData, userPerformance) => {
  const baseExp = 50;
  const scoreMultiplier = userPerformance.score / missionData.scoring.maxScore;
  const accuracyBonus = userPerformance.accuracy >= 80 ? 1.2 : 1.0;
  const difficultyMultiplier = getDifficultyMultiplier(missionData.difficulty);
  
  return Math.round(baseExp * scoreMultiplier * difficultyMultiplier);
};

// Get difficulty multiplier for experience calculation
const getDifficultyMultiplier = (difficulty) => {
  const multipliers = {
    'beginner': 1.0,
    'intermediate': 1.2,
    'advanced': 1.5,
    'expert': 2.0
  };
  return multipliers[difficulty] || 1.0;
};

// Calculate level progression
export const calculateLevelProgression = (currentLevel, currentExp, newExp) => {
  const totalExp = currentExp + newExp;
  const levelConfig = {
    1: { name: "Junior Detective", expRequired: 0, color: "text-blue-600" },
    2: { name: "Apprentice Detective", expRequired: 150, color: "text-green-600" },
    3: { name: "Mid-Level Detective", expRequired: 250, color: "text-yellow-600" },
    4: { name: "Senior Detective", expRequired: 500, color: "text-orange-600" },
    5: { name: "Expert Detective", expRequired: 800, color: "text-red-600" }
  };
  
  let newLevel = currentLevel;
  let levelName = levelConfig[currentLevel].name;
  let experienceToNextLevel = 0;
  
  // Check if user leveled up
  for (let level = 5; level >= 1; level--) {
    if (totalExp >= levelConfig[level].expRequired) {
      newLevel = level;
      levelName = levelConfig[level].name;
      if (level < 5) {
        experienceToNextLevel = levelConfig[level + 1].expRequired - totalExp;
      }
      break;
    }
  }
  
  return {
    level: newLevel,
    levelName,
    experience: totalExp,
    experienceToNextLevel,
    leveledUp: newLevel > currentLevel
  };
};

// Update user's detective academy progress
export const updateDetectiveAcademyProgress = async (userId, missionResult, experienceGained) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    
    // Get current user data
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }
    
    const userData = userDoc.data();
    const currentAcademy = userData.detectiveAcademy || {};
    const currentHistory = userData.missionHistory || [];
    
    // Check if mission already exists in history
    const existingMissionIndex = currentHistory.findIndex(mission => mission.missionId === missionResult.missionId);
    const isNewMission = existingMissionIndex === -1;
    
    console.log(`🔍 Mission ${missionResult.missionId}: ${isNewMission ? 'NEW' : 'REPEAT'}`);
    
    let updateData = {};
    let newMissionsCompleted = currentAcademy.missionsCompleted || 0;
    let newTotalScore = currentAcademy.totalScore || 0;
    let newExperience = currentAcademy.experience || 0;
    
    // Handle department progress updates
    const departmentKey = missionResult.department;
    const currentDeptProgress = currentAcademy.departmentProgress?.[departmentKey] || {
      progress: 0,
      missionsSolved: 0,
      totalMissions: 10,
      unlocked: true
    };
    
    if (isNewMission) {
      // New mission: increment counters
      newMissionsCompleted += 1;
      newTotalScore += missionResult.score;
      newExperience += experienceGained;
      
      // Update department progress for new mission
      const newDeptMissionsSolved = currentDeptProgress.missionsSolved + 1;
      const newDeptProgress = Math.round((newDeptMissionsSolved / currentDeptProgress.totalMissions) * 100);
      
      updateData = {
        'detectiveAcademy.missionsCompleted': newMissionsCompleted,
        'detectiveAcademy.totalScore': newTotalScore,
        'detectiveAcademy.experience': newExperience,
        [`detectiveAcademy.departmentProgress.${departmentKey}.missionsSolved`]: newDeptMissionsSolved,
        [`detectiveAcademy.departmentProgress.${departmentKey}.progress`]: newDeptProgress
      };
      
      console.log(`✅ New mission: +1 mission, +${missionResult.score} score, +${experienceGained} exp`);
      console.log(`   Department ${departmentKey}: ${newDeptMissionsSolved}/${currentDeptProgress.totalMissions} (${newDeptProgress}%)`);
      
    } else {
      // Repeat mission: check if score improved
      const existingMission = currentHistory[existingMissionIndex];
      const scoreImprovement = missionResult.score - existingMission.score;
      
      if (scoreImprovement > 0) {
        // Score improved: update total score and experience
        newTotalScore += scoreImprovement;
        newExperience += experienceGained;
        
        updateData = {
          'detectiveAcademy.totalScore': newTotalScore,
          'detectiveAcademy.experience': newExperience
        };
        
        console.log(`✅ Score improved: +${scoreImprovement} score, +${experienceGained} exp`);
        console.log(`   Old score: ${existingMission.score}, New score: ${missionResult.score}`);
      } else {
        // Score not improved: no updates needed
        console.log(`ℹ️ Score not improved: ${missionResult.score} <= ${existingMission.score}`);
        return {
          missionsCompleted: currentAcademy.missionsCompleted || 0,
          totalScore: currentAcademy.totalScore || 0,
          experience: currentAcademy.experience || 0,
          level: currentAcademy.level || 1,
          levelName: currentAcademy.levelName || 'Junior Detective',
          leveledUp: false,
          successRate: currentAcademy.successRate || 0,
          departmentProgress: {
            [departmentKey]: currentDeptProgress
          }
        };
      }
    }
    
    // Calculate level progression based on new experience
    const levelData = calculateLevelProgression(
      currentAcademy.level || 1,
      currentAcademy.experience || 0,
      isNewMission ? experienceGained : (newExperience - (currentAcademy.experience || 0))
    );
    
    // Add level updates to updateData
    updateData['detectiveAcademy.level'] = levelData.level;
    updateData['detectiveAcademy.levelName'] = levelData.levelName;
    updateData['detectiveAcademy.experienceToNextLevel'] = levelData.experienceToNextLevel;
    
    // Calculate new success rate
    const totalAccuracy = [...currentHistory, missionResult].reduce((sum, mission) => sum + mission.accuracy, 0);
    const newSuccessRate = Math.round(totalAccuracy / newMissionsCompleted);
    updateData['detectiveAcademy.successRate'] = newSuccessRate;
    
    // Update user document
    await updateDoc(userRef, updateData);
    
    console.log('✅ Detective Academy progress updated successfully');
    console.log(`   Level: ${currentAcademy.level || 1} → ${levelData.level}`);
    console.log(`   Experience: ${currentAcademy.experience || 0} → ${newExperience}`);
    console.log(`   Missions: ${currentAcademy.missionsCompleted || 0} → ${newMissionsCompleted}`);
    console.log(`   Total Score: ${currentAcademy.totalScore || 0} → ${newTotalScore}`);
    
    return {
      missionsCompleted: newMissionsCompleted,
      totalScore: newTotalScore,
      experience: newExperience,
      level: levelData.level,
      levelName: levelData.levelName,
      leveledUp: levelData.leveledUp,
      successRate: newSuccessRate,
      departmentProgress: {
        [departmentKey]: {
          progress: isNewMission ? Math.round(((currentDeptProgress.missionsSolved + 1) / currentDeptProgress.totalMissions) * 100) : currentDeptProgress.progress,
          missionsSolved: isNewMission ? currentDeptProgress.missionsSolved + 1 : currentDeptProgress.missionsSolved,
          totalMissions: currentDeptProgress.totalMissions,
          unlocked: currentDeptProgress.unlocked
        }
      }
    };
    
  } catch (error) {
    console.error('❌ Error updating detective academy progress:', error);
    throw error;
  }
};

// Add mission to user's mission history
export const addMissionToHistory = async (userId, missionResult) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    
    // Get current mission history
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }
    
    const currentHistory = userDoc.data().missionHistory || [];
    
    // Check if mission already exists
    const existingMissionIndex = currentHistory.findIndex(mission => mission.missionId === missionResult.missionId);
    
    if (existingMissionIndex === -1) {
      // New mission: add to history using direct array update
      const updatedHistory = [...currentHistory, missionResult];
      await updateDoc(userRef, {
        missionHistory: updatedHistory
      });
      
      console.log('✅ New mission added to history successfully');
      console.log('   History length:', updatedHistory.length);
      return true;
      
    } else {
      // Existing mission: replace with new result
      const updatedHistory = [...currentHistory];
      updatedHistory[existingMissionIndex] = missionResult;
      
      await updateDoc(userRef, {
        missionHistory: updatedHistory
      });
      
      console.log('✅ Existing mission result updated in history');
      console.log('   History length:', updatedHistory.length);
      return true;
    }
    
  } catch (error) {
    console.error('❌ Error updating mission history:', error);
    throw error;
  }
};

// Update user achievements based on mission completion
export const updateUserAchievements = async (userId, missionResult, userPerformance) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }
    
    const userData = userDoc.data();
    const currentAchievements = userData.achievements || [];
    const newAchievements = [];
    
    // Check for new achievements
    if (missionResult.accuracy === 100) {
      newAchievements.push({
        id: 'perfect-score',
        name: 'Perfect Score',
        description: 'Complete a mission with 100% accuracy',
        earnedAt: new Date().toISOString(), // Use ISO string instead of serverTimestamp
        missionId: missionResult.missionId
      });
    }
    
    if (missionResult.difficulty === 'expert' && missionResult.accuracy >= 80) {
      newAchievements.push({
        id: 'expert-detective',
        name: 'Expert Detective',
        description: 'Complete an expert mission with high accuracy',
        earnedAt: new Date().toISOString(), // Use ISO string instead of serverTimestamp
        missionId: missionResult.missionId
      });
    }
    
    if (userPerformance.flagsFound >= 5) {
      newAchievements.push({
        id: 'flag-finder',
        name: 'Flag Finder',
        description: 'Find 5 or more red flags in a single mission',
        earnedAt: new Date().toISOString(), // Use ISO string instead of serverTimestamp
        missionId: missionResult.missionId
      });
    }
    
    // Add new achievements if any
    if (newAchievements.length > 0) {
      await updateDoc(userRef, {
        achievements: arrayUnion(...newAchievements)
      });
      
      console.log('✅ New achievements earned:', newAchievements.length);
    }
    
    return newAchievements;
    
  } catch (error) {
    console.error('❌ Error updating achievements:', error);
    throw error;
  }
};

// Main function to handle complete mission completion
export const completeMission = async (userId, missionData, userPerformance) => {
  try {
    console.log('🚀 Starting mission completion process...');
    
    // Validate input
    if (!userId || !missionData || !userPerformance) {
      throw new Error('Missing required parameters for mission completion');
    }
    
    // Create mission result object
    const missionResult = createMissionResult(missionData, userPerformance);
    console.log('📝 Mission result created:', missionResult);
    
    // Calculate experience points
    const experienceGained = calculateExperiencePoints(missionData, userPerformance);
    console.log('⭐ Experience gained:', experienceGained);
    
    // Update all user data
    const progressUpdate = await updateDetectiveAcademyProgress(userId, missionResult, experienceGained);
    await addMissionToHistory(userId, missionResult);
    const newAchievements = await updateUserAchievements(userId, missionResult, userPerformance);
    
    console.log('🎉 Mission completion process finished successfully!');
    
    return {
      success: true,
      missionResult,
      progressUpdate,
      experienceGained,
      newAchievements,
      leveledUp: progressUpdate.leveledUp
    };
    
  } catch (error) {
    console.error('❌ Mission completion failed:', error);
    
    return {
      success: false,
      error: error.message,
      missionResult: null,
      progressUpdate: null,
      experienceGained: 0,
      newAchievements: [],
      leveledUp: false
    };
  }
};

// Get user's mission statistics
export const getUserMissionStats = async (userId) => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data();
    const academy = userData.detectiveAcademy || {};
    const history = userData.missionHistory || [];
    
    return {
      totalMissions: academy.missionsCompleted || 0,
      totalScore: academy.totalScore || 0,
      currentLevel: academy.level || 1,
      levelName: academy.levelName || 'Junior Detective',
      experience: academy.experience || 0,
      experienceToNextLevel: academy.experienceToNextLevel || 100,
      successRate: academy.successRate || 0,
      departmentProgress: academy.departmentProgress || {},
      recentMissions: history.slice(-5), // Last 5 missions
      achievements: userData.achievements || []
    };
    
  } catch (error) {
    console.error('❌ Error getting user mission stats:', error);
    return null;
  }
};

// Export all functions for use in frontend
export default {
  completeMission,
  createMissionResult,
  calculateExperiencePoints,
  updateDetectiveAcademyProgress,
  addMissionToHistory,
  updateUserAchievements,
  getUserMissionStats
}; 