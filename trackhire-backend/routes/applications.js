const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// GET all applications — only this user's
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM applications WHERE user_id = $1 ORDER BY date_applied DESC",
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST — always attach the logged-in user's id, never trust client input for this
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { company, role, status, date_applied, company_type, notes } = req.body;

    const result = await pool.query(
      `INSERT INTO applications (company, role, status, date_applied, company_type, notes, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [company, role, status || "Applied", date_applied, company_type, notes, req.userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT — only allow updating your own application
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { company, role, status, date_applied, company_type, notes } = req.body;

    const result = await pool.query(
      `UPDATE applications
       SET company = $1, role = $2, status = $3, date_applied = $4, company_type = $5, notes = $6
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [company, role, status, date_applied, company_type, notes, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE — only allow deleting your own application
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ message: "Deleted successfully", deleted: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;