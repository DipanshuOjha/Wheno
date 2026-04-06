import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PanchangaContext } from '../context/PanchangaContext';
import { PD } from '../data/panchanga';
import { getTithiAtLocalSunrise, getLocMuhurtas } from '../utils/astronomy'; // Ensure these are exported from astronomy.js!
import { extractName } from '../utils/helpers';
// import PlanModal from '../components/PlanModal'; // We will build this next!

const Activities = () => {
  const { user } = useContext(AuthContext);
  const { dvDate, userLoc } = useContext(PanchangaContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);

  const fetchActivities = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/activities');
      setActivities(res.data);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this activity?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/activities/${id}`);
      setActivities(activities.filter(a => a._id !== id));
    } catch (err) {
      alert('Could not delete activity.');
    }
  };

  const formatGregDate = (dk) => {
    if (!dk) return '';
    const date = new Date(parseInt(dk.slice(0,4)), parseInt(dk.slice(4,6))-1, parseInt(dk.slice(6,8)));
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (!user) {
    return (
      <div className="jl-empty" style={{ paddingTop: '60px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
        <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>Sign in to plan Activities</div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>Schedule your important events using Panchanga timings.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 18px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: 'var(--ink)' }}>My Activities</div>
        <button className="pm-btn-primary" style={{ padding: '7px 16px', fontSize: '12px', width: 'auto' }} onClick={() => setPlanModalOpen(true)}>+ Plan</button>
      </div>

      <div id="bookList">
        {loading ? <div className="jl-loading">Loading...</div> : activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🗓️</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>No activities planned yet</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px' }}>Pick an auspicious date and time on the panchanga calendar</div>
            <button className="pm-btn-primary" style={{ maxWidth: '220px', margin: '0 auto', display: 'block' }} onClick={() => setPlanModalOpen(true)}>+ Plan an Activity</button>
          </div>
        ) : (
          activities.map((a) => {
            const pd = PD[a.dateKey];
            // You might need to ensure getTithiAtLocalSunrise is implemented and exported in astronomy.js
            // For now, we will fallback to basic extraction if it's missing
            const tithiName = pd ? extractName(pd.tithi) : '';

            return (
              <div key={a._id} className="bcard">
                <div className="bcard-top">
                  <div>
                    <div style={{ fontSize: '22px', marginBottom: '4px' }}>{a.activityIcon || '📌'}</div>
                    <div className="bcard-name">{a.activityLabel}</div>
                    <div className="bcard-meta">{user.name} · {formatGregDate(a.dateKey)}</div>
                    <div className="bcard-meta" style={{ color: 'var(--ink2)', fontWeight: 600 }}>
                      {a.startTime} {a.endTime && a.endTime !== a.startTime ? `– ${a.endTime}` : ''}
                    </div>
                  </div>
                  {a.grahaHora && a.grahaHora !== '—' && (
                    <span className={`gpill g-${a.grahaHora}`} style={{ fontSize: '10px' }}>{a.grahaHora}</span>
                  )}
                </div>
                
                {pd && (
                  <div className="bcard-detail">
                    <strong>{tithiName}</strong> · {pd.paksha} · {pd.month}
                    {a.notes && <><br /><span style={{ color: 'var(--muted)' }}>{a.notes}</span></>}
                    {pd.amrit && pd.amrit.length > 4 && <><br /><span style={{ color: 'var(--green)' }}>✦ Amrit: {pd.amrit}</span></>}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => handleDelete(a._id)} className="pm-btn-outline" style={{ fontSize: '10px', padding: '4px 10px', color: 'var(--red)', borderColor: '#fca5a5' }}>Remove</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* <PlanModal isOpen={planModalOpen} onClose={() => setPlanModalOpen(false)} refreshActivities={fetchActivities} /> */}
    </div>
  );
};

export default Activities;