import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from './routes/PrivateRoute';
import { Link, Route, Routes } from 'react-router-dom'
import VerifyUserPage from './pages/VerifyUserPage';
function App() {

  return (
    <>
      <div>
        <nav>
        <Link to="/login">Login</Link> |{" "}
        <Link to="/signup">Signup</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        
           
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-user" element={<VerifyUserPage />} />
        <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
        } />
      </Routes>
      </div>
    </>
  )
}

export default App
