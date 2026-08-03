# 🗳️ University Online Voting System

A modern and secure **University Online Voting System** built with **Next.js**, **TypeScript**, **MongoDB**, and **Tailwind CSS**. The system provides a digital platform for managing university elections, allowing students to securely cast votes while giving administrators complete control over elections, candidates, and results.

> ⚠️ This project is currently under active development.

---

## ✨ Features

### 🔐 Authentication
- JWT-based authentication
- Student and Admin login
- User registration
- Secure HTTP-only cookie authentication
- Form validation
- Protected routes
- Session management

### 🗳️ Election Management
- Create and manage elections
- Election scheduling
- Active, Upcoming, and Ended election status
- Position management
- Partylist management

### 👥 Candidate Management
- Register candidates
- Candidate profiles
- Party affiliation
- Position assignment
- Biography and campaign platform

### 🎓 Student Portal
- Secure login
- View active elections
- Browse candidates
- Vote securely
- View voting progress

### 🛡️ Security
- JWT authentication
- Password hashing
- Duplicate vote prevention
- Role-based authorization
- MongoDB validation

---

# 🛠 Tech Stack

### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

### Backend
- Next.js API Routes
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

### UI
- next-themes
- Base UI
- Lucide Icons
- Sonner Toasts

---

# 📁 Project Structure

```
app/
├── (auth)
│   ├── login
│   └── register
│
├── dashboard
├── api
│   ├── auth
│   ├── elections
│   ├── candidates
│   └── votes
│
components/
lib/
models/
actions/
hooks/
public/
```

---

# 🗄 Database Models

The project uses MongoDB with Mongoose.

### Models

- Admin
- Student
- Election
- Candidate
- Ballot
- Party
- Position

---

# 🔐 Authentication Flow

- User registers
- Password is securely hashed
- User logs in
- JWT token is generated
- Token is stored inside an HTTP-only cookie
- Protected routes validate authentication

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/yourusername/university-voting-system.git
```

## Install dependencies

```bash
npm install
```

## Configure environment variables

Create a `.env.local` file.

```env
MONGODB_URI=

JWT_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Run development server

```bash
npm run dev
```

---

# 📌 Current Progress

## Authentication

- ✅ Login API
- ✅ Registration API
- ✅ JWT Authentication
- ✅ Cookie-based Authentication
- ✅ Login UI
- ✅ Registration UI
- ✅ Form Validation
- ✅ MongoDB Connection

---

## UI Components

- ✅ Button
- ✅ Card
- ✅ Input
- ✅ Label
- ✅ Select
- ✅ Toast
- ✅ Spinner
- ✅ Theme Provider

---

## Database

Implemented Mongoose schemas for:

- Admin
- Student
- Election
- Candidate
- Ballot
- Party
- Position

---

# 📅 Roadmap

- [ ] Student Dashboard
- [ ] Admin Dashboard
- [ ] Election CRUD
- [ ] Position CRUD
- [ ] Party CRUD
- [ ] Candidate CRUD
- [ ] Voting System
- [ ] Duplicate Vote Protection
- [ ] Election Timer
- [ ] Live Results
- [ ] Analytics Dashboard
- [ ] PDF Report Generation
- [ ] CSV Export
- [ ] Audit Logs

---

# 📜 Changelog

## August 2, 2026

### feat(auth): Implement login and registration with JWT authentication

- Added POST login route with JWT generation
- Implemented registration endpoint
- Added login and registration UI
- Created authentication actions
- Established MongoDB connection utility
- Added reusable UI components
- Added loading spinner component
- Implemented Mongoose models:
  - Admin
  - Student
  - Election
  - Candidate
  - Ballot
  - Party
  - Position

### feat(ui): Theme provider and reusable button component

- Added ThemeProvider using `next-themes`
- Created reusable Button component
- Added utility helpers using `clsx` and `tailwind-merge`
- Configured shadcn/ui
- Updated project dependencies

### License

- Added GNU Affero General Public License v3 (AGPL-3.0)

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.

---

# 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

See the LICENSE file for more information.