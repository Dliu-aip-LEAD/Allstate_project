import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebase';

/**
 * Simple test to verify Firebase Storage is working
 * @returns {Promise<boolean>} - True if storage is accessible
 */
export const testStorageConnection = async () => {
  try {
    console.log('=== Firebase Storage Test ===');
    console.log('Storage instance:', storage);
    console.log('Storage bucket:', storage.app.options.storageBucket);
    
    // Test 1: Create a simple reference
    const testRef = ref(storage, 'test.txt');
    console.log('✅ Test reference created:', testRef);
    
    // Test 2: Try to upload a simple text file
    const testContent = 'Hello Firebase Storage!';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    
    console.log('Attempting to upload test file...');
    const snapshot = await uploadBytes(testRef, testBlob);
    console.log('✅ Test upload successful:', snapshot);
    
    // Test 3: Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('✅ Download URL obtained:', downloadURL);
    
    console.log('=== All tests passed! Firebase Storage is working ===');
    return true;
  } catch (error) {
    console.error('❌ Storage connection test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return false;
  }
};

/**
 * Convert file to base64 for temporary storage
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Upload an image file to Firebase Storage with progress monitoring
 * @param {File} file - The image file to upload
 * @param {string} userId - The user ID for organizing files
 * @param {string} folder - The folder name (e.g., 'chat-images', 'profile-pictures')
 * @param {Function} onProgress - Optional progress callback (progress: number) => void
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export const uploadImageToStorage = async (file, userId, folder = 'chat-images', onProgress = null) => {
  return new Promise((resolve, reject) => {
    try {
      // Validate storage instance
      if (!storage) {
        reject(new Error('Firebase Storage not initialized'));
        return;
      }
      
      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const fileName = `${userId}_${timestamp}_${file.name}`;
      
      console.log('Attempting to upload to path:', `${folder}/${fileName}`);
      
      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, `${folder}/${fileName}`);
      
      // Create the file metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'userId': userId,
          'uploadedAt': timestamp.toString()
        }
      };
      
      console.log('Uploading file with metadata:', metadata);
      
      // Upload file and metadata using uploadBytesResumable
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      
      // Listen for state changes, errors, and completion of the upload
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          
          // Call progress callback if provided
          if (onProgress && typeof onProgress === 'function') {
            onProgress(progress);
          }
          
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          console.error('Upload error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          
          let errorMessage = 'Upload failed';
          
          switch (error.code) {
            case 'storage/unauthorized':
              errorMessage = 'Upload failed: Unauthorized. Please check Firebase Storage rules.';
              break;
            case 'storage/canceled':
              errorMessage = 'Upload was canceled.';
              break;
            case 'storage/quota-exceeded':
              errorMessage = 'Upload failed: Storage quota exceeded.';
              break;
            case 'storage/cors':
              errorMessage = 'Upload failed: CORS error. Please check Firebase Storage rules.';
              break;
            case 'storage/object-not-found':
              errorMessage = 'Upload failed: Storage bucket not found. Please check Firebase configuration.';
              break;
            case 'storage/unknown':
              errorMessage = `Upload failed: Unknown error occurred. ${error.message}`;
              break;
            default:
              errorMessage = `Upload failed: ${error.message} (Code: ${error.code})`;
          }
          
          reject(new Error(errorMessage));
        }, 
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('Successfully uploaded image:', downloadURL);
            resolve(downloadURL);
          }).catch((error) => {
            console.error('Error getting download URL:', error);
            reject(new Error('Upload completed but failed to get download URL'));
          });
        }
      );
    } catch (error) {
      console.error('Error in uploadImageToStorage:', error);
      reject(error);
    }
  });
};

/**
 * Fallback upload method using base64 (for development/testing)
 * @param {File} file - The image file to upload
 * @param {string} userId - The user ID for organizing files
 * @returns {Promise<string>} - Base64 data URL
 */
export const uploadImageAsBase64 = async (file, userId) => {
  try {
    const base64Data = await fileToBase64(file);
    console.log('Image converted to base64 for temporary storage');
    return base64Data;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to process image');
  }
};

/**
 * Upload multiple images to Firebase Storage
 * @param {File[]} files - Array of image files to upload
 * @param {string} userId - The user ID for organizing files
 * @param {string} folder - The folder name
 * @param {Function} onProgress - Optional progress callback for each file
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadMultipleImagesToStorage = async (files, userId, folder = 'chat-images', onProgress = null) => {
  try {
    const uploadPromises = files.map((file, index) => {
      const fileProgress = onProgress ? (progress) => {
        // Calculate overall progress across all files
        const overallProgress = ((index + progress / 100) / files.length) * 100;
        onProgress(overallProgress);
      } : null;
      
      return uploadImageToStorage(file, userId, folder, fileProgress);
    });
    
    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}; 