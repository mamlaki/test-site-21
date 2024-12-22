// BASE TASK FUNCTIONALITY
let tasks = [];

// Checking for previously saved tasks.
const savedTasks = localStorage.getItem('test-site-21-tasks');
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

class Task {
  constructor(id, text, completed = false, details = '', dueDate = '') {
    this.id = id;
    this.text = text;
    this.completed = completed;
    this.details = details;
    this.dueDate = dueDate;
  }
}

const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
const taskDetailsInput = document.querySelector('#taskDetails');
const taskDueDateInput = document.querySelector('#taskDueDate');
// FOR TASK FILTER FUNCTIONALITY
const showAllBtn = document.querySelector('#showAllBtn');
const showActiveBtn = document.querySelector('#showActiveBtn');
const showCompletedBtn = document.querySelector('#showCompletedBtn');
// FOR THEME TOGGLE FUNCTIONALITY
const themeToggleBtn = document.querySelector('#themeToggle');
const body = document.body;

// THEME TOGGLING
// Set theme last set (stored in localStorage), if not default to light mode.
let currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
  body.classList.add('dark-mode');
  themeToggleBtn.textContent = 'Light Mode';
} else {
  themeToggleBtn.textContent = 'Dark Mode';
}

// Toggle theme when theme button is clicked.
themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      themeToggleBtn.textContent = 'Light Mode';
    } else {
      localStorage.setItem('theme', 'light');
      themeToggleBtn.textContent = 'Dark Mode';
    }
});


// TASK FILTERING
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

// TASK FORM
taskForm.addEventListener('submit', (e) => {
  // Stop form submission from refreshing the page.
  e.preventDefault();

  // Get task input value.
  const taskText = taskInput.value.trim();
  const taskDetails = taskDetailsInput.value.trim();
  const taskDueDate = taskDueDateInput.value;

  // (check if there is anything in the input).
  if (taskText !== '') {
    // Add task list item (created w/ the Task class) w/ input value to list (tasks array).
    const newTask = new Task(Date.now(), taskText, false, taskDetails, taskDueDate);;
    tasks.push(newTask);
    saveTasks();
    // Render task list, now w/ new addition.
    renderTasks();
    // Reset input field.
    taskInput.value = '';
    taskDetails.value = '';
    taskDueDate.value = '';
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

    // Content Container
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('task-content');

    // Title
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('task-content-title', 'task-text');
    titleSpan.textContent = task.text;
    // Assign completed styles if marked as such.
    if (task.completed) titleSpan.classList.add('completed');

    // Details
    const detailsPara = document.createElement('p');
    detailsPara.classList.add('task-content-details');
    detailsPara.textContent = task.details;

    // Due Date
    const dueDatePara = document.createElement('p');
    if (task.dueDate) {
      dueDatePara.textContent = `Due: ${task.dueDate}`;
    } else {
      dueDatePara.textContent = 'No due date.';
    }

    // Buttons Container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('task-buttons');

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.innerHTML = '<i class="fas fa-pen"></i>';

    // Add a remove button for each task.
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn');
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>';

    editBtn.addEventListener('click', () =>{
      // EDIT MODE
      if (editBtn.dataset.mode !== 'editing') {
        switchToEditMode(li, task, editBtn);
      } // SAVE AND RETURN TO NORMAL VIEW
      else {
        saveEditMode(li, task, editBtn);
      }
    });

    // Toggle completion.
    titleSpan.addEventListener('click', () => {
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

    // Add task content to content div
    contentDiv.appendChild(titleSpan);
    if (task.details) contentDiv.appendChild(detailsPara);
    if (task.dueDate) contentDiv.appendChild(dueDatePara);

    // Add buttons to buttons div
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(removeBtn);

    // Add task to the list array.
    li.appendChild(contentDiv);
    li.appendChild(buttonsDiv);
    taskList.appendChild(li);
  });
}

// Updating localStorage w/ new tasks / states (completed/deleted).
function saveTasks() {
  localStorage.setItem('test-site-21-tasks', JSON.stringify(tasks));
}

function switchToEditMode(li, task, editBtn) {
  editBtn.dataset.mode = 'editing';
  // Switch to save icon.
  editBtn.innerHTML = '<i class="fas fa-save"></i>';

  const contentDiv = li.querySelector('div');
  // Clearing the content div to replace with inputs.
  contentDiv.innerHTML = ''

  // Create inputs for editing
  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.value = task.text;
  textInput.classList.add('edit-text-input');

  const detailsTextArea = document.createElement('textarea');
  detailsTextArea.value = task.details;
  detailsTextArea.rows = 3;
  detailsTextArea.classList.add('edit-textarea');

  const dueDateInput = document.createElement('input');
  dueDateInput.type = 'date';
  dueDateInput.value = task.dueDate;
  dueDateInput.classList.add('edit-date-input');

  // Add inputs to content container.
  contentDiv.appendChild(textInput);
  contentDiv.appendChild(detailsTextArea);
  contentDiv.appendChild(dueDateInput);
}

function saveEditMode(li, task, editBtn) {
  editBtn.dataset.mode = '';
  // Switch (back) to edit icon.
  editBtn.innerHTML = '<i class="fas fa-pen"></i>';

  const contentDiv = li.querySelector('div');
  const inputs = contentDiv.querySelectorAll('input, textarea');
  const updatedText = inputs[0].value.trim();
  const updatedDetails = inputs[1].value.trim();
  const updatedDueDate = inputs[2].value.trim();

  if (updatedText) task.text = updatedText;
  task.details = updatedDetails;
  task.dueDate = updatedDueDate;

  saveTasks();
  renderTasks();
}