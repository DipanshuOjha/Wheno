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
  const [locModalOpen, setLocModalOpen] = useState(false);

  // Filters
  const [filterMode, setFilterMode] = useState('all');
  const [tF, setTF] = useState(''); // Tithi filter
  const [nF, setNF] = useState(''); // Nakshatra filter
  const [pF, setPF] = useState(''); // Paksha filter

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const togglePanchaMode = () => setPanchaMode(prev => prev === 'amanta' ? 'purnimanta' : 'amanta');

  return (
    <PanchangaContext.Provider value={{
      panchaMode, togglePanchaMode,
      userLoc, setUserLoc,
      dvDate, setDvDate,
      curMonthIdx, setCurMonthIdx,
      sidebarOpen, toggleSidebar,
      locModalOpen, setLocModalOpen,
      filterMode, setFilterMode,
      tF, setTF, // <--- Added Tithi state
      nF, setNF, // <--- Added Nakshatra state
      pF, setPF  // <--- Added Paksha state
    }}>
      {children}
    </PanchangaContext.Provider>
  );
};