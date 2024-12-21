// BASE TASK FUNCTIONALITY
let tasks = [];

// Checking for previously saved tasks.
const savedTasks = localStorage.getItem('test-site-21-tasks');
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

class Task {
  constructor(id, text, completed = false) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }
}

const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
// FOR TASK FILTER FUNCTIONALITY
const showAllBtn = document.querySelector('#showAllBtn');
const showActiveBtn = document.querySelector('#showActiveBtn');
const showCompletedBtn = document.querySelector('#showCompletedBtn');
// Set default filter to "All"
let currentFilter = 'all';

// Set filter to "All"
showAllBtn.addEventListener('click', () => {
  currentFilter = 'all';
  renderTasks();
})

showActiveBtn.addEventListener('click', () => {
  currentFilter = 'active';
  renderTasks();
})

showCompletedBtn.addEventListener('click', () => {
  console.log("COMPLETED!")
  currentFilter = 'completed';
  renderTasks();
})


renderTasks();

taskForm.addEventListener('submit', (e) => {
  // Get task input value.
  const taskText = taskInput.value.trim();

  // Stop form submission from refreshing the page.
  e.preventDefault();

  // (check if there is anything in the input).
  if (taskText !== '') {
    // Add task list item (created w/ the Task class) w/ input value to list (tasks array).
    const newTask = new Task(Date.now(), taskText, false);;
    tasks.push(newTask);
    saveTasks();
    // Render task list, now w/ new addition.
    renderTasks();
    // Reset input field.
    taskInput.value = '';
  }
  
});

function renderTasks() {
  // Reset task list.
  taskList.innerHTML = '';
  let filteredTasks = [];
  // Filter tasks logic.
  if (currentFilter === 'all') {
    filteredTasks = tasks;
  } else if (currentFilter === 'active') {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter((task) => task.completed);
  }
  
  // Re-add tasks to the task list, updated.
  filteredTasks.forEach((task) => {
    // Create task entry for list.
    const li = document.createElement('li');
    li.classList.add('task-item');

    const span = document.createElement('span');
    span.classList.add('task-text');
    span.textContent = task.text;
    // Assign completed styles if marked as such.
    if (task.completed) {
      span.classList.add('completed');
    }

    // Add a remove button for each task.
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn');
    removeBtn.textContent = 'X';

    // Toggle completion.
    span.addEventListener('click', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // Remove button functionality.
    removeBtn.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    // Add task to the list array.
    li.appendChild(span);
    li.appendChild(removeBtn);
    taskList.appendChild(li);
  });
}

// Updating localStorage w/ new tasks / states (completed/deleted).
function saveTasks() {
  localStorage.setItem('test-site-21-tasks', JSON.stringify(tasks));
}