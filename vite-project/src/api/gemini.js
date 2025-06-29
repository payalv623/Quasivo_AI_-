import axios from "axios";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const generateQuestions = async (resume, jobDesc) => {
  const prompt = `
You are an AI assistant helping with candidate screening.
Based on the following RESUME and JOB DESCRIPTION, generate 3 interview questions in JSON format:
The level of questions should be tough and more technical.

IMPORTANT CONSTRAINTS:
- Take only first 300 words from resume and job description.
- Each question must be MAXIMUM 3 lines long
- Each question must not exceed 30 words
- Keep questions concise and direct
- Focus on specific technical skills and experience

Resume:
${resume}

Job Description:
${jobDesc}

Output must be in this JSON format ,Please return only a valid JSON object. Do not wrap in code blocks. Do not include \`\`\` or any explanation.


{
  "questions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ]
}
`;

  try {
    const res = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let text = res.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("No response from Gemini API");

    // Remove Markdown code block wrapping (```json ... ```)
    text = text.trim();
    if (text.startsWith("```")) {
      text = text.substring(text.indexOf("\n") + 1); // remove the first line (```json)
      text = text.replace(/```$/, ""); // remove last ```
    }

    const parsed = JSON.parse(text);
    return parsed.questions;
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
};
export const evaluateAnswers = async (questions, answers) => {
  const prompt = `
You are a strict technical interviewer evaluating candidate responses. Score each answer from 1-10 based on these criteria:
SCORING RUBRIC:
- Score 0: Answer is empty or "  "
- Score 0: Answer is empty, gibberish, random characters, or irrelevant
- Score 1-2: Very poor answer, off-topic, shows no technical understanding
- Score 3-4: Very basic answer, minimal relevance, vague, lacks explanation
- Score 5-6: Some understanding shown, lacks technical depth or examples
- Score 7-8: Good answer with relevant technical points, but missing depth or clarity
- Score 9-10: Excellent answer with strong technical explanation, technologies, examples, and best practices

RULES:
- If answer is EMPTY or gibberish, assign score 0
- If answer is off-topic or unrelated to question, assign score 0-1
- If answer barely explains anything, assign 2-4
- Give 7+ only if the answer includes specific technologies or clear logic
- Give 9-10 only if it includes clear explanation, examples, and best practices

EXAMPLES:
- "09890809890809" or "pouiouiuoihiuhgjhkjb" → Score 0 (nonsensical)
- "I don't know" or empty answer → Score 0
- "" or " " → Score 0
- "It's a database" → Score 0 (too vague)
- "I used it for data storage" → Score 1-3 (basic)
- "I used ClickHouse for analytics due to its columnar storage" → Score 4-6 (good) 
- "I chose ClickHouse over PostgreSQL for real-time analytics because..." → Score 6-10 (excellent)

Be strict and honest. Do not give high scores for poor answers.

Return ONLY this JSON format:
{
  "evaluations": [
    { "score": 8 },
    { "score": 6 },
    { "score": 9 }
  ]
}

Question 1: ${questions[0]}
Answer 1: ${answers[0]}

Question 2: ${questions[1]}
Answer 2: ${answers[1]}

Question 3: ${questions[2]}
Answer 3: ${answers[2]}
`;

  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
        import.meta.env.VITE_GEMINI_API_KEY
      }`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text;

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const rawJson = text.substring(jsonStart, jsonEnd);

    const parsed = JSON.parse(rawJson);
    return parsed.evaluations;
  } catch (err) {
    console.error("❌ Error in evaluateAnswers:", err);
    throw err;
  }
};
