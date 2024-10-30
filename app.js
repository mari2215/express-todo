const express = require("express");
const serveStatic = require("serve-static");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(serveStatic("public"));

let todos = []; // In-memory storage for todos

// GET endpoint to fetch all todo items
app.get("/todos", (req, res) => {
  const { status } = req.query;
  let filteredTodos = todos;

  if (status === "active") {
    filteredTodos = todos.filter((todo) => !todo.completed);
  } else if (status === "completed") {
    filteredTodos = todos.filter((todo) => todo.completed);
  }

  res.json(filteredTodos); 
});

// POST endpoint to create a new todo item
app.post("/todos", (req, res) => {
  const todo = {
    id: todos.length + 1,
    title: req.body.title,
    description: req.body.description || "",
    date: req.body.date || "", 
    completed: req.body.completed || false,
  };
  todos.push(todo);
  res.status(201).json(todo); 
});

// PUT endpoint to update an existing todo item with the specified `id`
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todo.title = req.body.title || todo.title;
  todo.description = req.body.description || todo.description;
  todo.date = req.body.date || todo.date; 
  todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
  res.json(todo); 
});

// DELETE endpoint to remove an existing todo item with the specified `id`
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos.splice(index, 1);
  res.status(204).send();
});

// run the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
