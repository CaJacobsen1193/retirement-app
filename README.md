# Retirement App

A simple React single-page application to help assisted-living staff and residents stay connected.  
Provides role-based login, resident selection, and pages for community updates, personal profiles, schedules, and service requests.

---

## 📋 Features

- **Role Selection & Login**  
  Choose “User”, “Resident”, or “Residential Employee” and log in via email/password.  
- **Resident Directory**  
  Browse all residents, see room numbers and unread request counts.  
- **Feed**  
  - **Community Updates**: Announcements & events posted by staff  
  - **My Updates**: Personal posts, photos, likes & comments  
- **Profile**  
  - View name, age, room  
  - Tabs for current medications, interests, and photo gallery  
- **Schedule**  
  - Day/Week/Month views of medical appointments & community activities  
- **Requests**  
  - Submit “Item” or “Visit” requests  
  - Mark requests complete with confirmation modal  

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm (v14+)
- A modern browser

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-org/retirement-app.git
   cd retirement-app
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the dev server**
   ```bash
   npm start
   ```
4. **Open browser**
   Navigate to `http://localhost:3000`

## 🗂️ Project Structure
```kotlin
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Feed.js
│   │   ├── LandingPage.js
│   │   ├── Login.js
│   │   ├── Profile.js
│   │   ├── Requests.js
│   │   ├── Residents.js
│   │   ├── Schedule.js
│   │   ├── Sidebar.js
│   │   ├── Layout.js
│   │   └── PostCard.js
│   └── data/
│       └── requests.js
└── package.json
```

## ⚙️ How It Works
1. **LandingPage**
   Select your role; stored in `localStorage`
2. **Login**
   Simple form to navigate resident list on submit.
3. **Residents**
   Shows all residents with profile pictures and unread request badge.
4. **Sidebar & Layout
   Persistent navigation to Feed, Profile, Schedule, Requests
5. **Feed/Profile/Schedule/Requests**
   All data is mocked in-memory; updates persist only until page refresh
