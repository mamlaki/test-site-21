let tasks = [];

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
    // Render task list, now w/ new addition.
    renderTasks();
    // Reset input field.
    taskInput.value = '';
  }
  
});

function renderTasks() {
  // Reset task list.
  taskList.innerHTML = '';
  
  // Re-add tasks to the task list, updated.
  tasks.forEach((task) => {
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
      renderTasks();
    });

    // Remove button functionality.
    removeBtn.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      renderTasks();
    });

    // Add task to the list array.
    li.appendChild(span);
    li.appendChild(removeBtn);
    taskList.appendChild(li);
  });
}