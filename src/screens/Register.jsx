import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RoundedButton from '../components/RoundedButton';
import BackButton from '../components/BackButton';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Header from '../components/Header';
import { initializeNewUser, createProfileSummary, validateOnboardingAnswers } from '../utils/userInitialization';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onboardingAnswers = location.state?.answers || {};
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate onboarding answers if they exist
      if (Object.keys(onboardingAnswers).length > 0 && !validateOnboardingAnswers(onboardingAnswers)) {
        throw new Error('Please complete all onboarding questions before registering.');
      }
      
      // Create user account with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      
      // Initialize complete user data structure using the utility function
      const userData = await initializeNewUser(user.uid, {
        name: form.name,
        email: form.email,
        onboardingAnswers
      });
      
      setLoading(false);
      setSuccess(true);
      
      // Redirect to home page after successful registration
      setTimeout(() => {
        navigate('/home', { 
          state: { 
            name: form.name,
            userInfo: { 
              uid: user.uid, 
              name: form.name,
              email: form.email 
            }
          } 
        });
      }, 1500);
      
    } catch (err) {
      setLoading(false);
      console.error('Registration error:', err);
      
      // Handle specific Firebase Auth errors
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters long.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      } else if (err.message.includes('onboarding')) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleButtonClick = (action) => {
    if (action === 'login') {
      navigate('/login');
    }
  };

  // Create profile summary for display
  const profileSummary = createProfileSummary(onboardingAnswers);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center overflow-y-auto relative">
      {/* Header */}
      <Header 
        variant="onboarding" 
        showButtons={true}
        buttons={[
          {
            label: 'Login',
            action: 'login',
            className: 'bg-[#E2F0FF] text-[#0662CD] font-bold text-lg rounded-full px-6 py-2 shadow-sm hover:bg-[#d0e7ff] focus:outline-none focus:ring-2 focus:ring-blue-400'
          }
        ]}
        onButtonClick={handleButtonClick}
      />

      {/* Back Arrow */}
      <BackButton
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-10"
        ariaLabel="Back"
      />
      
      {/* Main Content with top padding for fixed header */}
      <div className="flex flex-col items-center w-full px-4 py-8 pt-32 relative">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-[#0033A0] mb-6 text-center">Create your profile</h2>
          
          {error && (
            <div className="text-red-600 mb-4 text-center p-3 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-600 mb-4 text-center p-3 bg-green-50 rounded-lg border border-green-200">
              Account created successfully! Setting up your detective profile...
            </div>
          )}
          
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full h-12 rounded-md bg-[#F2F6FA] text-[#0033A0] placeholder-[#A0AEC0] px-4 mb-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full h-12 rounded-md bg-[#F2F6FA] text-[#0033A0] placeholder-[#A0AEC0] px-4 mb-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          
          <div className="relative w-full mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full h-12 rounded-md bg-[#F2F6FA] text-[#0033A0] placeholder-[#A0AEC0] px-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          
          {/* Onboarding summary display */}
          {profileSummary && profileSummary.length > 0 && (
            <div className="w-full mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Your Profile Summary:</h3>
              <div className="text-xs text-blue-700 space-y-1">
                {profileSummary.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="capitalize">{item.question}:</span>
                    <span className="font-medium">{item.answer}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2 italic">
                This information will help personalize your detective training experience.
              </p>
            </div>
          )}
          
          <RoundedButton
            type="submit"
            className="w-full bg-[#0662CD] text-white hover:bg-[#0033A0] h-12"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </RoundedButton>
          
          <p className="text-xs text-gray-500 mt-4 text-center">
            By creating an account, you'll get access to the Detective Academy and personalized training missions.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register; 