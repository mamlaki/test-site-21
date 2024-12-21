const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');

taskForm.addEventListener('submit', (e) => {
  // Get task input value.
  const taskText = taskInput.value.trim();

  e.preventDefault();

  // (check if there is anything in the input).
  if (taskText !== '') {
    // Create task list item w/ input value.
    const li = document.createElement('li');
    li.textContent = taskText;
    taskList.appendChild(li);

    // Reset input field.
    taskInput.value = '';
  }
});