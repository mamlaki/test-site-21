// BASE TASK FUNCTIONALITY
let tasks = [];

// PRIORITY MAPPING
const PRIORITY_MAP = {
  "low": 1,
  "medium": 2,
  "high": 3
};

const PRIORITY_LABEL = {
  1: "L",
  2: "M",
  3: "H"
};

// Normalize tasks, (CHECK IF THE PRIORITY IS A STRING, IF IT IS NOW CONVER TO A NUMBER):
function normalizeTasks(tasks) {
  tasks.forEach((task) => {
    if (typeof task.priority === 'string') {
      task.priority = PRIORITY_MAP[task.priority.toLowerCase()] || 2; // default to medium if there is no existing priority assigned.
    } else if (typeof task.priority === 'number') {
      if (task.priority < 1 || task.priority > 3) {
        taskPriority = 2;
      }
    } else {
      task.priority = 2;
    }
  });
  return tasks;
}

// Checking for previously saved tasks.
const savedTasks = localStorage.getItem('test-site-21-tasks');
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
  tasks = normalizeTasks(tasks);
  localStorage.setItem('test-site-21-tasks', JSON.stringify(tasks));
}

class Task {
  constructor(id, text, completed = false, details = '', dueDate = '', priority = 2) {
    this.id = id;
    this.text = text;
    this.completed = completed;
    this.details = details;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}

const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
const taskDetailsInput = document.querySelector('#taskDetails');
const taskDueDateInput = document.querySelector('#taskDueDate');
const taskPrioritySelect = document.querySelector('#taskPriority');
// FOR TASK FILTER FUNCTIONALITY
const showAllBtn = document.querySelector('#showAllBtn');
const showActiveBtn = document.querySelector('#showActiveBtn');
const showCompletedBtn = document.querySelector('#showCompletedBtn');
// FOR PRIORITY FILTERING FUNCTIONALITY
const priorityFilerSelect = document.querySelector('#priorityFilterSelect');
let currentPriorityFilter = 'all';
// FOR PRIORITY SORTING FUNCTIONALITY
const prioritySortBtn = document.querySelector('#prioritySortBtn');
let sortState = 'off'; // will toggle between off, ascending, and descending.
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
});

showActiveBtn.addEventListener('click', () => {
  currentFilter = 'active';
  renderTasks();
});

showCompletedBtn.addEventListener('click', () => {
  currentFilter = 'completed';
  renderTasks();
});

priorityFilerSelect.addEventListener('change', () => {
  currentPriorityFilter = priorityFilerSelect.value;
  renderTasks();
});

prioritySortBtn.addEventListener('click', () => {
  if (sortState === 'off') {
    sortState = 'asc';
    prioritySortBtn.textContent = 'Low ➡️ High';
    prioritySortBtn.classList.add('priority-btn-sort-toggle');
  } else if (sortState === 'asc') {
    sortState = 'desc';
    prioritySortBtn.textContent = 'High ➡️ Low';
    prioritySortBtn.classList.add('priority-btn-sort-toggle');
  } else if (sortState === 'desc') {
    sortState = 'off';
    prioritySortBtn.textContent = 'Sort by Priority [Off]'
    prioritySortBtn.classList.remove('priority-btn-sort-toggle');
  }

  renderTasks();
});

renderTasks();

// TASK FORM
taskForm.addEventListener('submit', (e) => {
  // Stop form submission from refreshing the page.
  e.preventDefault();

  // Get task input value.
  const taskText = taskInput.value.trim();
  const taskDetails = taskDetailsInput.value.trim();
  const taskDueDate = taskDueDateInput.value;
  const priorityString = taskPrioritySelect.value;
  const numericPriority = PRIORITY_MAP[priorityString.toLowerCase()] || 2;

  // (check if there is anything in the input).
  if (taskText !== '') {
    // Add task list item (created w/ the Task class) w/ input value to list (tasks array).
    const newTask = new Task(Date.now(), taskText, false, taskDetails, taskDueDate, numericPriority);
    tasks.unshift(newTask);
    saveTasks();
    // Render task list, now w/ new addition.
    renderTasks();
    // Reset input field.
    taskInput.value = '';
    taskDetailsInput.value = '';
    taskDueDateInput.value = '';
    taskPrioritySelect.value = 'medium';
  }
  
});

function renderTasks() {
  // Reset task list.
  taskList.innerHTML = '';
  let filteredTasks = [...tasks];
  // Filter tasks logic.  
  if (currentFilter === 'active') {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  }

  if (currentPriorityFilter !== 'all') {
    const filterVal = PRIORITY_MAP[currentPriorityFilter.toLocaleLowerCase()] || 2;
    filteredTasks = filteredTasks.filter((task) => task.priority === filterVal);
  }

  if (sortState !== 'off') {
    if (sortState === 'asc') {
      filteredTasks.sort((a, b) => a.priority - b.priority);
    } else if (sortState === 'desc') {
      filteredTasks.sort((a, b) => b.priority - a.priority);
    }
  }

  console.log("Final tasks after sort: ", filteredTasks);

  // Re-add tasks to the task list, updated.
  filteredTasks.forEach((task) => {
    // Create task entry for list.
    const li = document.createElement('li');
    li.classList.add('task-item');

    // Colour code task card based on priority.
    if (task.priority === 1) {
      li.classList.add('priority-low');
    } else if (task.priority === 2) {
      li.classList.add('priority-medium');
    } else if (task.priority === 3) {
      li.classList.add('priority-high');
    }

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
    dueDatePara.classList.add('task-content-due-date');
    if (task.dueDate) {
      dueDatePara.textContent = `Due: ${task.dueDate}`;
    } else {
      dueDatePara.textContent = 'No due date.';
    }

    // Priority
    const priorityPara = document.createElement('p');
    priorityPara.classList.add('task-content-priority');
    priorityPara.textContent = `Priority: ${PRIORITY_LABEL[task.priority]}`;

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
    if (task.priority) contentDiv.appendChild(priorityPara);

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

  const prioritySelect = document.createElement('select');
  prioritySelect.classList.add('edit-priority-select');

  const priorityOptions = ['low', 'medium', 'high'];
  priorityOptions.forEach((val) => {
    const option = document.createElement('option');
    option.value = val;
    option.textContent = `Priority: ${val.charAt(0).toUpperCase()}`;

    if (task.priority === PRIORITY_MAP[val]) {
      option.selected = true;
    }

    prioritySelect.appendChild(option);
  })

  // Add inputs to content container.
  contentDiv.appendChild(textInput);
  contentDiv.appendChild(detailsTextArea);
  contentDiv.appendChild(dueDateInput);
  contentDiv.appendChild(prioritySelect);
}

function saveEditMode(li, task, editBtn) {
  editBtn.dataset.mode = '';
  // Switch (back) to edit icon.
  editBtn.innerHTML = '<i class="fas fa-pen"></i>';

  const contentDiv = li.querySelector('div');
  const inputs = contentDiv.querySelectorAll('input, textarea, select');
  const updatedText = inputs[0].value.trim();
  const updatedDetails = inputs[1].value.trim();
  const updatedDueDate = inputs[2].value.trim();
  const updatedPriorityString = inputs[3].value.toLowerCase();
  const updatedPriorityNumber = PRIORITY_MAP[updatedPriorityString] || 2; 

  if (updatedText) task.text = updatedText;
  task.details = updatedDetails;
  task.dueDate = updatedDueDate;
  task.priority = updatedPriorityNumber;

  saveTasks();
  renderTasks();
}

