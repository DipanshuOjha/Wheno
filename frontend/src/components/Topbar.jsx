import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { PanchangaContext } from '../context/PanchangaContext';
import { AuthContext } from '../context/AuthContext'; 
import LocationModal from './LocationModal';
import AuthModal from './AuthModal';

const Topbar = () => {
  const { toggleSidebar, userLoc, setLocModalOpen, panchaMode, togglePanchaMode } = useContext(PanchangaContext);
  const { user, logout } = useContext(AuthContext); 
  const [authModalOpen, setAuthModalOpen] = useState(false); 
  const [userMenuOpen, setUserMenuOpen] = useState(false); 

  return (
    <>
      <div className="topbar">
        <button className="sidebar-toggle" onClick={toggleSidebar} title="Toggle sidebar">
          <svg width="14" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="0" y1="2" x2="14" y2="2" />
            <line x1="0" y1="6" x2="14" y2="6" />
            <line x1="0" y1="10" x2="14" y2="10" />
          </svg>
        </button>
        
        <div className="topbar-brand">Wheno</div>
        
        <div className="topbar-years">
          <span className="ty-chip ty-vs">VS 2083</span>
          <span className="ty-chip ty-sk">Śaka 1948</span>
          <span className="ty-chip ty-ky">KY 5128</span>
        </div>

        <div className="topbar-nav">
          <NavLink to="/" className={({isActive}) => `tn-btn ${isActive ? 'active' : ''}`}>Calendar</NavLink>
          <NavLink to="/day" className={({isActive}) => `tn-btn ${isActive ? 'active' : ''}`}>Day View</NavLink>
          <NavLink to="/activities" className={({isActive}) => `tn-btn ${isActive ? 'active' : ''}`}>Activities</NavLink>
          <NavLink to="/journal" className={({isActive}) => `tn-btn ${isActive ? 'active' : ''}`}>📔 Journal</NavLink>
        </div>

        <button className={`topbar-pm ${panchaMode === 'purnimanta' ? 'purnimanta-active' : ''}`} onClick={togglePanchaMode} title="Toggle Mode">
          {panchaMode === 'purnimanta' ? '🌕 Purnimanta' : '🌑 Amanta'}
        </button>

        {/* AUTH UI */}
        {!user ? (
          <button className="topbar-login-btn" onClick={() => setAuthModalOpen(true)}>Sign in</button>
        ) : (
          <div style={{ position: 'relative' }}>
            <div className="topbar-user-chip" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <div className="topbar-avatar" style={{ background: '#7c3aed' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            {userMenuOpen && (
              <div className="user-menu" style={{ display: 'block', top: '45px' }}>
                <div className="um-info">
                  <div className="um-name">{user.name}</div>
                  <div className="um-email">{user.email}</div>
                </div>
                <div className="um-divider"></div>
                <button className="um-btn um-signout" onClick={() => { logout(); setUserMenuOpen(false); }}>Sign Out</button>
              </div>
            )}
          </div>
        )}

        <button className="topbar-loc" onClick={() => setLocModalOpen(true)}>
          <svg width="11" height="13" viewBox="0 0 11 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5.5 1C3.29 1 1.5 2.79 1.5 5c0 2.97 4 7 4 7s4-4.03 4-7c0-2.21-1.79-4-4-4z"/><circle cx="5.5" cy="5" r="1.25"/></svg>
          <span>{userLoc.n}</span>
        </button>
      </div>

      <LocationModal />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Topbar;