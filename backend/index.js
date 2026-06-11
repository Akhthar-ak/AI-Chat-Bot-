import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const workoutTutorials = JSON.parse(
  fs.readFileSync("./data/workout_tutorials.json", "utf-8")
);

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    console.log("User asked:", userMessage);

    const prompt = `
You are FitBot AI, a professional fitness coach.

Answer only fitness, workout, gym, diet, nutrition, fat loss, muscle gain, and exercise-related questions.
If the question is not related to fitness, politely say you can only help with fitness topics.

User Question:
${userMessage}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const reply =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Gemini returned an empty response.";

    console.log("Gemini reply:", reply);

    res.json({ reply });
  } catch (error) {
    console.log("Gemini Error Message:", error.message);
    console.log("Full Error:", error);

    res.json({
      reply:
        "⚠️ Sorry, I am unable to generate a response right now. Please try again later.",
    });
  }
});

app.get("/workouts", (req, res) => {
  res.json(workoutTutorials);
});

app.get("/gemini-test", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say hello from Gemini AI",
    });

    res.json({
      success: true,
      reply: response.text,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("🔥 FitBot AI Backend Running on Port 5000");
});