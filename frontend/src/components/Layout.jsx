import { useContext } from 'react';
import { PanchangaContext } from '../context/PanchangaContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  const { sidebarOpen } = useContext(PanchangaContext);

  return (
    <div className="app">
      <div className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <Sidebar />
      </div>
      
      <div className="main">
        <Topbar />
        <div className="content" id="mainContent">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
