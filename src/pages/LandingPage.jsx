import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import Modal from "../components/Loader/Modal.jsx";
import Login from "./Auth/Login.jsx";
import SignUp from "./Auth/SignUp.jsx";
import { useUserContext } from "../context/userContext.jsx";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard.jsx";

const LandingPage = () => {
  const { user, loading } = useUserContext();
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if(!user){
      setOpenAuthModal(true);
      setCurrentPage("signup");
    } else {
      navigate("/dashboard");
    }
  };

  const handleClose = () => {
    setOpenAuthModal(false);
    setCurrentPage("login");
  };

  return (
    <div className="min-h-screen bg-[#FFFCEF] relative overflow-x-hidden">
      {/* Background gradient */}
      <div className="w-[500px] h-[500px] bg-amber-200/20 blur-[150px] absolute top-0 left-0 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center py-6">
          <div className="text-xl font-extrabold bg-gradient-to-r from-[#FF9324] to-[#e99a4b] bg-clip-text text-transparent">
            PrepWiz
          </div>
          <div>
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:shadow-md transition-all duration-200"
                onClick={() => {
                  setOpenAuthModal(true);
                  setCurrentPage("login");
                }}
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="py-20">
          <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
            <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
              {/* <div className="inline-flex items-center gap-2 text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300 mb-4">
                <LuSparkles /> AI Powered
              </div> */}
              <h1 className="text-4xl md:text-5xl text-black font-medium leading-tight mb-6">
                Ace Interviews with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9324] to-[#e99a4b] font-semibold">
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize your learning with
                personal notes.
              </p>
              <button
                className="bg-black text-sm font-semi bold text-white px-8 py-3 rounded-full hover:bg-gray-900 transition-all duration-200"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>

            
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={handleClose}
        hideHeader
      >
        <div className="p-2">
          {currentPage === "login" && (
            <Login 
              setCurrentPage={setCurrentPage} 
              onClose={handleClose}
            />
          )}
          {currentPage === "signup" && (
            <SignUp 
              setCurrentPage={setCurrentPage} 
              onClose={handleClose}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;