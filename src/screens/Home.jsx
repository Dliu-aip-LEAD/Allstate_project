import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import alliAvatar from '../assets/onboard1.png'; // Replace with correct path
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name || 'there';

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      {/* Header */}
      <Header variant="home" />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 space-y-6 pt-20">
        {/* Detective Alli Section */}
        <section className="bg-[#E6F0FF] p-4 rounded-2xl shadow-sm">
          <div className="flex gap-3 items-center">
            <img src={alliAvatar} className="w-14 h-14" />
            <div>
              <h2 className="text-[#0033A0] text-lg font-bold">Hey {name}</h2>
              <p className="text-green-600 text-xs">Online • Ask me anything about online safety</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
  <p className="text-[#0033A0] text-xs font-semibold mb-1">Popular Questions</p>
  {["Is this email safe?", "What are romance scams?"].map((q, i) => (
    <p
      key={i}
      className="bg-white p-2 rounded-md shadow-sm hover:bg-[#f0f4f8] cursor-pointer transition"
    >
      "{q}"
    </p>
  ))}
</div>

          <button
            onClick={() => navigate('/chat')}
            className="mt-4 w-full bg-[#00AEFF] hover:bg-[#0094d3] text-white py-3 rounded-full font-semibold text-sm transition-all duration-200"
          >
            Chat with Detective Alli
          </button>
        </section>

        {/* Quick Scam Scan */}
        <section className="bg-white p-5 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-1">⚡ Quick Scam Scan</h3>
          <p className="text-xs text-gray-500 mb-3">Instant AI analysis • Quick Results</p>
          <div className="grid grid-cols-3 gap-2 text-sm text-center">
            {["Screenshot", "Upload File", "Take Photo"].map((label) => (
              <button
                key={label}
                onClick={() => navigate('/quick-scam-scan', { state: { userInfo: { uid: 'user123', displayName: name } } })}
                className="flex flex-col items-center justify-center border p-3 rounded-lg hover:bg-gray-100 shadow-sm"
              >
                <span className="text-xl">📎</span>
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Detective Academy */}
        <section className="relative bg-gradient-to-br from-[#DEE9FF] to-[#C7D9FF] p-4 rounded-2xl shadow-md">
  {/* Badge Icon */}
  <div className="absolute -top-6 right-4 bg-white rounded-full border shadow-md p-1">
    <img src={alliAvatar} alt="badge" className="w-10 h-10 rounded-full" />
  </div>

  {/* Title */}
  <h3 className="text-[#0033A0] font-bold text-sm">🎓 Detective Academy</h3>
  <p className="text-xs mb-2">Train with Detective Alli to become a cybersecurity expert</p>
  <p className="text-sm font-semibold">🥉 Junior Detective</p>
  <div className="text-xs text-gray-600">Level 3 of 5 • Next: Senior Detective</div>

  {/* Points */}
  <div className="mt-1">
    <span className="bg-white text-[#FF6D00] px-3 py-1 text-xs rounded-full font-semibold inline-block shadow-sm">
      🔥 350 PTS
    </span>
  </div>

  {/* Active Mission + Mission Solved */}
  <div className="flex gap-2 mt-4">
  {/* Mission Block */}
  <div className="flex-1 bg-white border rounded-xl p-3 text-sm">
    <p className="text-[#00C853] font-bold">🟢 ACTIVE MISSION</p>
    <p className="font-bold text-sm">Spot the Phishing Email</p>
    <p className="text-xs text-gray-600">Detective Alli is helping you identify suspicious messages</p>
  </div>

  {/* Solved Block */}
  <div className="flex flex-col items-center justify-center bg-white border rounded-xl px-4 py-3 text-center">
    <p className="text-xs text-gray-600">MISSIONS SOLVED</p>
    <p className="text-lg font-bold text-[#0033A0]">5</p>
  </div>
</div>


  {/* CTA */}
  <button
    onClick={() => navigate('/play')}
    className="mt-4 w-full bg-[#00C853] hover:bg-[#00a44b] text-white py-3 rounded-full font-semibold text-sm"
  >
    Start Training Mission
  </button>
</section>

      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default Home;
