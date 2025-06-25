import React from "react"; 
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import{Toaster} from "react-hot-toast";
import { UserContextProvider } from "./context/userContext";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import TestPage from "./pages/InterviewPrep/TestPage";
import FeedbackPage from "./pages/InterviewPrep/FeedbackPage";


const App = () => {
  return (
    <UserContextProvider>
    <Router>
      <Toaster
        toastOptions={{
          className: '',
          style: {
            fontSize: '13px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
        <Route path="/interview-prep/:sessionId/test" element={<TestPage />} />
        <Route path="/interview-prep/:sessionId/feedback" element={<FeedbackPage />} />


      </Routes>
    </Router>
    </UserContextProvider>
  );
}

export default App;