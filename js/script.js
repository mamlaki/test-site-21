const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');

taskForm.addEventListener('submit', (e) => {
  // Get task input value.
  const taskText = taskInput.value.trim();

  // Stop form submission from refreshing the page.
  e.preventDefault();

  // (check if there is anything in the input).
  if (taskText !== '') {
    // Add task list item w/ input value to list.
    addNewTask(taskText);
    // Reset input field.
    taskInput.value = '';
  }
});

function addNewTask(text) {
  // Create task entry for list.
  const li = document.createElement('li');
  li.classList.add('task-item');

  const span = document.createElement('span');
  span.classList.add('task-text');
  span.textContent = text;

  // Add a remove button for each task.
  const removeBtn = document.createElement('button');
  removeBtn.classList.add('remove-btn');
  removeBtn.textContent = 'X';
  li.appendChild(span);
  li.append(removeBtn);

  // Add task entry to list
  taskList.appendChild(li);
}

// Toggle task completion and removal.
taskList.addEventListener('click', (e) => {
  const target = e.target;

  // Toggle completed class.
  if (target.classList.contains('task-text')) {
    target.classList.toggle('completed');
  }

  // Remove button functionality.
  if (target.classList.contains('remove-btn')) {
    target.parentElement.remove();
  }
});