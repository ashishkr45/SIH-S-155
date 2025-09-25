import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [action, setAction] = useState(null); // "login" or "signup"
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    if (action === "login") {
      navigate(`/login/${role}`);
    } else if (action === "signup") {
      navigate(`/signup/${role}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-6 shadow-md">
        <h1 className="text-3xl font-bold text-black">
          SIH: Smart Curriculum
        </h1>
        <div className="flex gap-6">
          <button
            onClick={() => setAction("login")}
            className="px-6 py-2 font-semibold text-black border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all duration-300"
          >
            Login
          </button>
          <button
            onClick={() => setAction("signup")}
            className="px-6 py-2 font-semibold text-white bg-black rounded-xl hover:bg-gray-900 transition-all duration-300"
          >
            Signup
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className={`flex flex-col items-center justify-center flex-1 text-center px-6 transition-all duration-300 ${
          action ? "blur-sm" : ""
        }`}
      >
        <h2 className="text-5xl font-extrabold text-black mb-6">
          Smart Curriculum Activity & Attendance App
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mb-10">
          Many educational institutions still rely on manual attendance systems, 
          wasting valuable instructional hours and reducing student productivity. 
          Our platform automates attendance using face recognition and suggests 
          personalized academic tasks during free periods, helping students manage 
          time efficiently and achieve long-term goals.
        </p>
        <button
          onClick={() => setAction("signup")}
          className="px-8 py-4 bg-black text-white rounded-3xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          Get Started
        </button>
      </div>

      {/* Role Selection Modal */}
      {action && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center max-w-md w-full animate-scaleIn"
          >
            <h2 className="text-2xl font-bold mb-6">
              {action === "login" ? "Login as" : "Signup as"}
            </h2>
            <div className="flex gap-6">
              <button
                onClick={() => handleRoleClick("student")}
                className="px-8 py-3 bg-black text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Student
              </button>
              <button
                onClick={() => handleRoleClick("teacher")}
                className="px-8 py-3 bg-gray-100 text-black font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-300"
              >
                Teacher
              </button>
            </div>
            <button
              onClick={() => setAction(null)}
              className="mt-6 text-gray-500 hover:text-gray-900 underline text-sm transition-colors duration-300"
            >
              ← Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
