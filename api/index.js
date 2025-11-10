// ===============================
// 🌟 Atlas MD Akinator Proxy Server
// Created by Sten-X 💫
// ===============================

const express = require("express");
const cors = require("cors");
const Aki = require("aki-api"); // npm install aki-api
const app = express();

app.use(cors());
app.use(express.json());

// 🏁 Test Route
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "🧞‍♂️ Akinator Proxy Server is running! 💫",
    endpoints: {
      start: "/start?region=en&type=character",
      answer: "/answer?session=xxx&signature=xxx&step=0&answer=0",
      guess: "/guess?session=xxx&signature=xxx&step=0",
    },
  });
});

// 🎮 Start a new game
app.get("/start", async (req, res) => {
  try {
    const region = req.query.region || "en";
    const type = req.query.type || "character";

    const aki = new Aki({ region, childMode: false });
    await aki.start();

    res.json({
      session: aki.session,
      signature: aki.signature,
      question: aki.question,
      step: aki.currentStep,
    });
  } catch (err) {
    console.error("Akinator start error:", err.message);
    res.status(500).json({ error: "Failed to start Akinator session 😿" });
  }
});

// ❓ Answer a question
app.get("/answer", async (req, res) => {
  try {
    const { session, signature, step, answer } = req.query;
    if (!session || !signature) {
      return res.status(400).json({ error: "Missing session or signature!" });
    }

    const aki = new Aki({ session, signature, step });
    await aki.step(parseInt(answer));

    res.json({
      question: aki.question,
      step: aki.currentStep,
      progress: aki.progress,
    });
  } catch (err) {
    console.error("Akinator answer error:", err.message);
    res.status(500).json({ error: "Failed to answer Akinator question 😿" });
  }
});

// 🧠 Make a guess
app.get("/guess", async (req, res) => {
  try {
    const { session, signature, step } = req.query;
    if (!session || !signature) {
      return res.status(400).json({ error: "Missing session or signature!" });
    }

    const aki = new Aki({ session, signature, step });
    await aki.win();

    res.json({
      name: aki.answers[0].name,
      description: aki.answers[0].description,
      image: aki.answers[0].absolute_picture_path,
    });
  } catch (err) {
    console.error("Akinator guess error:", err.message);
    res.status(500).json({ error: "Failed to fetch Akinator guess 😿" });
  }
});

module.exports = app; // ✅ Important: Don't use app.listen()
