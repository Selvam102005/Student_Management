import express from "express";
import sql from "mssql";
import { dbConfig } from "../dbConfig.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM Students`;
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { rollNo, name, age, grade } = req.body;
  if (!rollNo || !name || !age || !grade) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await sql.connect(dbConfig);
    await sql.query`
      INSERT INTO Students (rollNo, name, age, grade)
      VALUES (${rollNo}, ${name}, ${age}, ${grade})
    `;
    res.json({ success: true, message: "Student added" });
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:rollNo", async (req, res) => {
  const { rollNo } = req.params;
  const { name, age, grade } = req.body;

  if (!name || !age || !grade) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await sql.connect(dbConfig);
    await sql.query`
      UPDATE Students SET name=${name}, age=${age}, grade=${grade}
      WHERE rollNo=${rollNo}
    `;
    res.json({ success: true, message: "Student updated" });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:rollNo", async (req, res) => {
  const { rollNo } = req.params;
  try {
    await sql.connect(dbConfig);
    await sql.query`DELETE FROM Students WHERE rollNo = ${rollNo}`;
    res.json({ success: true, message: "Student deleted" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
