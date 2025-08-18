import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy, limit, increment } from 'firebase/firestore';
import { firestore } from '../firebase';

// Default detective academy data structure
export const defaultDetectiveAcademy = {
  level: 1,
  levelName: "Junior Detective",
  experience: 0,
  experienceToNextLevel: 100,
  totalScore: 0,
  currentScore: 0,
  missionsCompleted: 0,
  totalMissions: 0,
  successRate: 0,
  currentMissionId: null,
  currentMissionProgress: 0,
  departmentProgress: {
    'email-crimes': {
      progress: 0,
      missionsSolved: 0,
      totalMissions: 7,
      unlocked: true
    },
    'social-media': {
      progress: 0,
      missionsSolved: 0,
      totalMissions: 7,
      unlocked: true
    },
    'financial-crimes': {
      progress: 0,
      missionsSolved: 0,
      totalMissions: 7,
      unlocked: true
    },
    'elder-fraud': {
      progress: 0,
      missionsSolved: 0,
      totalMissions: 7,
      unlocked: false
    }
  }
};

// Level configuration
export const levelConfig = {
  1: { name: "Junior Detective", expRequired: 0, color: "text-blue-600" },
  2: { name: "Apprentice Detective", expRequired: 150, color: "text-green-600" },
  3: { name: "Mid-Level Detective", expRequired: 250, color: "text-yellow-600" },
  4: { name: "Senior Detective", expRequired: 500, color: "text-orange-600" },
  5: { name: "Expert Detective", expRequired: 800, color: "text-red-600" }
};

// Get user progress data
export const getUserProgress = async (userId) => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // If user doesn't have detective academy data, initialize with default values
      if (!userData.detectiveAcademy) {
        await initializeUserProgress(userId, userData);
        return defaultDetectiveAcademy;
      }
      
      return userData.detectiveAcademy;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user progress:', error);
    return null;
  }
};

// Initialize user progress
export const initializeUserProgress = async (userId, userData) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      detectiveAcademy: defaultDetectiveAcademy,
      missionHistory: [],
      achievements: []
    });
  } catch (error) {
    console.error('Error initializing user progress:', error);
  }
};

// Update user progress
export const updateUserProgress = async (userId, updates) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    
    // Handle different types of updates
    if (updates.field && updates.value) {
      // Single field update
      await updateDoc(userRef, {
        [`detectiveAcademy.${updates.field}`]: updates.value
      });
    } else {
      // Multiple field updates (for mission completion)
      const updateData = {};
      
      if (updates.missionsCompleted !== undefined) {
        // Use increment for missions completed
        updateData['detectiveAcademy.missionsCompleted'] = increment(updates.missionsCompleted);
      }
      
      if (updates.totalScore !== undefined) {
        // Use increment for total score
        updateData['detectiveAcademy.totalScore'] = increment(updates.totalScore);
      }
      
      if (updates.departmentProgress) {
        Object.entries(updates.departmentProgress).forEach(([dept, data]) => {
          if (data.missionsSolved !== undefined) {
            updateData[`detectiveAcademy.departmentProgress.${dept}.missionsSolved`] = increment(data.missionsSolved);
          }
          if (data.progress !== undefined) {
            updateData[`detectiveAcademy.departmentProgress.${dept}.progress`] = data.progress;
          }
          if (data.score !== undefined) {
            updateData[`detectiveAcademy.departmentProgress.${dept}.score`] = increment(data.score);
          }
        });
      }
      
      if (Object.keys(updateData).length > 0) {
        console.log('Updating user progress with:', updateData);
        await updateDoc(userRef, updateData);
        console.log('User progress updated successfully');
      }
    }
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error; // Re-throw to handle in calling function
  }
};

// Calculate level and experience
export const calculateLevel = (experience) => {
  for (let level = 5; level >= 1; level--) {
    if (experience >= levelConfig[level].expRequired) {
      return {
        level,
        levelName: levelConfig[level].name,
        experienceToNextLevel: level < 5 ? levelConfig[level + 1].expRequired - experience : 0
      };
    }
  }
  return levelConfig[1];
};

// Add experience points
export const addExperience = async (userId, expToAdd) => {
  try {
    const currentProgress = await getUserProgress(userId);
    if (!currentProgress) return;
    
    const newExperience = currentProgress.experience + expToAdd;
    const newLevelData = calculateLevel(newExperience);
    
    const updates = {
      experience: newExperience,
      level: newLevelData.level,
      levelName: newLevelData.levelName,
      experienceToNextLevel: newLevelData.experienceToNextLevel
    };
    
    // Batch update
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      'detectiveAcademy.experience': updates.experience,
      'detectiveAcademy.level': updates.level,
      'detectiveAcademy.levelName': updates.levelName,
      'detectiveAcademy.experienceToNextLevel': updates.experienceToNextLevel
    });
    
    return updates;
  } catch (error) {
    console.error('Error adding experience:', error);
    return null;
  }
};

// Update mission completion statistics
export const updateMissionStats = async (userId, missionData) => {
  try {
    const currentProgress = await getUserProgress(userId);
    if (!currentProgress) return;
    
    const newMissionsCompleted = currentProgress.missionsCompleted + 1;
    const newTotalScore = currentProgress.totalScore + missionData.score;
    
    // Calculate new success rate
    const missionHistory = await getMissionHistory(userId);
    const totalAccuracy = missionHistory.reduce((sum, mission) => sum + mission.accuracy, 0);
    const newSuccessRate = Math.round(totalAccuracy / newMissionsCompleted);
    
    // Update department progress
    const departmentKey = missionData.department;
    const departmentProgress = currentProgress.departmentProgress[departmentKey];
    const newDepartmentMissionsSolved = departmentProgress.missionsSolved + 1;
    const newDepartmentProgress = Math.round((newDepartmentMissionsSolved / departmentProgress.totalMissions) * 100);
    
    const updates = {
      'detectiveAcademy.missionsCompleted': newMissionsCompleted,
      'detectiveAcademy.totalScore': newTotalScore,
      'detectiveAcademy.successRate': newSuccessRate,
      [`detectiveAcademy.departmentProgress.${departmentKey}.missionsSolved`]: newDepartmentMissionsSolved,
      [`detectiveAcademy.departmentProgress.${departmentKey}.progress`]: newDepartmentProgress
    };
    
    // Batch update
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, updates);
    
    return {
      missionsCompleted: newMissionsCompleted,
      totalScore: newTotalScore,
      successRate: newSuccessRate,
      departmentProgress: newDepartmentProgress
    };
  } catch (error) {
    console.error('Error updating mission stats:', error);
    return null;
  }
};

// Get mission history
export const getMissionHistory = async (userId) => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().missionHistory || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting mission history:', error);
    return [];
  }
};

// Add mission to history
export const addMissionToHistory = async (userId, missionData) => {
  try {
    console.log('Adding mission to history for user:', userId);
    console.log('Mission data:', missionData);
    
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentHistory = userDoc.data().missionHistory || [];
      const newHistory = [...currentHistory, {
        ...missionData,
        completedAt: new Date()
      }];
      
      console.log('Current history length:', currentHistory.length);
      console.log('New history length:', newHistory.length);
      
      await updateDoc(userRef, {
        missionHistory: newHistory
      });
      
      console.log('Mission added to history successfully');
      return newHistory;
    } else {
      console.warn('User document does not exist');
    }
  } catch (error) {
    console.error('Error adding mission to history:', error);
    throw error; // Re-throw to handle in calling function
  }
}; 