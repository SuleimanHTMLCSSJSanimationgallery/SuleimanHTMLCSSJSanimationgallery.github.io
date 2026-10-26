const newTaskInput = document.getElementById("new-task");
const addTaskButton = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

function addTask(event) {
  event.preventDefault();
  const taskText = newTaskInput.value;
  if (taskText.trim() === "") {
    return;
  }
  const task = document.createElement("li");
  task.innerText = taskText;
  todoList.appendChild(task);
  newTaskInput.value = "";
}

addTaskButton.addEventListener("click", addTask);
