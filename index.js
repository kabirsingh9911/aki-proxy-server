const express = require("express");
const cors = require("cors");
const Aki = require("aki-api");

const app = express();
app.use(cors());
app.use(express.json());

// 🌀 Start Akinator
app.get("/start", async (req, res) => {
  try {
    const region = req.query.region || "en";
    const aki = new Aki({ region });
    await aki.start();

    res.json({
      session: aki.session,
      signature: aki.signature,
      question: aki.question,
      step: aki.currentStep,
      region,
    });
  } catch (err) {
    console.error("❌ Start error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🧠 Answer Akinator
app.get("/answer", async (req, res) => {
  try {
    const { session, signature, step, answer } = req.query;
    if (!session || !signature)
      return res.status(400).json({ error: "Missing session/signature" });

    const aki = new Aki({ region: "en", session, signature, step });
    await aki.step(answer);

    res.json({
      question: aki.question,
      step: aki.currentStep,
      progress: aki.progress,
      answers: aki.answers,
    });
  } catch (err) {
    console.error("❌ Answer error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔮 Guess Akinator
app.get("/guess", async (req, res) => {
  try {
    const { session, signature, step } = req.query;
    if (!session || !signature)
      return res.status(400).json({ error: "Missing session/signature" });

    const aki = new Aki({ region: "en", session, signature, step });
    await aki.win();

    res.json({
      guess: aki.answers[0],
      description: aki.answers[0]?.description,
      image: aki.answers[0]?.absolute_picture_path,
    });
  } catch (err) {
    console.error("❌ Guess error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Export app for Vercel
module.exports = app;
