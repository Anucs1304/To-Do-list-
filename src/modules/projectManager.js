import { createProject } from "./project.js";
import { createTodo } from "./todo.js";

const ProjectManager = (() => {
  let projects = [];
  let currentProjectId = null;

  const initDefaultProject = () => {
    if (projects.length === 0) {
      const defaultProject = createProject("Default");
      projects.push(defaultProject);
      currentProjectId = defaultProject.id;
    }
  };

  const getProjects = () => projects;

  const setProjects = (newProjects) => {
    projects = newProjects;
  };

  const getCurrentProjectId = () => currentProjectId;

  const setCurrentProjectId = (id) => {
    currentProjectId = id;
  };

  const getProjectById = (id) => {
    return projects.find((p) => p.id === id);
  };

  const addProject = (name) => {
    const project = createProject(name);
    projects.push(project);
    return project;
  };

  const deleteProject = (id) => {
    projects = projects.filter((p) => p.id !== id);

    if (currentProjectId === id) {
      currentProjectId = projects.length > 0 ? projects[0].id : null;
    }
  };

  const addTodoToProject = (projectId, todoData) => {
    const project = getProjectById(projectId);
    if (!project) return null;

    const todo = createTodo(
      todoData.title,
      todoData.description,
      todoData.dueDate,
      todoData.priority
    );

    project.todos.push(todo);
    return todo;
  };

  const deleteTodo = (projectId, todoId) => {
    const project = getProjectById(projectId);
    if (!project) return;

    project.todos = project.todos.filter((t) => t.id !== todoId);
  };

  const toggleTodoCompleted = (projectId, todoId) => {
    const project = getProjectById(projectId);
    if (!project) return;

    const todo = project.todos.find((t) => t.id === todoId);
    if (todo) {
      todo.completed = !todo.completed;
    }
  };

  const updateTodo = (projectId, todoId, updates) => {
    const project = getProjectById(projectId);
    if (!project) return;

    const todo = project.todos.find((t) => t.id === todoId);
    if (!todo) return;

    Object.assign(todo, updates);
  };
  
  return {
    initDefaultProject,
    getProjects,
    setProjects,
    getCurrentProjectId,
    setCurrentProjectId,
    addProject,
    deleteProject,
    getProjectById,
    addTodoToProject,
    deleteTodo,
    toggleTodoCompleted,
    updateTodo,
  };
})();

export default ProjectManager;
