const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT company, role, status, date_applied, company_type FROM applications WHERE user_id = $1",
      [req.userId]
    );
    const applications = result.rows;

    const statusCounts = {
      Applied: 0,
      "OA Round": 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };
    applications.forEach((a) => {
      if (statusCounts[a.status] !== undefined) statusCounts[a.status]++;
    });

    if (applications.length === 0) {
      return res.json({
        insight: "No applications yet — once you add a few, I'll analyze your patterns and give you tailored insights.",
        statusCounts,
        total: 0,
      });
    }

    const summary = applications
      .map((a) => `${a.company} (${a.company_type || "unknown type"}) - ${a.role} - ${a.status}`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a placement coach analyzing a student's job application data. Here is their data:

${summary}

Give exactly 4 short, specific, actionable insights as a JSON array of strings (no markdown, no asterisks, no headers — plain sentences only). Each insight should be 1-2 sentences, specific to the numbers given, encouraging but honest. Respond with ONLY a valid JSON array like ["insight one", "insight two", "insight three", "insight four"] and nothing else, no extra text before or after.`;

    const aiResult = await model.generateContent(prompt);
    let text = aiResult.response.text().trim();

    // Strip markdown code fences if Gemini wraps the JSON in them
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");

    let insights;
    try {
      insights = JSON.parse(text);
    } catch {
      insights = [text]; // fallback: show raw text as one card if parsing fails
    }

    res.json({ insights, statusCounts, total: applications.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

module.exports = router;