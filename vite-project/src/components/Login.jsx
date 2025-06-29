// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import KNACKHOOK_LOGO from "../assets/KH_LOGO.png";

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login, checkUserExists, getUserEvaluation } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.emailOrUsername || !formData.password) {
      setError("All fields are required");
      return;
    }

    // Findingg user by email or username using -->> AuthContext
    const user = checkUserExists(formData.emailOrUsername);

    if (!user) {
      setError("User not found. Please register first.");
      return;
    }

    // Checking password
    if (user.password !== formData.password) {
      setError("Invalid password");
      return;
    }

    // calling login using AuthContext
    login(user);

    const existingEvaluation = getUserEvaluation();

    if (existingEvaluation) {
      // User has previous evaluation, redirect to result page
      navigate("/result", {
        state: {
          questions: existingEvaluation.questions,
          answers: existingEvaluation.answers,
          evaluations: existingEvaluation.evaluations,
          jobDesc: existingEvaluation.jobDesc,
          resume: existingEvaluation.resume,
        },
      });
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-600 mt-2">
            Welcome! Please login to continue
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">
            Welcome! Please login with your credentials to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email or username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
