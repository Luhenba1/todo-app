
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('my-todos')) || [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem('my-todos', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (editingId !== null) {
      setTasks(tasks.map(task =>
        task.id === editingId
          ? { ...task, text: input.trim() }
          : task
      ));
      setEditingId(null);
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: input.trim(),
          completed: false
        }
      ]);
    }

    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setInput('');
    }
  };

  const editTask = (task) => {
    setInput(task.text);
    setEditingId(task.id);
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const remainingCount = tasks.length - completedCount;

  return (
    <div className="todo-page">
      <div className="todo-card">
        <div className="todo-header">
          <div className="eyebrow">YOUR PERSONAL ORGANIZER</div>
          <h1>My Todo List <span>✦</span></h1>
          <p>Make today productive, one task at a time.</p>
        </div>

        <div className="stats">
          <div className="stat">
            <strong>{tasks.length}</strong>
            <span>Total tasks</span>
          </div>
          <div className="stat">
            <strong>{remainingCount}</strong>
            <span>Remaining</span>
          </div>
          <div className="stat">
            <strong>{completedCount}</strong>
            <span>Completed</span>
          </div>
        </div>

        <form className="todo-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit">
            {editingId !== null ? 'Update' : '+ Add'}
          </button>
        </form>

        <div className="filters">
          {['All', 'Active', 'Completed'].map(item => (
            <button
              key={item}
              className={filter === item ? 'filter active' : 'filter'}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">✧</div>
              <h3>{tasks.length === 0 ? 'Nothing here yet!' : 'No tasks found'}</h3>
              <p>Add a task and make your day count.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div className="task" key={task.id}>
                <button
                  className={task.completed ? 'check checked' : 'check'}
                  onClick={() => toggleTask(task.id)}
                  type="button"
                  aria-label="Toggle task completion"
                >
                  {task.completed ? '✓' : ''}
                </button>

                <span className={task.completed ? 'task-text done' : 'task-text'}>
                  {task.text}
                </span>

                <button
                  className="action edit"
                  onClick={() => editTask(task)}
                  type="button"
                  aria-label="Edit task"
                >
                  ✎
                </button>

                <button
                  className="action delete"
                  onClick={() => deleteTask(task.id)}
                  type="button"
                  aria-label="Delete task"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        <div className="footer">
          <span>{remainingCount} task{remainingCount !== 1 ? 's' : ''} left</span>
          <button type="button" onClick={clearCompleted}>
            Clear completed
          </button>
        </div>
      </div>
      <p className="bottom-note">Small steps. Big achievements. ✨</p>

      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          background: #f2f3fa;
          font-family: Arial, sans-serif;
        }
        .todo-page {
          min-height: 100vh;
          padding: 55px 18px;
          background: linear-gradient(135deg, #e9edff, #f8efff);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .todo-card {
          width: 100%;
          max-width: 620px;
          padding: 35px;
          background: white;
          border-radius: 22px;
          box-shadow: 0 15px 50px rgba(54, 48, 110, .12);
        }
        .todo-header { text-align: center; }
        .eyebrow {
          color: #7771c9;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 2px;
        }
        .todo-header h1 {
          margin: 12px 0 8px;
          color: #292747;
          font-size: 34px;
        }
        .todo-header h1 span { color: #8275e8; }
        .todo-header p { color: #88879a; font-size: 14px; }
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 28px 0;
        }
        .stat {
          padding: 17px 8px;
          text-align: center;
          border-radius: 13px;
          background: #f5f4ff;
        }
        .stat strong {
          display: block;
          color: #6459c7;
          font-size: 25px;
        }
        .stat span {
          display: block;
          margin-top: 5px;
          color: #88879a;
          font-size: 12px;
        }
        .todo-form { display: flex; gap: 10px; }
        .todo-form input {
          min-width: 0;
          flex: 1;
          padding: 15px;
          border: 1px solid #e4e2f1;
          border-radius: 11px;
          outline: none;
          font-size: 14px;
        }
        .todo-form input:focus { border-color: #8175dc; }
        .todo-form button {
          padding: 0 21px;
          border: none;
          border-radius: 11px;
          color: white;
          background: #7165d5;
          font-weight: bold;
          cursor: pointer;
        }
        .filters {
          display: flex;
          gap: 9px;
          margin: 24px 0 15px;
        }
        .filter {
          padding: 9px 15px;
          border: none;
          border-radius: 20px;
          background: #f3f2fa;
          color: #77748c;
          cursor: pointer;
        }
        .filter.active { color: white; background: #7165d5; }
        .task {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 5px;
          border-bottom: 1px solid #f0eff5;
        }
        .check {
          width: 21px;
          height: 21px;
          flex-shrink: 0;
          border: 2px solid #c9c5df;
          border-radius: 7px;
          background: white;
          color: white;
          cursor: pointer;
        }
        .check.checked { background: #7165d5; border-color: #7165d5; }
        .task-text { flex: 1; color: #38364f; overflow-wrap: anywhere; }
        .task-text.done { color: #aaa8b6; text-decoration: line-through; }
        .action {
          border: none;
          background: transparent;
          font-size: 21px;
          cursor: pointer;
        }
        .edit { color: #7771c9; }
        .delete { color: #e17a8a; }
        .empty { padding: 30px 10px; text-align: center; }
        .empty-icon { color: #8a7fe2; font-size: 35px; }
        .empty h3 { color: #44415f; }
        .empty p { color: #9996a8; font-size: 13px; }
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 22px;
          color: #9693a4;
          font-size: 12px;
        }
        .footer button {
          border: none;
          background: transparent;
          color: #7165d5;
          cursor: pointer;
        }
        .bottom-note {
          color: #77739b;
          font-size: 13px;
          margin-top: 22px;
        }
        @media (max-width: 480px) {
          .todo-card { padding: 23px 17px; }
          .todo-header h1 { font-size: 28px; }
          .todo-form button { padding: 0 13px; }
        }
      `}</style>
    </div>
  );
}

export default App;
