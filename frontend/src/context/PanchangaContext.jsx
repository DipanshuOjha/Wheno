import { createContext, useState } from 'react';

export const PanchangaContext = createContext();

export const PanchangaProvider = ({ children }) => {
  // Default values mapping your HTML constants
  const [panchaMode, setPanchaMode] = useState('amanta'); // 'amanta' or 'purnimanta'
  const [userLoc, setUserLoc] = useState({
    n: 'Guwahati, India',
    lat: 26.1445,
    lon: 91.7362,
    isDefault: true
  });
  
  // State for UI navigation
  const [dvDate, setDvDate] = useState('20260327'); // Must exist in PD; align when full data is pasted
  const [curMonthIdx, setCurMonthIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filters
  const [filterMode, setFilterMode] = useState('all');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const togglePanchaMode = () => setPanchaMode(prev => prev === 'amanta' ? 'purnimanta' : 'amanta');

  return (
    <PanchangaContext.Provider value={{
      panchaMode, togglePanchaMode,
      userLoc, setUserLoc,
      dvDate, setDvDate,
      curMonthIdx, setCurMonthIdx,
      sidebarOpen, toggleSidebar,
      filterMode, setFilterMode
    }}>
      {children}
    </PanchangaContext.Provider>
  );
};
