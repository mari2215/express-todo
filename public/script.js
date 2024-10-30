
  const API_URL = "http://localhost:3000/todos";
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const todoDescription = document.getElementById("todo-description");
const todoDate = document.getElementById("todo-date");
  let todos = []; 
  let activeTab = 'all'; 

  async function loadTodos() {
    todos = await fetchTodos();
    renderTodos();
  }

  async function fetchTodos() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  }

  function renderTodos() {
    todoList.innerHTML = "";

    const filteredTodos = todos.filter(todo => {
      if (activeTab === 'all') return true;
      return activeTab === 'active' ? !todo.completed : todo.completed;
    });

    filteredTodos.forEach(todo => {
      const todoItem = document.createElement("li");
      todoItem.className = "border-t border-gray-200";
      todoItem.innerHTML = `
        <div class="px-4 py-5 sm:px-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg leading-6 font-medium text-gray-900">${todo.title}</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">${todo.description || ""}</p>
            <span class="text-sm text-gray-500">${todo.date ? `Due: ${todo.date}` : ''}</span>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <p class="text-sm font-medium text-gray-500">
              Status: <span class="${todo.completed ? 'text-green-600' : 'text-red-600'}">${todo.completed ? 'Completed' : 'Active'}</span>
            </p>
            <div class="flex gap-2">
              <button onclick="toggleCompleted(${todo.id})" class="font-medium text-indigo-600 hover:text-indigo-500">
                ${todo.completed ? 'Unmark' : 'Complete'}
              </button>
              <button onclick="deleteTodo(${todo.id})" class="font-medium text-red-600 hover:text-red-800">
                Delete
              </button>
            </div>
          </div>
        </div>`;
      todoList.appendChild(todoItem);
    });
  }

  function changeTab(tab) {
    activeTab = tab;
    document.getElementById("all-tab").classList.toggle("bg-orange-50", tab === "all");
    document.getElementById("active-tab").classList.toggle("bg-orange-50", tab === "active");
    document.getElementById("completed-tab").classList.toggle("bg-orange-50", tab === "completed");

    renderTodos();
  }

  todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = todoInput.value.trim();
  const description = todoDescription.value.trim(); 
  const date = todoDate.value; 

  if (title) {
    const todo = {
      title,
      description, 
      date,        
      completed: false,
    };

    await createTodo(todo); 
    todoInput.value = "";
    todoDescription.value = "";
    todoDate.value = "";
    loadTodos(); 
  }
});

  async function createTodo(todo) {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(todo),
      headers: { "Content-Type": "application/json" },
    });
  }

  async function toggleCompleted(id) {
    const todo = todos.find(t => t.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };
    await updateTodo(updatedTodo);
    loadTodos();
  }

  async function updateTodo(todo) {
    await fetch(`${API_URL}/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: { "Content-Type": "application/json" },
    });
  }

  async function deleteTodo(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadTodos();
  }

  loadTodos();
