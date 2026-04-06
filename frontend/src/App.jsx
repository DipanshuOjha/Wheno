import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PanchangaProvider } from './context/PanchangaContext';

import Layout from './components/Layout';
import CalendarView from './pages/CalendarView';
import DayView from './pages/DayView';
import Activities from './pages/Activities';
import Journal from './pages/Journal';
import Festivals from './pages/Festivals';

function App() {
  return (
    <AuthProvider>
      <PanchangaProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<CalendarView />} />
              <Route path="/day" element={<DayView />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/festivals" element={<Festivals />} />
            </Routes>
          </Layout>
        </Router>
      </PanchangaProvider>
    </AuthProvider>
  );
}

export default App;
