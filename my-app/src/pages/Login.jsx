import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../pages/css/login.css';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryRole = new URLSearchParams(location.search).get('role') || '';
  const [role, setRole] = useState(queryRole);
  const [formType, setFormType] = useState('login');

  const [signupData, setSignupData] = useState({
    username: '',
    rollNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loginData, setLoginData] = useState({
    identifier: '',
    password: ''
  });

  useEffect(() => {
    const roleParam = new URLSearchParams(location.search).get('role');
    setRole(roleParam || '');
    setFormType('login');
  }, [location.search]);

  const isAdmin = role === 'admin';
  const isStudent = role === 'student';
  const isInternalStaff = role === 'internal-staff';
  const isExternalStaff = role === 'external-staff';
  const canSignup = role && !isAdmin;

  const isValidInstitutionEmail = (email) => {
    if (isStudent) {
      return (
        email.endsWith('@vivekananda@gmail.com') ||
        email.endsWith('@vivekanandacollege.ac.in')
      );
    }
    if (isInternalStaff) {
      return email.endsWith('@vivekanandacollege.ac.in');
    }
    return true; // External staff – allow any email
  };

  const normalizeRoleForBackend = () => {
    if (isInternalStaff || isExternalStaff) return 'staff';
    return role;
  };

  const getStaffType = () => {
    if (isInternalStaff) return 'internal';
    if (isExternalStaff) return 'external';
    return undefined;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isStudent && loginData.identifier.includes('@')) {
      alert("Students must use Roll Number, not Email.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...(isStudent
            ? { rollNumber: loginData.identifier }
            : { email: loginData.identifier }),
          password: loginData.password,
          role: normalizeRoleForBackend(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const user = result.user;

        if (!user || !user.role) {
          alert("Invalid login response: user data missing.");
          return;
        }

        // Staff type check
        if (user.role === 'staff') {
          if (
            (isInternalStaff && user.staffType !== 'internal') ||
            (isExternalStaff && user.staffType !== 'external')
          ) {
            alert(`You are not authorized to log in as ${role}`);
            return;
          }
        } else if (user.role !== role) {
          alert(`You are not authorized to log in as ${role}`);
          return;
        }

        alert("Login successful!");

        if (isStudent && user._id) {
          localStorage.setItem("studentId", user._id);
        }

        // Cookie for email or roll number
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);
        document.cookie = `loggedInEmail=${loginData.identifier}; expires=${expiryDate.toUTCString()}; path=/`;

        // Redirect
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'student') {
          navigate('/student/dashboard');
        } else if (user.role === 'staff') {
          if (user.staffType === 'internal') {
            navigate('/internal-staff/dashboard');
          } else if (user.staffType === 'external') {
            navigate('/external-staff/dashboard');
          } else {
            alert("Unknown staff type");
          }
        } else {
          alert("Unknown role");
        }
      } else {
        alert(result.error || result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, rollNumber, email, password, confirmPassword } = signupData;

    if (isAdmin) {
      alert("Admin signup not allowed.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (isStudent && !/^((UG|PG)\d{5,})$/i.test(rollNumber)) {
      alert("Invalid roll number (e.g., UG21096)");
      return;
    }

    if (!isValidInstitutionEmail(email)) {
      alert("Invalid institutional email format");
      return;
    }

    const roleToSend = normalizeRoleForBackend();
    const staffType = getStaffType();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          ...(isStudent && { rollNumber }),
          password,
          role: roleToSend,
          ...(staffType && { staffType })
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Signup successful! Please login.");
        setFormType('login');
        setSignupData({ username: '', rollNumber: '', email: '', password: '', confirmPassword: '' });
      } else {
        alert(result.error || result.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong during signup");
    }
  };

  const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  return (
    <div className="login-container">
      {formType === 'login' ? (
        <form className="form-box" onSubmit={handleLogin}>
          <h2>{role ? `${role.toUpperCase().replace('-', ' ')} LOGIN` : 'Login'}</h2>
          <input
            type={isStudent ? 'text' : 'email'}
            name="identifier"
            placeholder={isStudent ? 'Roll Number (e.g. UG21096)' : 'Email'}
            value={loginData.identifier}
            onChange={handleLoginChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
          {role && (
            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>
          )}
          <button type="submit">Login</button>
          {canSignup && (
            <p className="switch-form">
              Don&apos;t have an account? <span onClick={() => setFormType('signup')}>Sign Up</span>
            </p>
          )}
        </form>
      ) : (
        <form className="form-box" onSubmit={handleSignup}>
          <h2>{role ? `${role.toUpperCase().replace('-', ' ')} Signup` : 'Signup'}</h2>
          <input
            type="text"
            name="username"
            placeholder="Name"
            value={signupData.username}
            onChange={handleSignupChange}
            required
          />
          {isStudent && (
            <>
              <input
                type="text"
                name="rollNumber"
                placeholder="Roll Number (e.g. UG21096)"
                value={signupData.rollNumber}
                onChange={handleSignupChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Institutional Email"
                value={signupData.email}
                onChange={handleSignupChange}
                required
              />
            </>
          )}
          {!isStudent && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              required
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={signupData.password}
            onChange={handleSignupChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={signupData.confirmPassword}
            onChange={handleSignupChange}
            required
          />
          <button type="submit">Sign Up</button>
          <p className="switch-form">
            Already have an account? <span onClick={() => setFormType('login')}>Login</span>
          </p>
        </form>
      )}
    </div>
  );
}
