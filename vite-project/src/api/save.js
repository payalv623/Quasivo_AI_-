import axios from "axios";

export const saveEvaluation = async (data) => {
  try {
    const res = await axios.post("http://localhost:5000/save", data);
    //  console.log(data);
    console.log("✅ Evaluation saved:", res.data.filename);
  } catch (err) {
    console.error("❌ Save failed:", err);
  }
};
