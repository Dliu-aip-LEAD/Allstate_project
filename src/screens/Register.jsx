import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RoundedButton from '../components/RoundedButton';
import BackButton from '../components/BackButton';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

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

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen bg-white flex flex-col items-center overflow-hidden">
      {/* Header */}
      <div className="w-full flex flex-col items-center bg-[#0033A0] py-6 px-4 md:py-8 md:px-12 relative">
        <div className="w-full flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center">
            <span className="text-white text-2xl font-bold mr-2">Allstate</span>
            <span className="text-white text-xs font-whitney tracking-widest">IDENTITY PROTECTION</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="bg-[#E2F0FF] text-[#0662CD] font-bold text-lg rounded-full px-6 py-2 shadow-sm hover:bg-[#d0e7ff] focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center text-blue-900 font-bold text-lg">
              {/* Shield icon placeholder */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 3L28 7V15C28 22.18 22.84 28.27 16 29C9.16 28.27 4 22.18 4 15V7L16 3Z" fill="#fff"/><path d="M16 3L28 7V15C28 22.18 22.84 28.27 16 29C9.16 28.27 4 22.18 4 15V7L16 3Z" stroke="#0033A0" strokeWidth="2"/><circle cx="16" cy="16" r="5" fill="#0033A0"/><path d="M16 13V16L18 18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>
      </div>
      {/* Back Arrow */}
      <BackButton
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6"
        ariaLabel="Back"
      />
      {/* Main Content */}
      <div className="flex flex-col items-center w-full px-4 mt-8 relative">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0662CD] focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M1 12C2.73 7.61 7.11 4.5 12 4.5C16.89 4.5 21.27 7.61 23 12C21.27 16.39 16.89 19.5 12 19.5C7.11 19.5 2.73 16.39 1 12Z" stroke="#0662CD" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3.5" stroke="#0662CD" strokeWidth="2"/>
              </svg>
            </button>
          </div>
          <RoundedButton
            type="submit"
            className="bg-[#0662CD] text-white font-bold text-lg hover:bg-[#0033A0] w-full h-14 mt-2"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
          </RoundedButton>
        </form>
      </div>
    </div>
  );
};

export default Register; 