import ProjectManager from "./projectManager.js";
import Storage from "./storage.js";

const UI = (() => {
  const projectListEl = document.querySelector("#project-list");
  const todoListEl = document.querySelector("#todo-list");
  const todoDetailsEl = document.querySelector("#todo-details");

  const renderProjects = () => {
    projectListEl.innerHTML = "";
    ProjectManager.getProjects().forEach(project => {
      const li = document.createElement("li");
      li.textContent = project.name;
      li.dataset.id = project.id;
      if (project.id === ProjectManager.getCurrentProjectId()) {
        li.classList.add("active");
      }
      li.addEventListener("click", () => {
        ProjectManager.setCurrentProjectId(project.id);
        renderProjects();
        renderTodos();
      });
      projectListEl.appendChild(li);
    });
  };

  const renderTodos = () => {
    const project = ProjectManager.getProjectById(
      ProjectManager.getCurrentProjectId()
    );
    if (!project) return;

    todoListEl.innerHTML = "";
    project.todos.forEach(todo => {
      const div = document.createElement("div");
      div.classList.add("todo-item");
      div.dataset.id = todo.id;

      div.innerHTML = `
        <span class="title">${todo.title}</span>
        <span class="due">${todo.dueDate}</span>
      `;

      div.addEventListener("click", () => renderTodoDetails(todo));
      todoListEl.appendChild(div);
    });
  };

  const renderTodoDetails = (todo) => {
    todoDetailsEl.innerHTML = `
      <h2>${todo.title}</h2>
      <p>${todo.description}</p>
      <p>Due: ${todo.dueDate}</p>
      <p>Priority: ${todo.priority}</p>
      <button id="delete-todo">Delete</button>
    `;

    document
      .querySelector("#delete-todo")
      .addEventListener("click", () => {
        ProjectManager.deleteTodo(
          ProjectManager.getCurrentProjectId(),
          todo.id
        );
        Storage.save();
        renderTodos();
        todoDetailsEl.innerHTML = "";
      });
  };

  const bindNewProjectForm = () => {
    const form = document.querySelector("#new-project-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.elements["name"].value.trim();
      if (!name) return;
      const project = ProjectManager.addProject(name);
      ProjectManager.setCurrentProjectId(project.id);
      Storage.save();
      form.reset();
      renderProjects();
      renderTodos();
    });
  };

  const bindNewTodoForm = () => {
    const form = document.querySelector("#new-todo-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        title: form.elements["title"].value,
        description: form.elements["description"].value,
        dueDate: form.elements["dueDate"].value,
        priority: form.elements["priority"].value,
      };
      ProjectManager.addTodoToProject(
        ProjectManager.getCurrentProjectId(),
        data
      );
      Storage.save();
      form.reset();
      renderTodos();
    });
  };

  const init = () => {
    Storage.load();
    bindNewProjectForm();
    bindNewTodoForm();
    renderProjects();
    renderTodos();
  };

  return { init };
})();

export default UI;
