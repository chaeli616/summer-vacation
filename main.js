document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle Logic ---
  const themeToggle = document.querySelector('#checkbox');
  const currentTheme = localStorage.getItem('theme');

  // Initial theme check
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
      themeToggle.checked = true;
    }
  } else {
    // Default to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.checked = true;
    }
  }

  // Switch Theme function
  function switchTheme(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  themeToggle.addEventListener('change', switchTheme, false);

  // --- CTA Explore Button Smooth Scroll ---
  const exploreBtn = document.getElementById('explore-btn');
  const mainContent = document.querySelector('.container');

  if (exploreBtn && mainContent) {
    exploreBtn.addEventListener('click', () => {
      mainContent.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- Checklist App Logic ---
  const todoInput = document.getElementById('todo-input');
  const btnAdd = document.getElementById('btn-add');
  const todoList = document.getElementById('todo-list');

  // Load from localStorage or use defaults
  let todos = JSON.parse(localStorage.getItem('summer-todos')) || [
    { id: 1, text: '☀️ Pack sunscreen & sunglasses', completed: false },
    { id: 2, text: '✈️ Confirm flight & hotel bookings', completed: false },
    { id: 3, text: '🛂 Check passport validity', completed: true },
    { id: 4, text: '🔌 Pack universal power adapter', completed: false }
  ];

  // Save todos to localStorage
  function saveTodos() {
    localStorage.setItem('summer-todos', JSON.stringify(todos));
  }

  // Render Todos
  function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `list-item ${todo.completed ? 'completed' : ''}`;
      li.dataset.id = todo.id;

      li.innerHTML = `
        <div class="list-item-content">
          <div class="checkbox-custom">✓</div>
          <span>${escapeHTML(todo.text)}</span>
        </div>
        <button class="btn-delete">×</button>
      `;

      // Event Listeners for completion toggle
      li.querySelector('.list-item-content').addEventListener('click', () => {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
      });

      // Event Listener for delete
      li.querySelector('.btn-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        todos = todos.filter(t => t.id !== todo.id);
        saveTodos();
        renderTodos();
      });

      todoList.appendChild(li);
    });
  }

  // Add a new todo item
  function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;

    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
  }

  // Event Listeners for Add Button
  btnAdd.addEventListener('click', addTodo);
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });

  // Helper to prevent XSS
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Initial Render
  renderTodos();
});