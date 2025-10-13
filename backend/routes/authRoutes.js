import express from "express";
import sql from "mssql";
import { dbConfig } from "../dbConfig.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password required" });
  }

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT * FROM Users WHERE username = ${username} AND password = ${password}
    `;
    if (result.recordset.length > 0) {
      res.json({ success: true, username });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
