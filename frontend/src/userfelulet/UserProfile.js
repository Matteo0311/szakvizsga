// Alap felhasználói profil oldal
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import './UserProfileDashboard.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaChartBar, FaCog, FaSignOutAlt } from './UserProfileIcons';
import config from '../config';
import UserSidebar from './UserSidebar';

const statistics = [
  { label: 'Performance', value: '+21%', color: '#ffe082' },
  { label: 'Success', value: '+42%', color: '#a084ee' },
  { label: 'Innovation', value: '+12%', color: '#ff6b81' },
];

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      try {
        const res = await fetch(`${config.API_BASE_URL}/sajatFelhAdatok`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (e) { /* hiba esetén nem töltjük be */ }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  return (
    <div className="dashboard-container">
      <UserSidebar />
      <div className="main-content">
        <div className="dashboard-inner center-dashboard">
          <div className="profile-section">
            <div className="profile-card">
              <div className="profile-role-above">
                {profile?.felh_szerepkor === 'admin' ? (
                  <span className="admin-crown" title="Admin">👑</span>
                ) : null}
                <span className={profile?.felh_szerepkor === 'admin' ? 'role-admin' : 'role-user'}>
                  {profile?.felh_szerepkor || user?.szerepkor || 'Role'}
                </span>
              </div>
              <div className="profile-avatar"><FaUser /></div>
              <div className="profile-name">{profile?.felh_nev || user?.nev || 'User'}</div>
              <div className="profile-location">{profile?.email || 'Nincs megadva'}</div>
              <div className="profile-date">Regisztráció: {profile?.regisztracio_datuma ? new Date(profile.regisztracio_datuma).toLocaleDateString() : 'Nincs adat'}</div>
            </div>
          </div>
          <div className="right-panel">
            <div className="score-section">
              <div className="score-label">Score</div>
              <div className="score-value">70%</div>
              <div className="score-desc">Fantastic job</div>
            </div>
            <div className="statistics-section">
              <div className="statistics-title">Statistics</div>
              <div className="statistics-list">
                {statistics.map((stat, idx) => (
                  <div className="statistics-item" key={idx}>
                    <span className="statistics-label">{stat.label}</span>
                    <span className="statistics-value" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
