const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
renderTodos();

addBtn.addEventListener("click", addTodo);

//Adds todo when Enter key is pressed
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText) {
    const newTodo = { id: Date.now(), text: todoText };
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
    todoInput.value = "";
  }
}

function renderTodos(){
    todoList.innerHTML = "";
    todos.forEach(todo => {
        const li = document.createElement("li");
        li.textContent = todo.text;

        const btnContainer = document.createElement("div");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.addEventListener("click", () => editTodo(todo.id));

        const delBtn = document.createElement("button");
        delBtn.textContent = "x";
        delBtn.className = "delete-btn";

        delBtn.addEventListener("click", () => {
            todos = todos.filter(t => t.id !== todo.id);
            localStorage.setItem("todos", JSON.stringify(todos));
            renderTodos();
        });

        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(delBtn);
        li.appendChild(btnContainer);
        todoList.appendChild(li);
    });
}

function editTodo(id){
    const todo = todos.find(t => t.id === id);
    const newText = prompt("Edit your todo:", todo.text);
    if(newText !== null && newText.trim() !== ""){
        todo.text = newText.trim();
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodos();
    }
}