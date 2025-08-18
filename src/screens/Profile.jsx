import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import Header from '../components/Header';
import RoundedButton from '../components/RoundedButton';
import BottomNav from '../components/BottomNav';
import { getUserProgress, defaultDetectiveAcademy } from '../utils/userProgress';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [detectiveData, setDetectiveData] = useState(defaultDetectiveAcademy);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    ageGroup: '',
    techExperience: '',
    primaryActivity: '',
    cybersecurityKnowledge: ''
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        console.log('🔍 Setting up real-time listener for Profile page user:', user.uid);
        
        // Set up real-time listener for user document
        const userRef = doc(firestore, 'users', user.uid);
        const userUnsubscribe = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            console.log('📊 Profile real-time update received:', data);
            
            setUserData(data);
            
            // Get detective academy data
            if (data.detectiveAcademy) {
              setDetectiveData(data.detectiveAcademy);
            }
            
            // Map onboarding answers to form data
            const onboardingAnswers = data.onboardingAnswers || {};
            setFormData({
              fullName: data.name || '',
              email: user.email || '',
              ageGroup: onboardingAnswers.age?.label || '30-49 years old',
              techExperience: onboardingAnswers.experience?.label || 'Regular User',
              primaryActivity: onboardingAnswers.activity?.label || 'Online shopping and banking',
              cybersecurityKnowledge: onboardingAnswers.knowledge?.label || 'Some knowledge'
            });
            
            setLoading(false);
          } else {
            console.log('❌ User document not found in Profile');
            setLoading(false);
          }
        }, (error) => {
          console.error('❌ Error in Profile real-time listener:', error);
          setLoading(false);
        });
        
        // Return cleanup function for both auth and user document listeners
        return () => {
          console.log('🔍 Cleaning up Profile real-time listeners');
          userUnsubscribe();
        };
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveInfo = async () => {
    if (!user) return;
    
    try {
      // Update user name
      await updateDoc(doc(firestore, 'users', user.uid), {
        name: formData.fullName
      });

      // Update onboarding answers if they exist
      if (userData?.onboardingAnswers) {
        const updatedOnboardingAnswers = { ...userData.onboardingAnswers };
        
        // Map form data back to onboarding answers structure
        if (formData.ageGroup) {
          updatedOnboardingAnswers.age = {
            ...updatedOnboardingAnswers.age,
            label: formData.ageGroup
          };
        }
        
        if (formData.techExperience) {
          updatedOnboardingAnswers.experience = {
            ...updatedOnboardingAnswers.experience,
            label: formData.techExperience
          };
        }
        
        if (formData.primaryActivity) {
          updatedOnboardingAnswers.activity = {
            ...updatedOnboardingAnswers.activity,
            label: formData.primaryActivity
          };
        }
        
        if (formData.cybersecurityKnowledge) {
          updatedOnboardingAnswers.knowledge = {
            ...updatedOnboardingAnswers.knowledge,
            label: formData.cybersecurityKnowledge
          };
        }
        
        // Update onboarding answers
        await updateDoc(doc(firestore, 'users', user.uid), {
          onboardingAnswers: updatedOnboardingAnswers
        });
        
        // Update local state
        setUserData(prev => ({ 
          ...prev, 
          name: formData.fullName,
          onboardingAnswers: updatedOnboardingAnswers
        }));
      }
      
      setEditing(false);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#0033A0] text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      {/* Header */}
      <Header variant="home" />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 space-y-6 pt-20 pb-24">
        {/* Profile Header */}
        <section className="bg-[#0033A0] rounded-2xl p-6 text-white text-center">
          {/* Avatar */}
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🕵️</span>
          </div>
          
          {/* Name and Title */}
          <h1 className="text-2xl font-bold mb-2">{formData.fullName || 'User'}</h1>
          <p className="text-sm opacity-90">🏆 {detectiveData.levelName} • Level {detectiveData.level}</p>
          
          {/* Stats */}
          <div className="flex justify-around mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{detectiveData.missionsCompleted}</div>
              <div className="text-xs opacity-80">Missions Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{detectiveData.experience}</div>
              <div className="text-xs opacity-80">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{detectiveData.successRate}%</div>
              <div className="text-xs opacity-80">Success Rate</div>
            </div>
          </div>
        </section>

        {/* Profile Information */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Profile Information</h2>
          
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 uppercase mb-2">FULL NAME</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                disabled={!editing}
                className="flex-1 h-12 rounded-lg bg-gray-50 px-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
              />
              {editing ? (
                <button
                  onClick={handleSaveInfo}
                  className="bg-[#00C853] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00a44b]"
                >
                  Save Info
                </button>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-[#0033A0] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#002266]"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 uppercase mb-2">EMAIL ADDRESS</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full h-12 rounded-lg bg-gray-50 px-4 border border-gray-200 text-gray-600"
            />
          </div>

          {/* Age Group */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 uppercase mb-2">AGE GROUP</label>
            <select
              value={formData.ageGroup}
              onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}
              disabled={!editing}
              className="w-full h-12 rounded-lg bg-gray-50 px-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            >
              <option value="Under 18">Under 18</option>
              <option value="18-29 years old">18-29 years old</option>
              <option value="30-49 years old">30-49 years old</option>
              <option value="50-64 years old">50-64 years old</option>
              <option value="Over 65+">Over 65+</option>
            </select>
          </div>

          {/* Tech Experience */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 uppercase mb-2">TECH EXPERIENCE</label>
            <select
              value={formData.techExperience}
              onChange={(e) => setFormData({...formData, techExperience: e.target.value})}
              disabled={!editing}
              className="w-full h-12 rounded-lg bg-gray-50 px-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            >
              <option value="New to technology">New to technology</option>
              <option value="Casual user">Casual user</option>
              <option value="Regular user">Regular user</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Primary Online Activity */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 uppercase mb-2">PRIMARY ONLINE ACTIVITY</label>
            <select
              value={formData.primaryActivity}
              onChange={(e) => setFormData({...formData, primaryActivity: e.target.value})}
              disabled={!editing}
              className="w-full h-12 rounded-lg bg-gray-50 px-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            >
              <option value="Social media and messaging">Social media and messaging</option>
              <option value="Online shopping and banking">Online shopping and banking</option>
              <option value="Work emails and video calls">Work emails and video calls</option>
              <option value="Basic browsing/entertainment">Basic browsing/entertainment</option>
            </select>
          </div>

          {/* Cybersecurity Knowledge */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 uppercase mb-2">CYBERSECURITY KNOWLEDGE</label>
            <select
              value={formData.cybersecurityKnowledge}
              onChange={(e) => setFormData({...formData, cybersecurityKnowledge: e.target.value})}
              disabled={!editing}
              className="w-full h-12 rounded-lg bg-gray-50 px-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            >
              <option value="Very little">Very little</option>
              <option value="A little">A little</option>
              <option value="Some knowledge">Some knowledge</option>
              <option value="A lot">A lot</option>
            </select>
          </div>
        </section>

        {/* Detective Academy Progress */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Detective Academy Progress</h2>
          
          {/* Department Progress */}
          <div className="space-y-4">
            {Object.entries(detectiveData.departmentProgress || {}).map(([deptKey, deptData]) => (
              <div key={deptKey} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800 capitalize">
                    {deptKey.replace('-', ' ')}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {deptData.missionsSolved}/{deptData.totalMissions} missions
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${deptData.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {deptData.progress}% complete
                  {!deptData.unlocked && ' • Locked'}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Achievements</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700">View All</button>
          </div>
          
          {detectiveData.achievements && detectiveData.achievements.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto">
              {detectiveData.achievements.map((achievement, index) => (
                <div key={index} className="flex-shrink-0 bg-yellow-50 rounded-xl p-4 w-24 text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-xs font-semibold">{achievement.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-sm">Complete missions to unlock achievements!</p>
            </div>
          )}
        </section>

        {/* Account Settings */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Account Settings</h2>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="font-semibold text-gray-800">Data Privacy</div>
              <div className="text-sm text-gray-500">Use your data for personalization</div>
            </div>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
            </div>
          </div>

          <RoundedButton
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3"
          >
            LOG OUT
          </RoundedButton>
        </section>
      </main>

      {/* Bottom Nav */}
      <BottomNav activePage="/profile" />
    </div>
  );
};

export default Profile;