// Paste the full PD object from your vanilla app below. Sample entries illustrate shape.

const weekdayFor = (dk) => {
  const d = new Date(parseInt(dk.slice(0, 4), 10), parseInt(dk.slice(4, 6), 10) - 1, parseInt(dk.slice(6, 8), 10));
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
};

const base = (dk, o = {}) => ({
  sr: '06:15 AM',
  ss: '06:15 PM',
  samvat: 'Vikram 2082 · Shaka 1948',
  tithi: 'Pratipada',
  paksha: 'Shukla Paksha',
  nakshatra: 'Ashwini',
  yoga: 'Siddhi',
  weekday: weekdayFor(dk),
  varjyam: 'None',
  amrit: '10:15 AM to 11:45 AM',
  rahu: 'None',
  festivals: [],
  isNewYear: false,
  ...o,
});

export const PD = {
  '20260301': base('20260301', { month: 'Phalguna', pm: 'Phalguna', tithi: 'Tritiya', paksha: 'Krishna Paksha', nakshatra: 'Hasta' }),
  '20260302': base('20260302', { month: 'Phalguna', pm: 'Phalguna', tithi: 'Chaturthi', paksha: 'Krishna Paksha', nakshatra: 'Chitra' }),
  '20260303': base('20260303', { month: 'Phalguna', pm: 'Phalguna', tithi: 'Panchami', paksha: 'Krishna Paksha', nakshatra: 'Swati' }),
  '20260304': base('20260304', {
    month: 'Phalguna',
    pm: 'Phalguna',
    sr: '06:33 AM',
    ss: '06:23 PM',
    tithi: 'Shashthi',
    paksha: 'Krishna Paksha',
    nakshatra: 'Vishakha',
    festivals: ['Sample festival'],
  }),
  '20260327': base('20260327', { month: 'Chaitra', pm: 'Chaitra', tithi: 'Pratipada', paksha: 'Shukla Paksha', nakshatra: 'Ashwini', isNewYear: true }),
  '20260328': base('20260328', { month: 'Chaitra', pm: 'Chaitra', tithi: 'Dwitiya', paksha: 'Shukla Paksha', nakshatra: 'Bharani' }),
  '20260329': base('20260329', { month: 'Chaitra', pm: 'Chaitra', tithi: 'Tritiya', paksha: 'Shukla Paksha', nakshatra: 'Krittika' }),
  '20260330': base('20260330', { month: 'Chaitra', pm: 'Chaitra', tithi: 'Chaturthi', paksha: 'Shukla Paksha', nakshatra: 'Rohini' }),
  '20260331': base('20260331', { month: 'Chaitra', pm: 'Chaitra', tithi: 'Panchami', paksha: 'Shukla Paksha', nakshatra: 'Mrigashira' }),
  '20260401': base('20260401', { month: 'Chaitra', pm: 'Chaitra', tithi: 'Shashthi', paksha: 'Shukla Paksha', nakshatra: 'Ardra' }),
  '20260402': base('20260402', { month: 'Chaitra', pm: 'Chaitra', tithi: 'Saptami', paksha: 'Shukla Paksha', nakshatra: 'Punarvasu' }),
  '20270407': base('20270407', {
    month: 'Chaitra',
    pm: 'Chaitra',
    sr: '05:08 AM',
    ss: '05:42 PM',
    tithi: 'Ekadashi',
    paksha: 'Shukla Paksha',
  }),
};
