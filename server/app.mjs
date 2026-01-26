import express from "express";
import  pool  from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.get("/assignments", async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM assignments");
    return res.status(200).json({
      data: results.rows,
    })
  }catch (error) {
    return res.status(500).json({
      message: `Server could not read assignment because database connection`,
    })
  }
});

app.get("/assignments/:assignmentId", async (req, res) => {
    try {
      const assignmentIdFromClient = req.params.assignmentId;
      const results = await pool.query("SELECT * FROM assignments WHERE assignment_id = $1",
        [assignmentIdFromClient]
      );

    if (!results.rows[0]){
      return res.status(404).json({
        message: `Server could not find a requested assignment (assignment id: ${assignmentIdFromClient})`,
      });
    };
    return res.status(200).json({
      data: results.rows[0],
    });

     }catch (error){
      return res.status(500).json({
        message: `Server could not read assignment because database connection`,
      });
    };
});

app.put("/assignments/:assignmentId", async (req, res) => {
  try {
    const assignmentIdFromClient = Number(req.params.assignmentId);

    const {
      title,
      content,
      category,
    } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const updated_at = new Date();

    const results = await pool.query(
      `
      UPDATE assignments
      SET title = $1,
          content = $2,
          category = $3,
          updated_at = $4
      WHERE assignment_id = $5
      `,
      [title, content, category, updated_at, assignmentIdFromClient]
    );

    if (results.rowCount === 0) {
      return res.status(404).json({
        message: `Assignment not found (id: ${assignmentIdFromClient})`,
      });
    }

    return res.status(200).json({
      message: "Updated assignment successfully",
      data: results.rows[0],
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server could not update assignment because database connection",
    });
  }
});

app.delete("/assignments/:assignmentId" , async (req, res) => {
  try{
    const assignmentIdFromClient = req.params.assignmentId;

    const result =  await pool.query (
      `DELETE from assignments WHERE assignment_id = $1`,
      [assignmentIdFromClient]
    
    );
    if (result.rowCount === 0){
      return res.status(404).json ({
        message: "Assignment not found",
      });
    }
    return res.status(200).json({
      message : "Deleted assignment successfully",
    });

  }catch (error) {
    return res.status(500).json({
      "message": "Server could not delete assignment because database connection",
     });
    }
  });

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
