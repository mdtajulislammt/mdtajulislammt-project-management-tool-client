import React from 'react';

const demoTasks = [
  { id: 1, title: 'Design UI', completed: false },
  { id: 2, title: 'Set up Redux', completed: true },
  { id: 3, title: 'Implement Routing', completed: false },
];

const TaskList: React.FC = () => {
  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {demoTasks.map(task => (
          <li key={task.id}>
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            {task.completed && <span style={{ color: 'green', marginLeft: 8 }}>(Done)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;