# Testing Guide for Allstate Detective Academy

This document explains how to use the various test scripts to verify the functionality of different components in the Detective Academy application.

## 🧪 Available Test Scripts

### 1. Department Unlock System Tests
**File:** `src/utils/testDepartmentUnlock.js`
**Purpose:** Test department unlock logic and requirements
**Usage:** 
```javascript
// In browser console
window.testDepartmentUnlock.runAllDepartmentTests()
```

**Tests:**
- Department unlock scenarios for different user levels
- Individual department unlock logic
- Unlock requirement text generation
- Department progress calculation

### 2. Email Crimes Missions Tests
**File:** `src/utils/testEmailCrimesMissions.js`
**Purpose:** Test Email Crimes missions data structure and progression
**Usage:**
```javascript
// In browser console
window.testEmailCrimes.runAllEmailCrimesTests()
```

**Tests:**
- Mission structure validation
- Mission progression flow
- Mission content analysis
- Mission unlock logic

### 3. EmailCrimeUnit Page Tests
**File:** `src/utils/testEmailCrimeUnitPage.js`
**Purpose:** Test EmailCrimeUnit page functionality
**Usage:**
```javascript
// In browser console
window.testEmailCrimeUnitPage.runAllEmailCrimeUnitTests()
```

**Tests:**
- Mission generation for the page
- Mission status determination
- Mission grouping by difficulty
- Unlock requirement text generation

### 4. Mission Introduction Tests
**File:** `src/utils/testMissionIntroduction.js`
**Purpose:** Test MissionIntroduction page functionality
**Usage:**
```javascript
// In browser console
window.testMissionIntroduction.runAllMissionIntroductionTests()
```

**Tests:**
- Mission introduction generation
- Difficulty styling
- Mission content analysis
- Mission navigation flow
- Mission data validation

### 5. EmailCrimeInvestigation Tests
**File:** `src/utils/testEmailCrimeInvestigation.js`
**Purpose:** Test EmailCrimeInvestigation page functionality
**Usage:**
```javascript
// In browser console
window.testEmailCrimeInvestigation.runAllEmailCrimeInvestigationTests()
```

**Tests:**
- Mission data loading
- Content rendering
- Scoring system
- Mission progression
- Investigation mechanics
- Database integration

### 6. Hotspot Fix Tests
**File:** `src/utils/testEmailCrimeInvestigationFix.js`
**Purpose:** Test the hotspot click fix for EmailCrimeInvestigation
**Usage:**
```javascript
// In browser console
window.testEmailCrimeInvestigationFix.runAllHotspotTests()
```

**Tests:**
- Hotspot mapping functionality
- Hotspot click simulation
- Email content rendering
- Complete hotspot system

## 🚀 Running Tests

### Method 1: Browser Console
1. Open the Detective Academy application in your browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. **First, load all test functions:**
   ```javascript
   window.loadAllTests()
   ```
5. **Then run any of the test functions:**
   ```javascript
   window.testDepartmentUnlock.runAllDepartmentTests()
   window.testEmailCrimes.runAllEmailCrimesTests()
   // ... etc
   ```

### Method 2: NPM Scripts
```bash
# Test department unlock system
npm run test:departments

# Test Email Crimes missions
npm run test:email-crimes

# Test EmailCrimeUnit page
npm run test:email-crime-unit

# Test Mission Introduction page
npm run test:mission-introduction

# Test EmailCrimeInvestigation page
npm run test:email-crime-investigation

# Test hotspot fix
npm run test:hotspot-fix
```

## 📊 Test Results Interpretation

### ✅ Success Indicators
- All tests return results (not null)
- Mission mapping scores are 100%
- All clues have corresponding quizzes
- All hotspots are properly mapped

### ❌ Failure Indicators
- Tests return null or errors
- Missing clues or quizzes
- Broken hotspot mappings
- Incomplete mission data

### ⚠️ Warning Indicators
- Partial test failures
- Missing optional components
- Incomplete data structures

## 🔧 Troubleshooting

### Common Issues

1. **Import Errors**
   - Ensure all test files are in the correct `src/utils/` directory
   - Check that import paths in test files are correct
   - Verify that `missions.js` and other data files exist

2. **Test Functions Not Available**
   - Make sure test scripts are imported in `Play.jsx`
   - Check browser console for any JavaScript errors
   - Verify that the application is running

3. **Data Mismatches**
   - Check that `missions.js` has the correct structure
   - Verify that clues and quizzes keys match
   - Ensure all required fields are present

### Debug Steps

1. **Check Console Errors**
   - Look for JavaScript errors in browser console
   - Check for missing imports or undefined variables

2. **Verify Data Structure**
   - Run individual test functions to isolate issues
   - Check specific mission data in `missions.js`

3. **Test Individual Components**
   - Run specific test functions instead of full test suites
   - Focus on failing components first

## 📝 Adding New Tests

To add new test functionality:

1. **Create Test File**
   - Create new file in `src/utils/` directory
   - Follow naming convention: `test[ComponentName].js`

2. **Export Test Functions**
   - Export individual test functions
   - Export a main test runner function
   - Make functions available in `window` object for browser console

3. **Update Imports**
   - Add import to `Play.jsx`
   - Update `package.json` with new test script

4. **Document Usage**
   - Add usage instructions to this README
   - Include example console commands

## 🎯 Test Coverage

Current test coverage includes:
- ✅ Department unlock system
- ✅ Email Crimes missions data
- ✅ EmailCrimeUnit page functionality
- ✅ Mission Introduction page
- ✅ EmailCrimeInvestigation page
- ✅ Hotspot click functionality
- ✅ Mission progression logic
- ✅ Data validation
- ✅ UI component rendering

## 📞 Support

If you encounter issues with the test scripts:
1. Check the browser console for error messages
2. Verify that all required files are present
3. Ensure the application is running correctly
4. Check that test data in `missions.js` is valid

For additional help, refer to the main application documentation or contact the development team. 