import { useContext } from 'react';
import { PanchangaContext } from '../context/PanchangaContext';

const Topbar = () => {
  const { toggleSidebar } = useContext(PanchangaContext);

  return (
    <div className="topbar">
      <button className="sidebar-toggle" onClick={toggleSidebar} title="Toggle sidebar">
        <svg width="14" height="12" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="0" y1="2" x2="14" y2="2" />
          <line x1="0" y1="6" x2="14" y2="6" />
          <line x1="0" y1="10" x2="14" y2="10" />
        </svg>
      </button>
      <div className="topbar-brand">Wheno</div>
      {/* We will add the navigation and auth buttons here later */}
    </div>
  );
};

export default Topbar;
