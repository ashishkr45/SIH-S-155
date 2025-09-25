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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Home Page</h1>

      {/* Main Action Buttons */}
      {!action && (
        <div className="flex gap-6">
          <button
            onClick={() => setAction("login")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => setAction("signup")}
            className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700"
          >
            Signup
          </button>
        </div>
      )}

      {/* Role Selection */}
      {action && (
        <div className="flex flex-col items-center mt-6">
          <p className="mb-4 text-lg font-medium">
            Are you a Student or Teacher?
          </p>
          <div className="flex gap-6">
            <button
              onClick={() => handleRoleClick("student")}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700"
            >
              Student
            </button>
            <button
              onClick={() => handleRoleClick("teacher")}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl shadow-md hover:bg-orange-700"
            >
              Teacher
            </button>
          </div>

          {/* Back Button */}
          <button
            onClick={() => setAction(null)}
            className="mt-6 text-sm text-gray-600 underline hover:text-gray-800"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
