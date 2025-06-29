import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateQuestions } from "../api/gemini";
import { useAuth } from "../context/AuthContext";

import SmartInput from "../components/SmartInput";

const Home = () => {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleSubmit = async () => {
    if (!resume.trim()) {
      alert("Please add your resume content before submitting.");
      return;
    }

    if (!jobDesc.trim()) {
      alert("Please add job description content before submitting.");
      return;
    }

    try {
      localStorage.setItem("resume", resume);
      localStorage.setItem("jobDesc", jobDesc);

      const questions = await generateQuestions(resume, jobDesc);
      navigate("/evaluate", { state: { questions, resume, jobDesc } });
    } catch (err) {
      alert("Error generating questions. Check console.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 ">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl space-y-8 mb-20">
        <h1 className="text-3xl font-bold text-center text-blue-900">
          Candidate Details
        </h1>
        <div>
          <SmartInput label="Resume" value={resume} onChange={setResume} />
        </div>
        <div>
          <SmartInput
            label="Job Description"
            value={jobDesc}
            onChange={setJobDesc}
          />
        </div>
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-950 text-white px-8 py-3 rounded-lg hover:bg-blue-800 text-lg font-semibold shadow"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
