// Login.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './css/Login.css';

export default function Login() {
  const location = useLocation();
  const queryRole = new URLSearchParams(location.search).get('role') || '';
  const [role, setRole] = useState(queryRole);
  const [formType, setFormType] = useState('login');

  useEffect(() => {
    const roleParam = new URLSearchParams(location.search).get('role');
    setRole(roleParam || '');
    setFormType('login'); // reset form type on role change
  }, [location.search]);

  const isAdmin = role === 'admin';
  const canSignup = role && !isAdmin;

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`Login as ${role}`);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log(`Signup as ${role}`);
  };

  return (
    <div className="login-container">
      {formType === 'login' ? (
        <form className="form-box" onSubmit={handleLogin}>
          <h2>{role ? `${role.toUpperCase()} Login` : 'Login'}</h2>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          {role && (
            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>
          )}
          <button type="submit">Login</button>
          {canSignup && (
            <p className="switch-form">
              Don't have an account?{' '}
              <span onClick={() => setFormType('signup')}>Sign Up</span>
            </p>
          )}
        </form>
      ) : (
        <form className="form-box" onSubmit={handleSignup}>
          <h2>{role ? `${role.toUpperCase()} Signup` : 'Signup'}</h2>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <button type="submit">Sign Up</button>
          <p className="switch-form">
            Already have an account?{' '}
            <span onClick={() => setFormType('login')}>Login</span>
          </p>
        </form>
      )}
    </div>
  );
}
