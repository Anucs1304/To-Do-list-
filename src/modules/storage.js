import ProjectManager from "./projectManager.js";
import { createProject } from "./project.js";
import { createTodo } from "./todo.js";

const Storage = (() => {
  const STORAGE_KEY = "todo-projects";

  const save = () => {
    const projects = ProjectManager.getProjects();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  };

  const load = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      ProjectManager.initDefaultProject();
      return;
    }

    const parsed = JSON.parse(raw);
    const rebuiltProjects = parsed.map(p => {
      const project = createProject(p.name);
      project.id = p.id;
      project.todos = p.todos.map(t => {
        const todo = createTodo(
          t.title,
          t.description,
          t.dueDate,
          t.priority
        );
        todo.id = t.id;
        todo.completed = t.completed;
        return todo;
      });
      return project;
    });

    ProjectManager.setProjects(rebuiltProjects);
    if (!ProjectManager.getCurrentProjectId() && rebuiltProjects[0]) {
      ProjectManager.setCurrentProjectId(rebuiltProjects[0].id);
    }
  };

  return { save, load };
})();

export default Storage;
