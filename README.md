# Interview Prep App – Frontend

A modern React + Vite frontend for the Interview Prep App, providing a seamless user experience for technical interview practice.

---

## 🚀 Features

- **Authentication** – Register, login, and manage user sessions
- **Dashboard** – View and manage interview sessions
- **AI-Powered Interview Prep** – Generate and practice with AI-generated questions
- **Profile Management** – Upload and update profile images
- **Responsive UI** – Built with modern React and Tailwind CSS

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router DOM

---

## 📋 Prerequisites

- Node.js 18 or higher
- Backend API running (see backend/README.md)

---

## 🏠 Local Development

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API Base URL

Edit `src/utils/apiPaths.js` to set the correct backend API URL if needed.

### 4. Start the development server

```bash
npm run dev
```

---

## 🌐 Deployment

- **Frontend Live:** [https://prepwiz.vercel.app](https://prepwiz.vercel.app)
- **Backend Live:** [https://interview-prep-backend-2q25.onrender.com](https://interview-prep-backend-2q25.onrender.com)

---

## 📁 Project Structure

```
frontend/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images and icons
│   ├── components/        # Reusable UI components
│   ├── context/           # React Context for user state
│   ├── pages/             # Page components (Auth, Dashboard, InterviewPrep, etc.)
│   ├── utils/             # API helpers, data, etc.
│   └── App.jsx            # Main app entry
├── index.html
└── vite.config.js
```

---

## 🔗 API Integration

- All API requests are handled via Axios with automatic JWT token management.
- On 401 errors, users are redirected to login.

---

## 🧑‍💻 Development Tips

- Use `npm run lint` to check for code style issues.
- Customize Tailwind CSS in `tailwind.config.js` as needed.
- For production builds, use `npm run build`.
