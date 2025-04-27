// Компонент Analytics
function Analytics({ tasks }) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'завершене').length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
    return (
      <div className="mb-4">
        <h4 className="text-lg font-semibold">Прогрес проєкту</h4>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Завершено: {completedTasks} з {totalTasks} завдань ({progress.toFixed(1)}%)
        </p>
      </div>
    );
  }
  
  // Компонент TaskList
  function TaskList({ projectId, tasks, members, addTask, editTask, deleteTask, addComment }) {
    const [newTask, setNewTask] = React.useState({
      text: '',
      deadline: '',
      status: 'нове',
      assignedTo: '',
    });
    const [filterStatus, setFilterStatus] = React.useState('всі');
    const [editingTask, setEditingTask] = React.useState(null);
    const [newComment, setNewComment] = React.useState({});
  
    const handleAddTask = () => {
      if (newTask.text.trim() === '') return;
      addTask(projectId, {
        id: Date.now(),
        text: newTask.text,
        deadline: newTask.deadline || null,
        status: newTask.status,
        assignedTo: newTask.assignedTo || null,
        comments: [],
      });
      setNewTask({ text: '', deadline: '', status: 'нове', assignedTo: '' });
    };
  
    const handleEditTask = (task) => {
      setEditingTask(task);
      setNewTask({
        text: task.text,
        deadline: task.deadline || '',
        status: task.status,
        assignedTo: task.assignedTo || '',
      });
    };
  
    const handleSaveEdit = () => {
      if (newTask.text.trim() === '') return;
      editTask(projectId, editingTask.id, {
        text: newTask.text,
        deadline: newTask.deadline || null,
        status: newTask.status,
        assignedTo: newTask.assignedTo || null,
      });
      setEditingTask(null);
      setNewTask({ text: '', deadline: '', status: 'нове', assignedTo: '' });
    };
  
    const handleAddComment = (taskId) => {
      if (newComment[taskId]?.trim() === '') return;
      addComment(projectId, taskId, newComment[taskId]);
      setNewComment({ ...newComment, [taskId]: '' });
    };
  
    const filteredTasks =
      filterStatus === 'всі'
        ? tasks
        : tasks.filter(task => task.status === filterStatus);
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        editingTask ? handleSaveEdit() : handleAddTask();
      }
    };
  
    return (
      <div>
        {/* Додавання/редагування завдання */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">
            {editingTask ? 'Редагувати завдання' : 'Додати завдання'}
          </h4>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={newTask.text}
              onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="Текст завдання..."
              className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="нове">Нове</option>
              <option value="в процесі">В процесі</option>
              <option value="завершене">Завершене</option>
            </select>
            <select
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Не призначено</option>
              {members.map(member => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
            <button
              onClick={editingTask ? handleSaveEdit : handleAddTask}
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
            >
              {editingTask ? 'Зберегти' : 'Додати'}
            </button>
            {editingTask && (
              <button
                onClick={() => setEditingTask(null)}
                className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition"
              >
                Скасувати
              </button>
            )}
          </div>
        </div>
  
        {/* Фільтрація завдань */}
        <div className="mb-4">
          <label className="mr-2">Фільтрувати за статусом:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="всі">Всі</option>
            <option value="нове">Нове</option>
            <option value="в процесі">В процесі</option>
            <option value="завершене">Завершене</option>
          </select>
        </div>
  
        {/* Список завдань */}
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500">Немає завдань.</p>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map(task => (
              <li
                key={task.id}
                className={`p-3 border rounded-md ${
                  task.status === 'завершене'
                    ? 'bg-green-100'
                    : task.status === 'в процесі'
                    ? 'bg-yellow-100'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{task.text}</p>
                    <p className="text-sm text-gray-600">
                      Статус: {task.status} | Призначено: {task.assignedTo || 'Ніхто'}
                      {task.deadline &&
                        ` | Дедлайн: ${new Date(task.deadline).toLocaleDateString('uk-UA')}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      Редагувати
                    </button>
                    <button
                      onClick={() => deleteTask(projectId, task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Видалити
                    </button>
                  </div>
                </div>
  
                {/* Коментарі */}
                <div className="mt-2">
                  <h5 className="text-sm font-semibold">Коментарі:</h5>
                  {task.comments?.length > 0 ? (
                    <ul className="ml-4 text-sm text-gray-700">
                      {task.comments.map((comment, index) => (
                        <li key={index}>- {comment}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Немає коментарів.</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newComment[task.id] || ''}
                      onChange={(e) =>
                        setNewComment({ ...newComment, [task.id]: e.target.value })
                      }
                      placeholder="Додати коментар..."
                      className="flex-grow p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleAddComment(task.id)}
                      className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600 transition"
                    >
                      Додати
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  
  // Компонент ProjectList
  function ProjectList({
    projects,
    addProject,
    editProject,
    deleteProject,
    addTask,
    editTask,
    deleteTask,
    addComment,
  }) {
    const [newProjectName, setNewProjectName] = React.useState('');
    const [newMembers, setNewMembers] = React.useState('');
    const [editingProject, setEditingProject] = React.useState(null);
  
    const handleAddProject = () => {
      if (newProjectName.trim() === '') return;
      const members = newMembers
        .split(',')
        .map(member => member.trim())
        .filter(member => member !== '');
      addProject(newProjectName, members);
      setNewProjectName('');
      setNewMembers('');
    };
  
    const handleEditProject = (project) => {
      setEditingProject(project);
      setNewProjectName(project.name);
      setNewMembers(project.members.join(', '));
    };
  
    const handleSaveEdit = () => {
      if (newProjectName.trim() === '') return;
      const members = newMembers
        .split(',')
        .map(member => member.trim())
        .filter(member => member !== '');
      editProject(editingProject.id, newProjectName, members);
      setEditingProject(null);
      setNewProjectName('');
      setNewMembers('');
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        editingProject ? handleSaveEdit() : handleAddProject();
      }
    };
  
    return (
      <div>
        {/* Додавання/редагування проєкту */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {editingProject ? 'Редагувати проєкт' : 'Додати новий проєкт'}
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Назва проєкту..."
              className="flex-grow p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newMembers}
              onChange={(e) => setNewMembers(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Учасники (через кому)..."
              className="flex-grow p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={editingProject ? handleSaveEdit : handleAddProject}
              className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
            >
              {editingProject ? 'Зберегти' : 'Додати проєкт'}
            </button>
            {editingProject && (
              <button
                onClick={() => setEditingProject(null)}
                className="bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 transition"
              >
                Скасувати
              </button>
            )}
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
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    Редагувати
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Видалити
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Учасники: {project.members.join(', ') || 'Немає учасників'}
              </p>
              <Analytics tasks={project.tasks} />
              <TaskList
                projectId={project.id}
                tasks={project.tasks}
                members={project.members}
                addTask={addTask}
                editTask={editTask}
                deleteTask={deleteTask}
                addComment={addComment}
              />
            </div>
          ))
        )}
      </div>
    );
  }
  
  // Основний компонент App
  function App() {
    const [projects, setProjects] = React.useState(() => {
      const savedProjects = localStorage.getItem('projects');
      return savedProjects
        ? JSON.parse(savedProjects)
        : [
            {
              id: Date.now(),
              name: "Демо проєкт",
              members: ["Олександр", "Марія"],
              tasks: [
                {
                  id: Date.now(),
                  text: "Створити дизайн",
                  deadline: "2025-05-01",
                  status: "в процесі",
                  comments: ["Потрібно додати кольори"],
                  assignedTo: "Олександр",
                },
              ],
            },
          ];
    });
  
    React.useEffect(() => {
      localStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);
  
    const addProject = (name, members) => {
      setProjects([...projects, { id: Date.now(), name, members, tasks: [] }]);
    };
  
    const editProject = (id, name, members) => {
      setProjects(
        projects.map(project =>
          project.id === id ? { ...project, name, members } : project
        )
      );
    };
  
    const deleteProject = (id) => {
      setProjects(projects.filter(project => project.id !== id));
    };
  
    const addTask = (projectId, task) => {
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          return { ...project, tasks: [...project.tasks, task] };
        }
        return project;
      });
      setProjects(updatedProjects);
    };
  
    const editTask = (projectId, taskId, updatedTask) => {
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId ? { ...task, ...updatedTask } : task
            ),
          };
        }
        return project;
      });
      setProjects(updatedProjects);
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
  
    const addComment = (projectId, taskId, comment) => {
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId
                ? { ...task, comments: [...(task.comments || []), comment] }
                : task
            ),
          };
        }
        return project;
      });
      setProjects(updatedProjects);
    };
  
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8">Платформа управління проєктами</h1>
        <ProjectList
          projects={projects}
          addProject={addProject}
          editProject={editProject}
          deleteProject={deleteProject}
          addTask={addTask}
          editTask={editTask}
          deleteTask={deleteTask}
          addComment={addComment}
        />
      </div>
    );
  }