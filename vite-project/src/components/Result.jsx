import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveEvaluation } from "../api/save";
import { useAuth } from "../context/AuthContext";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [evaluationData, setEvaluationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    currentUser,
    logout,
    saveEvaluation,
    clearUserEvaluation,
    getUserEvaluation,
  } = useAuth();

  // Loading evaluation data from both ->>> location state or  ->>> localStorage

  const loadEvaluationData = () => {
    // First try to get data from location state
    if (
      location.state?.questions &&
      location.state?.answers &&
      location.state?.evaluations
    ) {
      return {
        questions: location.state.questions,
        answers: location.state.answers,
        evaluations: location.state.evaluations,
        jobDesc: location.state.jobDesc,
        resume: location.state.resume,
      };
    }

    // If not in location state, then geting from localStorage
    const savedEvaluation = getUserEvaluation();
    if (savedEvaluation) {
      return {
        questions: savedEvaluation.questions || [],
        answers: savedEvaluation.answers || [],
        evaluations: savedEvaluation.evaluations || [],
        jobDesc: savedEvaluation.jobDesc || "",
        resume: savedEvaluation.resume || "",
      };
    }

    return {
      questions: [],
      answers: [],
      evaluations: [],
      jobDesc: "",
      resume: "",
    };
  };

  useEffect(() => {
    const data = loadEvaluationData();
    setEvaluationData(data);
    setIsLoading(false);
  }, [location.state, getUserEvaluation]);

  const {
    questions = [],
    answers = [],
    evaluations = [],
    jobDesc = "",
    resume = "",
  } = evaluationData || {};

  // Save evaluation data to localStorage
  useEffect(() => {
    if (
      questions &&
      Array.isArray(questions) &&
      questions.length > 0 &&
      answers &&
      Array.isArray(answers) &&
      answers.length > 0 &&
      evaluations &&
      Array.isArray(evaluations) &&
      evaluations.length > 0
    ) {
      saveEvaluation({
        questions,
        answers,
        evaluations,
        jobDesc,
        resume,
      });
    }
  }, [questions, answers, evaluations, jobDesc, resume, saveEvaluation]);

  const handleDownload = () => {
    const payload = {
      user: {
        username: currentUser?.username || "Unknown",
        email: currentUser?.email || "Unknown",
        userId: currentUser?.id || "Unknown",
      },
      jobDesc,
      resume,
      questions: questions || [],
      answers: answers || [],
      scores:
        evaluations && Array.isArray(evaluations)
          ? evaluations.map((e) => e?.score || 0)
          : [],
      evaluatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `evaluation_result_${currentUser?.username || "user"}_${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();

    URL.revokeObjectURL(url);
    setToast("✅ Downloaded successfully!");
    setTimeout(() => setToast(""), 3000);
    saveEvaluation(payload);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl space-y-8 mt-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-4">
          Evaluation Summary
        </h1>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div className="text-lg text-gray-700 font-medium mb-2 md:mb-0">
            {currentUser && (
              <span>
                Welcome,{" "}
                <span className="font-semibold">{currentUser.username}</span>
              </span>
            )}
          </div>
          <button
            onClick={handleDownload}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold shadow"
          >
            Download Result
          </button>
        </div>
        {toast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
            {toast}
          </div>
        )}
        {Array.isArray(questions) &&
          Array.isArray(answers) &&
          Array.isArray(evaluations) &&
          questions.length > 0 &&
          questions.map((q, i) => (
            <div
              key={i}
              className="border border-gray-300 rounded p-4 shadow-sm bg-gray-50 mb-4"
            >
              <h2 className="font-semibold text-lg text-blue-700 mb-2">
                Q{i + 1}: {q}
              </h2>
              <p className="mb-2 text-gray-700 break-words whitespace-pre-wrap">
                <span className="font-medium text-gray-800">Answer:</span>{" "}
                {answers?.[i] ?? "N/A"}
              </p>
              <p className="text-green-700 font-semibold">
                Score: {evaluations?.[i]?.score ?? 0} / 10
              </p>
            </div>
          ))}
        {(!questions ||
          !Array.isArray(questions) ||
          questions.length === 0) && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No evaluation data available.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Please complete an evaluation first.
            </p>
          </div>
        )}
        <div className="text-center pt-6">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 text-lg font-semibold shadow mr-4"
          >
            Logout
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Powered by KnackHook | Quasivo Challenge
          </p>
        </div>
      </div>
    </div>
  );
};

export default Result;
