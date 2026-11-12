const express = require("express");
const cors = require("cors");
const pool = require("./db");
const applicationsRouter = require("./routes/applications");
const authRouter = require("./routes/auth");
const insightsRouter = require("./routes/insights");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/applications", applicationsRouter);
app.use("/api/auth", authRouter); 
app.use("/api/insights", insightsRouter);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database Error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});