import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Signup = () => {
  const { role } = useParams(); // student or teacher
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password, role }, // include role
        { withCredentials: true }
      );

      setMessage(res.data.message);

      if (res.data.success) {
        setTimeout(() => {
          navigate(`/login/${role}`); // redirect after signup
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
      {/* Signup Card */}
      <div className="bg-white border border-gray-200 p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-black tracking-wide">
          {role ? `Signup as ${role}` : "Signup"}
        </h1>

        {message && (
          <p className="mb-4 text-center text-sm text-red-500 font-medium">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white text-black placeholder-gray-500 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
          />

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
            Signup
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate(`/login/${role}`)}
            className="text-black cursor-pointer hover:underline font-medium"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
