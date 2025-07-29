import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Header from '../components/Header';
import RoundedButton from '../components/RoundedButton';
import BottomNav from '../components/BottomNav';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
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
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setFormData({
              fullName: data.name || '',
              email: user.email || '',
              ageGroup: data.ageGroup || '30-49 years old',
              techExperience: data.techExperience || 'Regular User',
              primaryActivity: data.primaryActivity || 'Online shopping and banking',
              cybersecurityKnowledge: data.cybersecurityKnowledge || 'Some knowledge'
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveInfo = async () => {
    if (!user) return;
    
    try {
      await updateDoc(doc(firestore, 'users', user.uid), {
        name: formData.fullName,
        ageGroup: formData.ageGroup,
        techExperience: formData.techExperience,
        primaryActivity: formData.primaryActivity,
        cybersecurityKnowledge: formData.cybersecurityKnowledge
      });
      setEditing(false);
      // Update local state
      setUserData(prev => ({ ...prev, name: formData.fullName }));
    } catch (error) {
      console.error('Error updating user data:', error);
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
          <p className="text-sm opacity-90">🏆 Junior Detective • Level 3</p>
          
          {/* Stats */}
          <div className="flex justify-around mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">5</div>
              <div className="text-xs opacity-80">Missions Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">350</div>
              <div className="text-xs opacity-80">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">85%</div>
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
              <option value="18-29 years old">18-29 years old</option>
              <option value="30-49 years old">30-49 years old</option>
              <option value="50-64 years old">50-64 years old</option>
              <option value="65+ years old">65+ years old</option>
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
              <option value="Beginner">Beginner</option>
              <option value="Regular User">Regular User</option>
              <option value="Advanced User">Advanced User</option>
              <option value="Tech Professional">Tech Professional</option>
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
              <option value="Social media">Social media</option>
              <option value="Online shopping and banking">Online shopping and banking</option>
              <option value="Work and productivity">Work and productivity</option>
              <option value="Gaming and entertainment">Gaming and entertainment</option>
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
              <option value="No knowledge">No knowledge</option>
              <option value="Some knowledge">Some knowledge</option>
              <option value="Good knowledge">Good knowledge</option>
              <option value="Expert knowledge">Expert knowledge</option>
            </select>
          </div>
        </section>

        {/* Achievements */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Achievements</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700">View All</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto">
            <div className="flex-shrink-0 bg-yellow-50 rounded-xl p-4 w-24 text-center">
              <div className="text-2xl mb-2">💡</div>
              <div className="text-xs font-semibold">Quick Learner</div>
            </div>
            <div className="flex-shrink-0 bg-yellow-50 rounded-xl p-4 w-24 text-center">
              <div className="text-2xl mb-2">💪</div>
              <div className="text-xs font-semibold">Strong Defender</div>
            </div>
            <div className="flex-shrink-0 bg-yellow-50 rounded-xl p-4 w-24 text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="text-xs font-semibold">Shield Master</div>
            </div>
          </div>
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