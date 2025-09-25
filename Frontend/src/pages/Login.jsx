import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Login = () => {
  const { role } = useParams(); // student or teacher
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password, role }, // include role
        { withCredentials: true }
      );

      setMessage(res.data.message);

      if (res.data.success) {
        setTimeout(() => {
          if (role === "student") {
            navigate("/student-dashboard");
          } else if (role === "teacher") {
            navigate("/teacher-dashboard");
          } else {
            navigate("/"); // fallback
          }
        }, 1000);
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* Login Card */}
      <div className="bg-white border border-gray-200 p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-black tracking-wide">
          {role ? `Login as ${role}` : "Login"}
        </h1>

        {message && (
          <p className="mb-4 text-center text-sm text-red-500 font-medium">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-black placeholder-gray-500 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white text-black placeholder-gray-500 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          New here?{" "}
          <span
            onClick={() => navigate(`/signup/${role}`)}
            className="text-black cursor-pointer hover:underline font-medium"
          >
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
