import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RoundedButton from '../components/RoundedButton';
import BackButton from '../components/BackButton';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Header from '../components/Header';

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
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      // Save name and onboarding answers in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        name: form.name,
        email: form.email,
        onboardingAnswers,
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/home', { state: { name: form.name } });
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleButtonClick = (action) => {
    if (action === 'login') {
      navigate('/login');
    }
  };

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
          {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
          {success && <div className="text-green-600 mb-4 text-center">Sign up successful! Redirecting...</div>}
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
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <RoundedButton
            type="submit"
            className="w-full bg-[#0662CD] text-white hover:bg-[#0033A0] h-12"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </RoundedButton>
        </form>
      </div>
    </div>
  );
};

export default Register; 