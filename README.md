# 🗳️ University Online Voting System

A modern and secure **University Online Voting System** built with **Next.js**, **TypeScript**, **MongoDB**, and **Tailwind CSS**. The system provides a digital platform for managing university elections, allowing students to securely cast votes while giving administrators complete control over elections, candidates, positions, and results.

> ⚠️ **This project is currently under active development.**

---

# ✨ Features

## 🔐 Authentication
- JWT-based authentication
- Student and Admin login
- User registration
- Secure HTTP-only cookie authentication
- Password hashing with bcrypt
- Protected routes
- Session management
- Logout functionality
- Role-based authorization

---

## 🗳️ Election Management
- Create elections
- Update election details
- End elections
- Delete elections
- Election scheduling
- Active, Upcoming, and Ended election status
- Election management dashboard
- JWT-protected CRUD operations

---

## 👥 Candidate Management
- Candidate registration
- Candidate profiles
- Party affiliation
- Position assignment
- Biography and campaign platform

---

## 🎓 Student Management
- Student listing
- Student information retrieval
- Dashboard integration

---

## 📊 Super Admin Dashboard
- Dashboard overview
- Election statistics
- Voter turnout charts
- Votes per position charts
- Pending candidates section
- Recent elections
- Responsive sidebar navigation
- User profile section

---

## 🛡️ Security
- JWT Authentication
- Password hashing
- Protected API routes
- MongoDB validation
- Duplicate vote prevention (planned)
- Role-based authorization

---

# 🛠 Tech Stack

## Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Backend
- Next.js API Routes
- MongoDB
- Mongoose
- JWT
- bcrypt

## UI & Libraries
- next-themes
- Base UI
- Recharts
- Lucide React
- Sonner
- clsx
- tailwind-merge

---

# 📁 Project Structure

```text
app/
├── (auth)
│   ├── login
│   └── register
│
├── dashboard
│   ├── super-admin
│   ├── elections
│   └── students
│
├── api
│   ├── auth
│   ├── elections
│   ├── candidates
│   └── votes
│
actions/
components/
hooks/
lib/
models/
public/
```

---

# 🗄 Database Models

The project uses **MongoDB** with **Mongoose**.

### Current Models

- Admin
- Student
- Election
- Candidate
- Ballot
- Party
- Position

---

# 🔐 Authentication Flow

1. User registers.
2. Password is securely hashed using bcrypt.
3. User logs in.
4. JWT token is generated.
5. JWT is stored inside an HTTP-only cookie.
6. Protected routes validate the session.
7. User can securely log out.

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/codexstackdev/votingsystem.git
```

## Navigate into the project

```bash
cd university-online-voting-system
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

## Run the development server

```bash
npm run dev
```

---

# 📌 Current Progress

## ✅ Authentication

- Login API
- Registration API
- JWT Authentication
- Cookie Authentication
- Logout
- Protected Routes
- Form Validation
- MongoDB Connection

---

## ✅ Super Admin Dashboard

- Dashboard Overview
- Responsive Sidebar
- User Profile
- Logout
- Dashboard Cards
- Voter Turnout Chart
- Votes per Position Chart
- Pending Candidates
- Recent Elections

---

## ✅ Election Management

- Create Election
- Update Election
- Delete Election
- End Election
- Election CRUD API
- Dashboard Integration

---

## ✅ Student Management

- Students Page
- User Retrieval
- Dashboard Integration

---

## ✅ UI Components

- Button
- Card
- Input
- Label
- Select
- Textarea
- Dialog
- Alert Dialog
- Dropdown Menu
- Table
- Toast
- Spinner
- Theme Provider

---

## ✅ Database

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

## Completed

- [x] Authentication System
- [x] JWT Authentication
- [x] Registration
- [x] Login
- [x] Logout
- [x] Super Admin Dashboard
- [x] Dashboard Analytics
- [x] Election CRUD
- [x] Student Management

---

## In Progress

- [ ] Candidate CRUD
- [ ] Party CRUD
- [ ] Position CRUD
- [ ] Student Voting Portal
- [ ] Ballot Submission
- [ ] Duplicate Vote Protection

---

## Planned

- [ ] Live Election Results
- [ ] Election Countdown Timer
- [ ] PDF Report Generation
- [ ] CSV Export
- [ ] Audit Logs
- [ ] Email Notifications
- [ ] Election Analytics
- [ ] Mobile Responsive Improvements

---

# 📜 Changelog

## August 3, 2026

### feat(admin): Super Admin Dashboard

- Added Super Admin Dashboard
- Sidebar navigation
- Dashboard overview
- User profile section
- Logout functionality
- Dashboard cards
- Pending candidates section
- Recent elections panel
- Voter turnout chart using Recharts
- Votes per position chart

### feat(election): Election Management

- Added Election Management page
- Implemented Create Election
- Implemented Update Election
- Implemented Delete Election
- Implemented End Election
- JWT-protected Election CRUD APIs
- Dashboard integration

### feat(ui): Dashboard Improvements

- Added Alert Dialog component
- Added Dialog component
- Added Dropdown Menu
- Added Table component
- Added Textarea component
- Improved forms and UI interactions

### feat(students)

- Added Students page
- Added user information retrieval
- Integrated Students page into dashboard

---

## August 2, 2026

### feat(auth): Authentication System

- Added JWT authentication
- Implemented login API
- Implemented registration API
- Added authentication actions
- Created login UI
- Created registration UI
- Implemented MongoDB connection utility
- Added loading spinner
- Added reusable UI components
- Implemented Mongoose models:
  - Admin
  - Student
  - Election
  - Candidate
  - Ballot
  - Party
  - Position

### feat(ui): Theme Provider

- Added ThemeProvider using `next-themes`
- Created reusable Button component
- Added utility functions using `clsx` and `tailwind-merge`
- Configured shadcn/ui
- Updated project dependencies

### License

- Added GNU Affero General Public License v3 (AGPL-3.0)

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

If you'd like to contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push to your fork.
5. Open a Pull Request.

---

# 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

See the **LICENSE** file for more information.