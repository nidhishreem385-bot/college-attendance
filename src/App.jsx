import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'teacher'

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`Logging in as ${role} with:`, email);
  };

  return (
    <div id="root">
      {/* Header / Navbar */}
      <header style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '1.1rem' }}>
          RIT Attendance Portal
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setRole('student')} 
            style={{ 
              background: role === 'student' ? 'var(--accent-bg)' : 'transparent', 
              color: role === 'student' ? 'var(--accent)' : 'var(--text)', 
              border: `1px solid ${role === 'student' ? 'var(--accent-border)' : 'var(--border)'}`, 
              padding: '6px 14px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Student
          </button>
          <button 
            onClick={() => setRole('teacher')} 
            style={{ 
              background: role === 'teacher' ? 'var(--accent-bg)' : 'transparent', 
              color: role === 'teacher' ? 'var(--accent)' : 'var(--text)', 
              border: `1px solid ${role === 'teacher' ? 'var(--accent-border)' : 'var(--border)'}`, 
              padding: '6px 14px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Teacher
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        <h1>Rajeev Institute of Technology</h1>
        <p style={{ maxWidth: '500px', marginBottom: '32px' }}>
          Welcome to the official responsive attendance portal. Please sign in with your college credentials to track or view records.
        </p>

        {/* Login Card */}
        <div style={{ 
          background: 'var(--bg)', 
          border: '1px solid var(--border)', 
          padding: '32px', 
          borderRadius: '12px', 
          boxShadow: 'var(--shadow)', 
          width: '100%', 
          maxWidth: '420px',
          boxSizing: 'border-box',
          textAlign: 'left'
        }}>
          <h2>{role === 'student' ? 'Student Login' : 'Teacher Login'}</h2>
          <p style={{ fontSize: '15px', marginBottom: '24px' }}>Enter your institutional email ID below.</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: 'var(--text-h)', fontWeight: 500 }}>
                College Email ID
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@rit.edu" 
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border)', 
                  background: 'var(--code-bg)', 
                  color: 'var(--text-h)',
                  boxSizing: 'border-box',
                  outline: 'none',
                  font: 'inherit',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: 'var(--text-h)', fontWeight: 500 }}>
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
                  padding: '12px 16px', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border)', 
                  background: 'var(--code-bg)', 
                  color: 'var(--text-h)',
                  boxSizing: 'border-box',
                  outline: 'none',
                  font: 'inherit',
                  fontSize: '16px'
                }}
              />
            </div>

            <button 
              type="submit" 
              style={{ 
                marginTop: '8px',
                background: 'var(--accent)', 
                color: '#fff', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '6px', 
                fontWeight: 600, 
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'opacity 0.2s'
              }}
            >
              Sign In
            </button>
          </form>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ padding: '24px', borderTop: '1px solid var(--border)', fontSize: '14px' }}>
        <p>&copy; 2026 Rajeev Institute of Technology &bull; Secure System</p>
      </footer>
    </div>
  );
}

export default App;
