const express = require("express");
const serveStatic = require("serve-static");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(serveStatic("public"));

// MySQL Connection
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error opening SQLite database: " + err.message);
    return;
  }
  console.log("Connected to SQLite database.");
});

// GET endpoint to fetch all todo items
app.get("/todos", (req, res) => {
  const { status } = req.query;
  let query = "SELECT * FROM todos";
  let params = [];

  if (status === "active") {
    query += " WHERE completed = ?";
    params.push(0); 
  } else if (status === "completed") {
    query += " WHERE completed = ?";
    params.push(1); 
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error fetching todos:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});


// POST endpoint to create a new todo item
app.post("/todos", (req, res) => {
  const { title, description, date, completed } = req.body;
  const createdAt = new Date().toISOString(); 
  const updatedAt = createdAt; 

  db.run(
    "INSERT INTO Todos (title, description, date, completed, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
    [title, description || "", date || "", completed || false, createdAt, updatedAt],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, title, description, date, completed });
    }
  );
});


// PUT endpoint to update an existing todo item with the specified `id`
app.put("/todos/:id", (req, res) => {
  const { title, description, date, completed } = req.body;
  const { id } = req.params;
  const updatedAt = new Date().toISOString(); // Генерація timestamp для оновлення

  db.run(
    "UPDATE Todos SET title = ?, description = ?, date = ?, completed = ?, updatedAt = ? WHERE id = ?",
    [title, description, date, completed, updatedAt, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Todo updated successfully" });
    }
  );
});


// DELETE endpoint to remove an existing todo item with the specified `id`
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(204).send();
  });
});

// run the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
