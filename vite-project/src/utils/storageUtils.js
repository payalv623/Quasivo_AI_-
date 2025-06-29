// Utility functions for localStorage management

export const clearAllUserData = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("users");
  localStorage.removeItem("resume");
  localStorage.removeItem("jobDesc");
  localStorage.removeItem("answers");
};

export const debugLocalStorage = () => {
  console.log("=== LocalStorage Debug Info ===");
  console.log("currentUser:", localStorage.getItem("currentUser"));
  console.log("users:", localStorage.getItem("users"));
  console.log("resume:", localStorage.getItem("resume"));
  console.log("jobDesc:", localStorage.getItem("jobDesc"));
  console.log("answers:", localStorage.getItem("answers"));
  console.log("===============================");
};

export const getUserCount = () => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  return users.length;
};

export const getAllUsers = () => {
  return JSON.parse(localStorage.getItem("users") || "[]");
};

// Evaluation functions
export const saveUserEvaluation = (userId, evaluationData) => {
  const userEvaluationKey = `evaluation_${userId}`;
  const evaluation = {
    ...evaluationData,
    userId,
    evaluatedAt: new Date().toISOString(),
  };
  localStorage.setItem(userEvaluationKey, JSON.stringify(evaluation));
};

export const getUserEvaluation = (userId) => {
  const userEvaluationKey = `evaluation_${userId}`;
  const evaluation = localStorage.getItem(userEvaluationKey);

  if (evaluation) {
    try {
      return JSON.parse(evaluation);
    } catch (error) {
      console.error("Error parsing evaluation data:", error);
      return null;
    }
  }
  return null;
};

export const clearUserEvaluation = (userId) => {
  const userEvaluationKey = `evaluation_${userId}`;
  localStorage.removeItem(userEvaluationKey);
  localStorage.removeItem("resume");
  localStorage.removeItem("jobDesc");
  localStorage.removeItem("answers");
};

export const getAllEvaluations = () => {
  const evaluations = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("evaluation_")) {
      try {
        const evaluation = JSON.parse(localStorage.getItem(key));
        evaluations.push(evaluation);
      } catch (error) {
        console.error(`Error parsing evaluation from ${key}:`, error);
      }
    }
  }
  return evaluations;
};
