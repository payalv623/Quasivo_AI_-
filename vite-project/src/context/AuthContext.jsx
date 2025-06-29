import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // checkinggg if  the user is logged in on app start
    const user = localStorage.getItem("currentUser");
    console.log(
      "AuthContext: Checking for existing user in localStorage:",
      user
    );

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log("AuthContext: Found existing user:", parsedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Error parsing currentUser from localStorage:", error);
        localStorage.removeItem("currentUser");
      }
    } else {
      console.log("AuthContext: No existing user found in localStorage");
    }
    setLoading(false);
  }, []);

  const login = (user) => {
    console.log("AuthContext: Logging in user:", user);
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    console.log("AuthContext: User saved to localStorage");
  };

  const logout = () => {
    console.log("AuthContext: Logging out user");
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    // clear any saved form data on logout
    localStorage.removeItem("resume");
    localStorage.removeItem("jobDesc");
    localStorage.removeItem("answers");
    console.log("AuthContext: User data cleared from localStorage");
  };

  const register = (user) => {
    console.log("AuthContext: Registering new user:", user);
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    existingUsers.push(user);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    console.log(
      "AuthContext: User added to users array, total users:",
      existingUsers.length
    );
  };

  const checkUserExists = (emailOrUsername) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (user) =>
        user.email === emailOrUsername || user.username === emailOrUsername
    );
    console.log(
      "AuthContext: Checking if user exists:",
      emailOrUsername,
      "Found:",
      !!foundUser
    );
    return foundUser;
  };

  // Evaluation function
  const saveEvaluation = (evaluationData) => {
    if (!currentUser) return;

    const userEvaluationKey = `evaluation_${currentUser.id}`;
    const evaluation = {
      ...evaluationData,
      userId: currentUser.id,
      evaluatedAt: new Date().toISOString(),
    };

    localStorage.setItem(userEvaluationKey, JSON.stringify(evaluation));
    console.log(
      "AuthContext: Evaluation saved for user:",
      currentUser.username
    );
  };

  const getUserEvaluation = () => {
    if (!currentUser) return null;

    const userEvaluationKey = `evaluation_${currentUser.id}`;
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

  const clearUserEvaluation = () => {
    if (!currentUser) return;

    const userEvaluationKey = `evaluation_${currentUser.id}`;
    localStorage.removeItem(userEvaluationKey);
    localStorage.removeItem("resume");
    localStorage.removeItem("jobDesc");
    localStorage.removeItem("answers");
    console.log(
      "AuthContext: Evaluation cleared for user:",
      currentUser.username
    );
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    checkUserExists,
    saveEvaluation,
    getUserEvaluation,
    clearUserEvaluation,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
