import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { defaultDetectiveAcademy } from './userProgress';

// Data migration script - Initialize detective academy data for existing users
export const migrateExistingUsers = async () => {
  try {
    console.log('Starting data migration for existing users...');
    
    // Get all users
    const usersSnapshot = await getDocs(collection(firestore, 'users'));
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      try {
        const userData = userDoc.data();
        
        // Check if user already has detective academy data
        if (!userData.detectiveAcademy) {
          console.log(`Migrating user: ${userData.email || userData.name || userDoc.id}`);
          
          // Set initial values for existing users
          const initialData = {
            ...defaultDetectiveAcademy,
            // If user has onboardingAnswers, can set some initial values based on these answers
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
                totalMissions: 10,
                unlocked: true
              },
              'social-media': {
                progress: 0,
                missionsSolved: 0,
                totalMissions: 10,
                unlocked: true
              },
              'financial-crimes': {
                progress: 0,
                missionsSolved: 0,
                totalMissions: 10,
                unlocked: true
              },
              'elder-fraud': {
                progress: 0,
                missionsSolved: 0,
                totalMissions: 10,
                unlocked: false
              }
            }
          };
          
          // Update user document
          await updateDoc(doc(firestore, 'users', userDoc.id), {
            detectiveAcademy: initialData,
            missionHistory: userData.missionHistory || [],
            achievements: userData.achievements || []
          });
          
          migratedCount++;
          console.log(`Successfully migrated user: ${userData.email || userData.name || userDoc.id}`);
        } else {
          console.log(`User already has detective academy data: ${userData.email || userData.name || userDoc.id}`);
        }
      } catch (error) {
        console.error(`Error migrating user ${userDoc.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Migration completed. Successfully migrated: ${migratedCount}, Errors: ${errorCount}`);
    return { migratedCount, errorCount };
    
  } catch (error) {
    console.error('Error during data migration:', error);
    throw error;
  }
};

// Check user data integrity
export const checkUserDataIntegrity = async (userId) => {
  try {
    const userDoc = await getDocs(doc(firestore, 'users', userId));
    
    if (!userDoc.exists()) {
      return { isValid: false, missingFields: ['user_document'] };
    }
    
    const userData = userDoc.data();
    const missingFields = [];
    
    // Check required fields
    if (!userData.detectiveAcademy) {
      missingFields.push('detectiveAcademy');
    }
    
    if (!userData.missionHistory) {
      missingFields.push('missionHistory');
    }
    
    if (!userData.achievements) {
      missingFields.push('achievements');
    }
    
    // Check detective academy data integrity
    if (userData.detectiveAcademy) {
      const requiredFields = [
        'level', 'levelName', 'experience', 'experienceToNextLevel',
        'totalScore', 'currentScore', 'missionsCompleted', 'totalMissions',
        'successRate', 'currentMissionId', 'currentMissionProgress',
        'departmentProgress'
      ];
      
      requiredFields.forEach(field => {
        if (userData.detectiveAcademy[field] === undefined) {
          missingFields.push(`detectiveAcademy.${field}`);
        }
      });
    }
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      userData
    };
    
  } catch (error) {
    console.error('Error checking user data integrity:', error);
    return { isValid: false, missingFields: ['error'], error: error.message };
  }
};

// Fix single user data
export const fixUserData = async (userId) => {
  try {
    const integrityCheck = await checkUserDataIntegrity(userId);
    
    if (integrityCheck.isValid) {
      console.log('User data is already valid');
      return { success: true, message: 'User data is already valid' };
    }
    
    console.log('Fixing user data...');
    
    const userRef = doc(firestore, 'users', userId);
    const updates = {};
    
    // Add missing fields
    if (!integrityCheck.userData.detectiveAcademy) {
      updates.detectiveAcademy = defaultDetectiveAcademy;
    }
    
    if (!integrityCheck.userData.missionHistory) {
      updates.missionHistory = [];
    }
    
    if (!integrityCheck.userData.achievements) {
      updates.achievements = [];
    }
    
    // Execute updates if any
    if (Object.keys(updates).length > 0) {
      await updateDoc(userRef, updates);
      console.log('User data fixed successfully');
      return { success: true, message: 'User data fixed successfully' };
    }
    
    return { success: true, message: 'No fixes needed' };
    
  } catch (error) {
    console.error('Error fixing user data:', error);
    return { success: false, error: error.message };
  }
};

// Batch fix all user data
export const fixAllUserData = async () => {
  try {
    console.log('Starting batch fix for all users...');
    
    const usersSnapshot = await getDocs(collection(firestore, 'users'));
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      try {
        const result = await fixUserData(userDoc.id);
        if (result.success) {
          fixedCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error fixing user ${userDoc.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Batch fix completed. Fixed: ${fixedCount}, Errors: ${errorCount}`);
    return { fixedCount, errorCount };
    
  } catch (error) {
    console.error('Error during batch fix:', error);
    throw error;
  }
}; 