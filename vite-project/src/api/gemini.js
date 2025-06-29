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

SCORING CRITERIA:
- 0: Empty, irrelevant, or nonsensical answers (random characters, numbers, gibberish)
- 1-2: Very poor answers with no technical content or completely off-topic
- 3-6: Basic answers with minimal technical detail or partially relevant
- 7-8: Good answers with relevant technical content and some depth
- 9-10: Excellent answers with detailed technical explanations, examples, and best practices

EVALUATION RULES:
- If answer is empty, random characters, or nonsensical → Score 0
- If answer shows no understanding of the question → Score 0
- If answer is off-topic or irrelevant → Score 0-1
- If answer has basic understanding but lacks depth → Score 4-8
- If answer shows excellent technical expertise with examples → Score 9-10

TECHNICAL DEPTH REQUIREMENTS:
- For complex technical questions,look for specific technologies, methodologies, or frameworks mentioned
- Consider if the answer addresses the core technical challenge

EXAMPLES:
- "09890809890809" or "pouiouiuoihiuhgjhkjb" → Score 0 (nonsensical)
- "I don't know" or empty answer → Score 0
- "" or " " → Score 0
- "It's a database" → Score 0 (too vague)
- "I used it for data storage" → Score 1-3 (basic)
- "I used ClickHouse for analytics due to its columnar storage" → Score 4-6 (good) 
- "I chose ClickHouse over PostgreSQL for real-time analytics because..." → Score 8-10 (excellent)

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
