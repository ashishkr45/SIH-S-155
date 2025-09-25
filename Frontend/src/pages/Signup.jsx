import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  // Separate useState for each field
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/signup",
        { name, email, password, role },
        { withCredentials: true }
      );

      setMessage(res.data.message);

      if (res.data.success) {
        setTimeout(() => {
          navigate("/signup"); // redirect to signup page itself
        }, 1500);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>

        {message && (
          <p className="mb-4 text-center text-sm text-red-600">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Role Selection */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={(e) => setRole(e.target.value)}
              />
              Student
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={role === "teacher"}
                onChange={(e) => setRole(e.target.value)}
              />
              Teacher
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
