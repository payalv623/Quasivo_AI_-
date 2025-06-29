import React, { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Home from "./components/home";
import Evaluate from "./components/Evaluate";
import Result from "./components/Result";
import Register from "./components/Register";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import knackhookLogo from "./assets/KH_LOGO.png";
import gif1 from "./assets/GIF_HUMAN1.gif";

function NavBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const KNACKHOOK_LOGO = knackhookLogo;
  return (
    <nav className="flex items-center justify-between bg-gray-700 shadow px-6 py-3 mb-6 p-4">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <img src={KNACKHOOK_LOGO} alt="Knackhook " className="w-32 h-auto" />
        <br />
        <span className=" text-2xl font-bold text-gray-200 ml-2 ">
          Quasivo AI Challenge
        </span>
      </div>
      <div className="flex items-center gap-4">
        {currentUser && (
          <span className="text-white font-medium">{currentUser.username}</span>
        )}
        {currentUser && (
          <button
            onClick={() => {
              logout();
              navigate("/welcome");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="bg-gradient-to-b from-blue-100 to-black-100 rounded-xl shadow-lg p-10 flex flex-col items-center gap-6">
        <img
          src={knackhookLogo}
          alt="Knackhook Logo"
          className="h-12 w-50 mb-2 shadow-gray-600 bg-gradient-to-b from-blue-900 to-blue-800 rounded-lg shadow-md p-1"
        />
        <h1 className="text-4xl font-bold text-blue-800 text-center">
          Welcome to
          <span className="text-pink-600"> Quasivo AI Challenge</span>
        </h1>
        <p className="text-lg text-gray-500  font-bold text-center">
          Empowering your hiring process with AI
        </p>{" "}
        <img
          src={gif1}
          alt="AI Animation"
          className="rounded-xl shadow-md w-full max-w-xl mx-auto mb-10"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              Smart Resume Parsing
            </h3>
            <p className="text-gray-600">
              Extract and interpret key details from any resume using
              AI-enhanced PDF parsing.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              Tailored Question Generation
            </h3>
            <p className="text-gray-600">
              Automatically generate interview questions aligned with the job
              description.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              Instant Candidate Evaluation
            </h3>
            <p className="text-gray-600">
              Evaluate responses instantly with AI scoring and detailed
              feedback.
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => {
              console.log("Start Now button clicked - navigating to /login");
              navigate("/login");
            }}
            className="bg-blue-900 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow"
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
}

function HomeWithRedirect() {
  const { currentUser, getUserEvaluation } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
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
      }
    }
  }, [currentUser, getUserEvaluation, navigate]);

  return (
    <>
      <NavBar />
      <Home />
    </>
  );
}

function AppRoutes() {
  const { currentUser, getUserEvaluation } = useAuth();

  return (
    <Routes>
      {/* redirect to home if already logged in */}
      <Route
        path="/welcome"
        element={currentUser ? <Navigate to="/home" replace /> : <Welcome />}
      />

      {/* Public routes */}
      <Route
        path="/register"
        element={currentUser ? <Navigate to="/home" replace /> : <Register />}
      />
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/home" replace /> : <Login />}
      />

      {/* protected routes with navBar */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomeWithRedirect />
          </PrivateRoute>
        }
      />
      <Route
        path="/evaluate"
        element={
          <PrivateRoute>
            <NavBar />
            <Evaluate />
          </PrivateRoute>
        }
      />
      <Route
        path="/result"
        element={
          <PrivateRoute>
            <NavBar />
            <Result />
          </PrivateRoute>
        }
      />

      {/* Redirect root to welcome if not logged in, else to home */}
      <Route
        path="/"
        element={<Navigate to={currentUser ? "/home" : "/welcome"} replace />}
      />

      {/*  all other routes */}
      <Route
        path="*"
        element={<Navigate to={currentUser ? "/home" : "/welcome"} replace />}
      />
    </Routes>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <div className="main-container min-h-screen bg-gray-100">
        <Router>
          <AppRoutes />
        </Router>
      </div>
    </AuthProvider>
  );
};
export default App;
