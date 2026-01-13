import express from "express";
import pool from "./utils/db.mjs";

app.use(express.json());

const app = express();
const port = 4001;

app.post("/assignments", async (req, res) => {
  try {
    const { title, content, category, length, status } = req.body;

    if (!title || !content || !category || length === undefined || !status) {
      return res.status(400).json({
        message:
          "Server could not create assignment because there are missing data from client",
      });
    }

    const created_at = new Date();
    const updated_at = new Date();

    await pool.query(
      `INSERT INTO assignments
      ( title, content, category, length, status, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [title, content, category, length, status, created_at, updated_at]
    );

    return res.status(201).json({
      message: "Created assignment sucessfully",
    });
  } catch (error) {
    if (error.code === "23502") {
      return res.status(400).json({
        message:
          "Server could not create assignment because there are missing data from client",
      });
    }

    return res.status(500).json({
      message: "Server could not create assignment because database connection",
    });
  }
});


app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
