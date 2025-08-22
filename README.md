# Standalone Authentication System with JWT

A full-featured authentication system built with **Node.js**, **Express**, **JWT**, and **React**, supporting traditional and OAuth-based registration, email verification, password reset, and token-based session management.

---

## Features

- **User Registration & Login**
  - Sign up with email, username, password
  - Login with username and password
  - Password hashing with `bcrypt`
- **OAuth Support**
  - Google login and registration
- **Email Verification**
  - Verification token sent to user email upon registration
  - Token-based verification workflow
- **Password Reset**
  - Forgot password flow with reset token sent via email
  - Password reset endpoint with token validation
- **JWT Authentication**
  - Access and refresh tokens
  - Token refresh endpoint
  - Logout with token blacklisting
- **Frontend**
  - React + TypeScript context-based state management
  - Handles authentication state (`auth`) with localStorage
  - Error handling using try/catch and response objects
- **Security**
  - Passwords hashed with bcrypt
  - JWT tokens for authentication, refresh tokens for session management
  - Email verification to prevent unauthorized account creation

---

## Tech Stack

- **Backend:** Node.js, Express, JWT, bcrypt, Nodemailer
- **Frontend:** React, TypeScript, Axios
- **Database:** JSON files (for simplicity; can be swapped with MongoDB/PostgreSQL)
- **Authentication:** JWT access & refresh tokens
- **Email Service:** Gmail SMTP with Nodemailer
- **Environment Variables:** `.env` file for secrets and credentials

---

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend folder with:
   ```env
   PORT=5000
   EMAIL_USERNAME=your-gmail-address
   EMAIL_PASSWORD=your-app-password
   SESSION_SECRET=your-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5500/auth/google/callback
   PAGE_RECOVER_URL=http://localhost:5173
   SALT_ROUNDS=10
   JWT_SECRET=your-jwt-secret
   ```

3. **Frontend setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## Usage

### Backend

- Start the backend server:
  ```bash
  cd backend
  npm run dev
  ```
- Endpoints:
  - `POST /authentication/register` – register a new user
  - `POST /authentication/login` – login user
  - `POST /authentication/verify_user` – verify email token
  - `POST /authentication/forgot_password` – request password reset
  - `POST /reset_password` – reset password with token
  - `POST /refresh_token` – refresh access token
  - `POST /authentication/logout` – logout and blacklist token

### Frontend

- React app consumes authentication context
- Handles:
  - Signup
  - Login
  - Email verification notifications
  - Forgot password / reset password flow
  - JWT-based session management

---

## State Management & LocalStorage

- `auth` state stored in context and synced to `localStorage`
- Example structure:
  ```json
  {
    "email": "user@example.com",
    "isAuthenticated": false,
    "token": null,
    "refreshToken": null,
    "user": {
      "username": "username",
      "email": "user@example.com",
      "userID": "abc123"
    }
  }
  ```
- Pending verification email can be accessed directly from `auth.email` in localStorage.

---

## Notes

- **Email Security:** Ensure Gmail app password is used for sending emails. Standard Gmail passwords won’t work due to OAuth restrictions.
- **JWT Security:** Never expose the JWT secret in the frontend.
- **Error Handling:** Frontend catches backend errors via try/catch and displays messages appropriately.
- **OAuth Users:** Existing accounts are linked automatically if email matches.

---

## Future Improvements

- Switch from JSON database to MongoDB or PostgreSQL for scalability.
- Add rate limiting and brute-force protection on login endpoints.
- Implement role-based access control (RBAC) for protected routes.
- Add email templates and enhanced UI/UX for email verification and password reset.
- Add multi-factor authentication (MFA).

---

## License

MIT License

