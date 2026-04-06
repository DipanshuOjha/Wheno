import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { PanchangaContext } from '../context/PanchangaContext';
import LocationModal from './LocationModal';

const Topbar = () => {
  const {
    toggleSidebar,
    userLoc,
    setLocModalOpen,
    panchaMode,
    togglePanchaMode,
  } = useContext(PanchangaContext);

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
          <NavLink to="/" className={({ isActive }) => `tn-btn ${isActive ? 'active' : ''}`}>
            Calendar
          </NavLink>
          <NavLink to="/day" className={({ isActive }) => `tn-btn ${isActive ? 'active' : ''}`}>
            Day View
          </NavLink>
          <NavLink
            to="/activities"
            className={({ isActive }) => `tn-btn ${isActive ? 'active' : ''}`}
          >
            Activities
          </NavLink>
          <NavLink
            to="/journal"
            className={({ isActive }) => `tn-btn ${isActive ? 'active' : ''}`}
          >
            📔 Journal
          </NavLink>
          <NavLink
            to="/festivals"
            className={({ isActive }) => `tn-btn ${isActive ? 'active' : ''}`}
          >
            Festivals
          </NavLink>
        </div>

        <button
          className={`topbar-pm ${panchaMode === 'purnimanta' ? 'purnimanta-active' : ''}`}
          onClick={togglePanchaMode}
          title="Toggle Mode"
        >
          {panchaMode === 'purnimanta' ? '🌕 Purnimanta' : '🌑 Amanta'}
        </button>

        {/* Temporary Auth Button - We will build the Auth Modal later */}
        <button className="topbar-login-btn" type="button">
          Sign in
        </button>

        <button className="topbar-loc" type="button" onClick={() => setLocModalOpen(true)}>
          <svg
            width="11"
            height="13"
            viewBox="0 0 11 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M5.5 1C3.29 1 1.5 2.79 1.5 5c0 2.97 4 7 4 7s4-4.03 4-7c0-2.21-1.79-4-4-4z" />
            <circle cx="5.5" cy="5" r="1.25" />
          </svg>
          <span>{userLoc.n}</span>
        </button>
      </div>

      <LocationModal />
    </>
  );
};

export default Topbar;
