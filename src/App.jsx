import React, { useState, useEffect } from 'react';
import { sectionsData } from './data/students';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [user, setUser] = useState(null);

  // Teacher Dashboard timetable-aligned state
  const [selectedDay, setSelectedDay] = useState('THU'); // Default to Thursday based on current mock date context
  const [selectedSlot, setSelectedSlot] = useState('09:00 AM - 10:00 AM');
  const [selectedCourse, setSelectedCourse] = useState('Software Engineering & Project Management (SE&PM - BCS501)');
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [attendance, setAttendance] = useState({});

  // Timetable slots mapped with start times (24h format)
  const slotTimings = {
    '09:00 AM - 10:00 AM': { startHour: 9, startMin: 0 },
    '10:00 AM - 11:00 AM': { startHour: 10, startMin: 0 },
    '11:15 AM - 12:15 PM': { startHour: 11, startMin: 15 },
    '12:15 PM - 01:15 PM': { startHour: 12, startMin: 15 },
    '02:05 PM - 03:00 PM': { startHour: 14, startMin: 5 },
    '03:00 PM - 04:00 PM': { startHour: 15, startMin: 0 },
    '04:00 PM - 05:00 PM': { startHour: 16, startMin: 0 },
  };

  const displayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Student Portal Search State
  const [searchSRN, setSearchSRN] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [hasSearched, setHasSearched] = useState(false);

  // Official RIT 5th Semester Subjects & Labs from timetable
  const studentRecords = [
    { subject: 'Software Engineering & Project Management (SE&PM - BCS501)', attended: 22, total: 25 },
    { subject: 'Computer Networks (CN - BCS502)', attended: 20, total: 24 },
    { subject: 'Theory of Computation (TOC - BCS503)', attended: 24, total: 25 },
    { subject: 'Web Technology Lab (WEB LAB - BCSL504)', attended: 12, total: 12 },
    { subject: 'Artificial Intelligence (AI - BCS515B)', attended: 19, total: 22 },
    { subject: 'Research Methodology (RM - BCS507)', attended: 15, total: 16 },
    { subject: 'Environmental Studies (ES - BCS508)', attended: 14, total: 15 }
  ];

  // Window Check: Opens at class start time, Locks 15 minutes after class begins (e.g. 9:00 to 9:15 AM)
  const getWindowStatus = () => {
    const timing = slotTimings[selectedSlot];
    if (!timing) return { status: 'CLOSED', message: 'Invalid slot' };

    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeVal = currentHour * 60 + currentMin;

    // Open time: Exact start time
    let openMinTotal = timing.startHour * 60 + timing.startMin;
    // Lock time: Start time + 15 mins
    let lockMinTotal = openMinTotal + 15;

    if (currentTimeVal < openMinTotal) {
      return { status: 'NOT_OPEN_YET', message: '🔒 Attendance opens when class starts' };
    } else if (currentTimeVal > lockMinTotal) {
      return { status: 'LOCKED', message: '🔒 Attendance locked (15 mins past class start)' };
    } else {
      return { status: 'ACTIVE', message: '🟢 Active (Locks 15 mins after start)' };
    }
  };

  const windowState = getWindowStatus();
  const isActionDisabled = windowState.status !== 'ACTIVE';

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ email, role });
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    setSearchSRN('');
    setHasSearched(false);
  };

  const toggleAttendance = (studentId) => {
    if (isActionDisabled) {
      alert(`Cannot modify: ${windowState.message}`);
      return;
    }

    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Absent' ? 'Present' : 'Absent'
    }));
  };

  const handleSaveAttendance = () => {
    if (isActionDisabled) {
      alert(`Cannot save: ${windowState.message}`);
      return;
    }

    alert(`Attendance for ${selectedSection} (${selectedCourse} | ${selectedSlot}) saved successfully!`);
  };

  const handleStudentSearch = (e) => {
    e.preventDefault();
    if (!searchSRN.trim()) {
      alert('Please enter a valid SRN');
      return;
    }
    setHasSearched(true);
  };

  // Calculate overall aggregate attendance
  const totalAttendedAll = studentRecords.reduce((acc, curr) => acc + curr.attended, 0);
  const totalClassesAll = studentRecords.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage = totalClassesAll > 0 ? ((totalAttendedAll / totalClassesAll) * 100).toFixed(1) : 0;

  // 1. Student Portal View
  if (user && user.role === 'student') {
    const filteredRecords = filterSubject === 'All' 
      ? studentRecords 
      : studentRecords.filter(r => r.subject === filterSubject);

    return (
      <div id="root">
        <header style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '1rem' }}>RIT Student Portal</div>
          <button onClick={handleLogout} style={{ background: 'var(--code-bg)', color: 'var(--text-h)', border: '1px solid var(--border)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
            Sign Out
          </button>
        </header>
        <main style={{ flex: 1, padding: '40px 20px', textAlign: 'left', maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>Student Dashboard</h1>
          <p style={{ marginBottom: '24px', color: 'var(--text)', fontSize: '14px' }}>Logged in as: {user.email}</p>

          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Search Attendance Record</h2>
            <form onSubmit={handleStudentSearch} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
              <input 
                type="text" 
                value={searchSRN}
                onChange={(e) => setSearchSRN(e.target.value)}
                placeholder="Enter your SRN (e.g. RIT001)"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--code-bg)', color: 'var(--text-h)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
              <button 
                type="submit"
                style={{ background: 'var(--text-h)', color: 'var(--bg)', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
              >
                Search
              </button>
            </form>
          </div>

          {hasSearched && (
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>Attendance Overview</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text)' }}>SRN: <strong style={{ color: 'var(--text-h)' }}>{searchSRN.toUpperCase()}</strong></p>
                </div>
                <div>
                  <select 
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--code-bg)', color: 'var(--text-h)', fontSize: '13px', outline: 'none' }}
                  >
                    <option value="All">All Subjects (Overall)</option>
                    {studentRecords.map(r => (
                      <option key={r.subject} value={r.subject}>{r.subject}</option>
                    ))}
                  </select>
                </div>
              </div>

              {filterSubject === 'All' && (
                <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', padding: '16px 20px', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '2px' }}>Overall Cumulative Score</div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-h)' }}>Total Classes Attended: {totalAttendedAll} / {totalClassesAll}</div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-h)' }}>
                    {overallPercentage}%
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredRecords.map((record, index) => {
                  const subjectPercentage = ((record.attended / record.total) * 100).toFixed(1) + '%';
                  return (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--code-bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-h)', marginBottom: '2px' }}>{record.subject}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text)' }}>Classes Attended: {record.attended} / {record.total}</div>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-h)' }}>
                        {subjectPercentage}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // 2. Teacher Portal View (Timetable aligned with 15-min lock rule)
  if (user && user.role === 'teacher') {
    const currentStudents = sectionsData?.[selectedSection] || [
      { id: 1, name: 'Aarav Sharma', roll: '01' },
      { id: 2, name: 'Aditi Verma', roll: '02' },
      { id: 3, name: 'Rahul Kumar', roll: '03' },
      { id: 4, name: 'Sneha Patel', roll: '04' }
    ];

    return (
      <div id="root">
        <header style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '1rem' }}>RIT Teacher Portal &bull; 5th Sem "B"</div>
          <button onClick={handleLogout} style={{ background: 'var(--code-bg)', color: 'var(--text-h)', border: '1px solid var(--border)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
            Sign Out
          </button>
        </header>
        <main style={{ flex: 1, padding: '40px 20px', textAlign: 'left', maxWidth: '850px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Faculty Dashboard</h1>
              <p style={{ color: 'var(--text)', fontSize: '14px' }}>Logged in as Professor: {user.email}</p>
            </div>
            <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', color: 'var(--text-h)', fontWeight: 500 }}>
              Date: {displayDate}
            </div>
          </div>

          {/* Timetable Selection Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '16px', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-h)', fontWeight: 500 }}>Day</label>
              <select 
                value={selectedDay} 
                onChange={(e) => setSelectedDay(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--code-bg)', color: 'var(--text-h)', fontSize: '13px', outline: 'none' }}
              >
                <option value="MON">Monday</option>
                <option value="TUE">Tuesday</option>
                <option value="WED">Wednesday</option>
                <option value="THU">Thursday</option>
                <option value="FRI">Friday</option>
                <option value="SAT">Saturday</option>
              </select>
            </div>

            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '16px', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-h)', fontWeight: 500 }}>Time Slot</label>
              <select 
                value={selectedSlot} 
                onChange={(e) => setSelectedSlot(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--code-bg)', color: 'var(--text-h)', fontSize: '13px', outline: 'none' }}
              >
                {Object.keys(slotTimings).map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '16px', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-h)', fontWeight: 500 }}>Section</label>
              <select 
                value={selectedSection} 
                onChange={(e) => setSelectedSection(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--code-bg)', color: 'var(--text-h)', fontSize: '13px', outline: 'none' }}
              >
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
                <option value="Section C">Section C</option>
              </select>
            </div>
          </div>

          {/* Subject Selector */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow)', marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: 'var(--text-h)', fontWeight: 500 }}>Select Subject / Course / Lab</label>
            <select 
              value={selectedCourse} 
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--code-bg)', color: 'var(--text-h)', fontSize: '14px', outline: 'none' }}
            >
              <option>Software Engineering & Project Management (SE&PM - BCS501)</option>
              <option>Computer Networks (CN - BCS502)</option>
              <option>Theory of Computation (TOC - BCS503)</option>
              <option>Web Technology Lab (WEB LAB - BCSL504)</option>
              <option>Artificial Intelligence (AI - BCS515B)</option>
              <option>Mini Project (PROJ - BCS586)</option>
              <option>Research Methodology (RM - BCS507)</option>
              <option>Environmental Studies (ES - BCS508)</option>
              <option>Physical Education (PE - BCS509)</option>
            </select>
          </div>

          {/* Roster Card */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>Attendance Roster</h2>
                <p style={{ fontSize: '13px', color: 'var(--text)' }}>{selectedDay} | {selectedSlot} | {selectedSection}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: windowState.status === 'ACTIVE' ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
                  {windowState.message}
                </span>
                <button 
                  onClick={handleSaveAttendance}
                  disabled={isActionDisabled}
                  style={{ 
                    background: isActionDisabled ? 'var(--code-bg)' : 'var(--text-h)', 
                    color: isActionDisabled ? 'var(--text)' : 'var(--bg)', 
                    border: 'none', 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    fontWeight: 600, 
                    cursor: isActionDisabled ? 'not-allowed' : 'pointer', 
                    fontSize: '14px',
                    opacity: isActionDisabled ? 0.6 : 1
                  }}
                >
                  Save Attendance
                </button>
              </div>
            </div>

            {isActionDisabled && (
              <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', marginBottom: '16px', color: '#ef4444', fontSize: '13px' }}>
                Note: Attendance opens at class start time and is strictly locked 15 minutes after the class begins.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentStudents.map(student => {
                const status = attendance[student.id] || 'Present';
                return (
                  <div key={student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--code-bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-h)', fontSize: '14px' }}>
                      {student.name} <span style={{ color: 'var(--text)', fontSize: '13px' }}>(Roll: {student.roll})</span>
                    </span>
                    <button 
                      onClick={() => toggleAttendance(student.id)}
                      disabled={isActionDisabled}
                      style={{ 
                        background: status === 'Present' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: status === 'Present' ? '#22c55e' : '#ef4444',
                        border: `1px solid ${status === 'Present' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: isActionDisabled ? 'not-allowed' : 'pointer',
                        opacity: isActionDisabled ? 0.6 : 1
                      }}
                    >
                      {status}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. Default Login Screen View
  return (
    <div id="root">
      <header style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '1rem', letterSpacing: '-0.01em' }}>
          RIT Attendance Portal
        </div>
        <div style={{ display: 'flex', gap: '8px', background: 'var(--code-bg)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <button 
            onClick={() => setRole('student')} 
            style={{ 
              background: role === 'student' ? 'var(--bg)' : 'transparent', 
              color: role === 'student' ? 'var(--text-h)' : 'var(--text)', 
              border: 'none', 
              padding: '6px 14px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '14px',
              boxShadow: role === 'student' ? 'var(--shadow)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Student
          </button>
          <button 
            onClick={() => setRole('teacher')} 
            style={{ 
              background: role === 'teacher' ? 'var(--bg)' : 'transparent', 
              color: role === 'teacher' ? 'var(--text-h)' : 'var(--text)', 
              border: 'none', 
              padding: '6px 14px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '14px',
              boxShadow: role === 'teacher' ? 'var(--shadow)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Teacher
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        <h1 style={{ textAlign: 'center', maxWidth: '700px' }}>Rajeev Institute of Technology</h1>
        <p style={{ maxWidth: '480px', marginBottom: '40px', textAlign: 'center', color: 'var(--text)' }}>
          Official responsive attendance portal. Sign in with your institutional credentials to access your workspace.
        </p>

        <div style={{ 
          background: 'var(--bg)', 
          border: '1px solid var(--border)', 
          padding: '32px', 
          borderRadius: '12px', 
          boxShadow: 'var(--shadow)', 
          width: '100%', 
          maxWidth: '400px',
          boxSizing: 'border-box',
          textAlign: 'left'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '6px' }}>{role === 'student' ? 'Student Login' : 'Teacher Login'}</h2>
          <p style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '24px' }}>Enter your college email and password below.</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--text-h)', fontWeight: 500 }}>
                Email Address
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@rit.edu" 
                required
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border)', 
                  background: 'var(--code-bg)', 
                  color: 'var(--text-h)',
                  boxSizing: 'border-box',
                  outline: 'none',
                  font: 'inherit',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--text-h)', fontWeight: 500 }}>
                Password
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border)', 
                  background: 'var(--code-bg)', 
                  color: 'var(--text-h)',
                  boxSizing: 'border-box',
                  outline: 'none',
                  font: 'inherit',
                  fontSize: '14px'
                }}
              />
            </div>

            <button 
              type="submit" 
              style={{ 
                marginTop: '8px',
                background: 'var(--text-h)', 
                color: 'var(--bg)', 
                border: 'none', 
                padding: '10px 16px', 
                borderRadius: '8px', 
                fontWeight: 600, 
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'opacity 0.2s'
              }}
            >
              Sign In
            </button>
          </form>
        </div>

      </main>

      <footer style={{ padding: '24px', borderTop: '1px solid var(--border)', fontSize: '13px', color: 'var(--text)' }}>
        <p>&copy; 2026 Rajeev Institute of Technology &bull; Secure Portal</p>
      </footer>
    </div>
  );
}

export default App;
