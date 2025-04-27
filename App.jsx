function App() {
    const [projects, setProjects] = React.useState(() => {
      const savedProjects = localStorage.getItem('projects');
      return savedProjects ? JSON.parse(savedProjects) : [];
    });
    const [projectInput, setProjectInput] = React.useState('');
    const [taskInputs, setTaskInputs] = React.useState({});
  
    React.useEffect(() => {
      localStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);
  
    const addProject = () => {
      if (projectInput.trim() === '') return;
      setProjects([...projects, { id: Date.now(), name: projectInput, tasks: [] }]);
      setProjectInput('');
    };
  
    const deleteProject = (id) => {
      setProjects(projects.filter(project => project.id !== id));
    };
  
    const addTask = (projectId) => {
      const taskInput = taskInputs[projectId] || { text: '', deadline: '' };
      if (taskInput.text.trim() === '') return;
  
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: [
              ...project.tasks,
              {
                id: Date.now(),
                text: taskInput.text,
                deadline: taskInput.deadline || null,
                completed: false,
              },
            ],
          };
        }
        return project;
      });
  
      setProjects(updatedProjects);
      setTaskInputs({ ...taskInputs, [projectId]: { text: '', deadline: '' } });
    };
  
    const deleteTask = (projectId, taskId) => {
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.filter(task => task.id !== taskId),
          };
        }
        return project;
      });
      setProjects(updatedProjects);
    };
  
    const toggleTaskComplete = (projectId, taskId) => {
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
          };
        }
        return project;
      });
      setProjects(updatedProjects);
    };
  
    const handleTaskInputChange = (projectId, field, value) => {
      setTaskInputs({
        ...taskInputs,
        [projectId]: { ...taskInputs[projectId], [field]: value },
      });
    };
  
    const handleKeyPressProject = (e) => {
      if (e.key === 'Enter') addProject();
    };
  
    const handleKeyPressTask = (e, projectId) => {
      if (e.key === 'Enter') addTask(projectId);
    };
  
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Планувальник проєктів</h1>
  
        {/* Додавання нового проєкту */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Додати новий проєкт</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={projectInput}
              onChange={(e) => setProjectInput(e.target.value)}
              onKeyPress={handleKeyPressProject}
              placeholder="Назва проєкту..."
              className="flex-grow p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addProject}
              className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
            >
              Додати проєкт
            </button>
          </div>
        </div>
  
        {/* Список проєктів */}
        {projects.length === 0 ? (
          <p className="text-center text-gray-500">Немає проєктів. Додайте новий!</p>
        ) : (
          projects.map(project => (
            <div key={project.id} className="mb-6 p-4 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Видалити проєкт
                </button>
              </div>
  
              {/* Додавання завдання */}
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={(taskInputs[project.id] || {}).text || ''}
                  onChange={(e) => handleTaskInputChange(project.id, 'text', e.target.value)}
                  onKeyPress={(e) => handleKeyPressTask(e, project.id)}
                  placeholder="Нове завдання..."
                  className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={(taskInputs[project.id] || {}).deadline || ''}
                  onChange={(e) => handleTaskInputChange(project.id, 'deadline', e.target.value)}
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => addTask(project.id)}
                  className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
                >
                  Додати завдання
                </button>
              </div>
  
              {/* Список завдань */}
              {project.tasks.length === 0 ? (
                <p className="text-gray-500">Немає завдань у цьому проєкті.</p>
              ) : (
                <ul className="space-y-2">
                  {project.tasks.map(task => (
                    <li
                      key={task.id}
                      className={`flex items-center justify-between p-3 border rounded-md ${
                        task.completed ? 'bg-green-100' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          onClick={() => toggleTaskComplete(project.id, task.id)}
                          className={`cursor-pointer ${
                            task.completed ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {task.text}
                        </span>
                        {task.deadline && (
                          <span className="text-sm text-gray-600">
                            (Дедлайн: {new Date(task.deadline).toLocaleDateString('uk-UA')})
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTask(project.id, task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Видалити
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    );
  }