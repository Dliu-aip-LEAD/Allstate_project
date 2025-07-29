import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import RoundedButton from '../components/RoundedButton';
import BackButton from '../components/BackButton';
import Header from '../components/Header';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      // Fetch user's name from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      const userData = userDoc.data();
      const name = userData?.name || '';
      setLoading(false);
      navigate('/home', { state: { name } });
    } catch (err) {
      setLoading(false);
      setError('Invalid email or password.');
    }
  };

  const handleForgotPassword = () => {
    // You can implement password reset here
    alert('Password reset functionality coming soon!');
  };

  const handleButtonClick = (action) => {
    if (action === 'signup') {
      navigate('/signup');
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
            label: 'Sign up',
            action: 'signup',
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
          <h2 className="text-2xl font-bold text-[#0033A0] mb-6 text-center">Login</h2>
          {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
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
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-[#0662CD] text-sm mb-6 hover:underline"
          >
            Forgot your password?
          </button>
          <RoundedButton
            type="submit"
            className="w-full bg-[#0662CD] text-white hover:bg-[#0033A0] h-12"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </RoundedButton>
        </form>
      </div>
    </div>
  );
};

export default Login; 