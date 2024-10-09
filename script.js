// DOM elements
const addTaskBtn = document.getElementById('add-task-btn');
const newTaskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('task-counter');
const allBtn = document.getElementById('all-btn');
const pendingBtn = document.getElementById('pending-btn');
const completedBtn = document.getElementById('completed-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to render tasks
function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });
  
  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.className = task.completed ? 'complete' : '';
    taskItem.innerHTML = `
      ${task.text}
      <button class="remove-btn" onclick="removeTask(${index})">Remove</button>
    `;
    taskItem.addEventListener('click', () => toggleComplete(index));
    taskList.appendChild(taskItem);
  });
  
  updateTaskCounter();
}

// Add new task
function addTask() {
  const taskText = newTaskInput.value.trim();
  if (taskText) {
    tasks.push({ text: taskText, completed: false });
    newTaskInput.value = '';
    updateLocalStorage();
    renderTasks();
  }
}

// Remove task
function removeTask(index) {
  tasks.splice(index, 1);
  updateLocalStorage();
  renderTasks();
}

// Toggle task completion
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  updateLocalStorage();
  renderTasks();
}

// Update tasks in localStorage
function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task counter
function updateTaskCounter() {
  const pendingTasks = tasks.filter(task => !task.completed).length;
  taskCounter.innerText = `Tasks Remaining: ${pendingTasks}`;
}

// Clear all completed tasks
clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  updateLocalStorage();
  renderTasks();
});

// Filter tasks
allBtn.addEventListener('click', () => renderTasks('all'));
pendingBtn.addEventListener('click', () => renderTasks('pending'));
completedBtn.addEventListener('click', () => renderTasks('completed'));

// Event listener for adding task with "Enter"
newTaskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Event listener for adding task
addTaskBtn.addEventListener('click', addTask);

// Initial render
renderTasks();
