import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { evaluateAnswers } from "../api/gemini";
import { useAuth } from "../context/AuthContext";
import VoiceTextInput from "../components/VoiceTextInput";

const Evaluate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobDesc, resume, questions = [] } = location.state || {};
  const { currentUser, logout, getUserEvaluation } = useAuth();

  useEffect(() => {
    const existingEvaluation = getUserEvaluation();
    if (existingEvaluation && (!questions || questions.length === 0)) {
      navigate("/result", {
        state: {
          questions: existingEvaluation.questions,
          answers: existingEvaluation.answers,
          evaluations: existingEvaluation.evaluations,
          jobDesc: existingEvaluation.jobDesc,
          resume: existingEvaluation.resume,
        },
      });
    } else if (!questions || questions.length === 0) {
      alert("No questions available. Please start from the home page.");
      navigate("/home");
    }
  }, [getUserEvaluation, navigate, questions]);

  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem("answers");
    if (saved) {
      return JSON.parse(saved);
    }
    return Array(questions.length).fill("");
  });

  // Save to localStorage when answers change
  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  const handleAnswerChange = (i, val) => {
    const updated = [...answers];
    updated[i] = val;
    setAnswers(updated);
    localStorage.removeItem("answers"); //clear after use
  };

  const handleEvaluate = async () => {
    try {
      const evaluations = await evaluateAnswers(questions, answers);
      localStorage.removeItem("answers"); //clear after use
      navigate("/result", {
        state: { questions, answers, evaluations, jobDesc, resume },
      });
    } catch (err) {
      console.error("Error evaluating answers:", err);
      alert("Failed to evaluate answers!");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl space-y-8 mt-8">
        <h1 className="text-3xl font-bold text-center text-blue-950">
          Answer Interview Questions
        </h1>
        {questions.map((q, i) => (
          <div key={i}>
            <p className="font-semibold mb-1 text-lg text-gray-800">
              {i + 1}. {q}
            </p>
            <VoiceTextInput
              value={answers[i]}
              index={i}
              onChange={(idx, newVal) => {
                const updated = [...answers];
                updated[idx] = newVal;
                setAnswers(updated);
              }}
            />
          </div>
        ))}
        <div className="text-center">
          <button
            onClick={handleEvaluate}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 text-lg font-semibold shadow"
          >
            Evaluate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Evaluate;
