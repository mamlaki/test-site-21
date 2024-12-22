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
    contentDiv.style.display = 'flex';
    contentDiv.style.flexDirection = 'column';
    contentDiv.style.flexGrow = '1';

    // Title
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('task-text');
    titleSpan.textContent = task.text;

    // Assign completed styles if marked as such.
    if (task.completed) titleSpan.classList.add('completed');


    // Details
    const detailsPara = document.createElement('p');
    detailsPara.textContent = task.details;
    detailsPara.style.marginTop = '0.25rem';

    // Due Date
    const dueDatePara = document.createElement('p');
    if (task.dueDate) {
      dueDatePara.textContent = `Due: ${task.dueDate}`;
    } else {
      dueDatePara.textContent = 'No due date.';
    }

    // Buttons Container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.gap = '0.5rem';

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
      if (editBtn.textContent === 'Edit') {
        // Create text field for editing.
        const editInput = document.createElement('input');
        editInput.type = 'text';
        // Current task name.
        editInput.value = task.text;
        // Replace the span (aka the task name) with the new input field.
        li.replaceChild(editInput, titleSpan);
        // Save button.
        editBtn.textContent = 'Save';
      } // SAVE MODE (BELOW)
      else {
        const editInput = li.querySelector('input[type="text"]');
        console.log(editInput);
        const updatedText = editInput.value.trim();

        // Update the task with the new text from the edit input + save to localStorage.
        if (updatedText !== '') {
          task.text = updatedText;
          saveTasks();
        }

        // Re-render the task list, which is now updated.
        renderTasks();
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