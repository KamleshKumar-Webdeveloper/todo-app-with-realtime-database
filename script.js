const addTodo = () => {
  const todoInput = document.getElementById("todo-input").value;
  if (!todoInput) return;

  const todoList = document.getElementById("todo-list");
  const todoItem = document.createElement("li");

  const todosText = document.createElement("div");
  todosText.innerText = todoInput;
  todoItem.appendChild(todosText);

  const newTodoRef = firebase.database().ref("todos").push({
    todo: todoInput,
  });

  const todoId = newTodoRef.key;
  const editBtn = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.onclick = () => editTodo(todosText, todoId);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.onclick = () => deleteTodo(todoItem, todoId);

  todoItem.appendChild(editBtn);
  todoItem.appendChild(deleteBtn);
  todoList.insertBefore(todoItem, todoList.firstChild);

  document.getElementById("todo-input").value = "";
};

const editTodo = (todosText, todoId) => {
  const todoInput = document.getElementById("todo-input");
  todoInput.value = todosText.innerText;
  todoInput.focus();

  const addButton = document.getElementById("add-todo");
  const originalText = addButton.innerText;
  addButton.innerText = "Save";

  const originalOnClick = addButton.onclick;

  addButton.onclick = () => {
    const newText = todoInput.value;
    if (newText) {
      todosText.innerText = newText;
      firebase.database().ref("todos").child(todoId).update({ todo: newText });

      todoInput.value = "";
      addButton.innerText = originalText;
      addButton.onclick = originalOnClick;
    }
  };
};

const deleteTodo = (todoItem, todoId) => {
  todoItem.remove();
  firebase.database().ref("todos").child(todoId).remove();
};

const loadTodos = () => {
  const dbRef = firebase.database().ref("todos");
  dbRef.once("value", (snapshot) => {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";

    const todos = [];
    snapshot.forEach((childSnapshot) => {
      todos.push({
        id: childSnapshot.key,
        data: childSnapshot.val()
      });
    });

    todos.reverse().forEach((todo) => {
      const todoItem = document.createElement("li");

      const todosText = document.createElement("div");
      todosText.innerText = todo.data.todo;
      todoItem.appendChild(todosText);

      const editBtn = document.createElement("button");
      editBtn.innerText = "Edit";
      editBtn.onclick = () => editTodo(todosText, todo.id);

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.onclick = () => deleteTodo(todoItem, todo.id);

      todoItem.appendChild(editBtn);
      todoItem.appendChild(deleteBtn);
      todoList.appendChild(todoItem);
    });
  });
};

document.addEventListener("DOMContentLoaded", loadTodos);
