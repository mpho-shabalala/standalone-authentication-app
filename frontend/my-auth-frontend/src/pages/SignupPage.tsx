import React, { useState } from 'react'
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();
  const {signup} = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    contacts: "",
    confirmPassword: "",
  });

  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(form.password !== form.confirmPassword){
        setError('Passwords do not match');
        return;
    }
    const response = await signup(form.username, form.email, form.contacts, form.password);
    if (!response.success) setError(response.message || 'Failed to signup');
    else {
      console.log(response.message); // e.g., "Registration successful..."
      navigate('/verify-user');
    }
  }
  return (
    <div className="signup-container">
      <h2>Create Account</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="contacts"
          placeholder="Contacts"
          value={form.contacts}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignupPage