import React, { useState, useEffect, ChangeEvent } from "react";

const LOCAL_STORAGE_KEY = "todoListTasks";

interface Task {
    id: number;
    text: string;
    done: boolean;
}

function TodoList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState<string>("");

    useEffect(() => {
        const storedTasks = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_KEY) || "[]",
        ) as Task[];
        setTasks(storedTasks);
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([
                ...tasks,
                { id: Date.now(), text: newTask, done: false },
            ]);
            setNewTask("");
        }
    };

    const toggleTask = (id: number) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, done: !task.done } : task,
            ),
        );
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const startEdit = (id: number, text: string) => {
        setEditingId(id);
        setEditingText(text);
    };

    const saveEdit = (id: number) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, text: editingText } : task,
            ),
        );
        setEditingId(null);
        setEditingText("");
    };

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((task) => task.done).length;

    return (
        <div className="todo-list-container">
            <h2 className="todo-list-title">Liste de tâches</h2>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                }}
            >
                <span>Total : {totalTasks}</span>
                <span>Terminées : {doneTasks}</span>
            </div>
            <div className="todo-input-row">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewTask(e.target.value)
                    }
                    placeholder="Ajouter une nouvelle tâche"
                />
                <button onClick={addTask}>Ajouter</button>
            </div>
            <ul className="todo-list">
                {tasks.map((task) => (
                    <li key={task.id} className="todo-list-item">
                        <input
                            type="checkbox"
                            className="todo-checkbox"
                            checked={task.done}
                            onChange={() => toggleTask(task.id)}
                        />
                        {editingId === task.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingText}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) => setEditingText(e.target.value)}
                                    className="todo-edit-input"
                                />
                                <button
                                    onClick={() => saveEdit(task.id)}
                                    className="todo-action-btn save"
                                >
                                    Enregistrer
                                </button>
                            </>
                        ) : (
                            <>
                                <span
                                    className={`todo-task-text${
                                        task.done ? " done" : ""
                                    }`}
                                >
                                    {task.text}
                                </span>
                                <button
                                    onClick={() =>
                                        startEdit(task.id, task.text)
                                    }
                                    className="todo-action-btn edit"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="todo-action-btn delete"
                                >
                                    Supprimer
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
