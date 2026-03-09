import React, { useState, useEffect, ChangeEvent } from "react";
import "./TodoList.css";

const LOCAL_STORAGE_KEY = "todoListTasks";

interface Task {
    id: number;
    text: string;
    done: boolean;
    priority: "Haute" | "Moyenne" | "Faible";
    dueDate?: string;
    category?: string;
    tags?: string[];
}

const PRIORITIES = ["Haute", "Moyenne", "Faible"];
const CATEGORIES = ["Travail", "Personnel", "Autre"];

function TodoList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState<string>("");
    const [priority, setPriority] = useState<"Haute" | "Moyenne" | "Faible">(
        "Moyenne",
    );
    const [dueDate, setDueDate] = useState<string>("");
    const [category, setCategory] = useState<string>("Autre");
    const [tags, setTags] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [filterPriority, setFilterPriority] = useState<string>("");
    const [filterCategory, setFilterCategory] = useState<string>("");
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const storedTasks = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_KEY) || "[]",
        ) as Task[];
        setTasks(storedTasks);
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([
                ...tasks,
                {
                    id: Date.now(),
                    text: newTask,
                    done: false,
                    priority,
                    dueDate: dueDate || undefined,
                    category,
                    tags: tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                },
            ]);
            setNewTask("");
            setPriority("Moyenne");
            setDueDate("");
            setCategory("Autre");
            setTags("");
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

    // Filter and search logic
    const filteredTasks = tasks
        .filter(
            (task) =>
                (!filterPriority || task.priority === filterPriority) &&
                (!filterCategory || task.category === filterCategory) &&
                (!search ||
                    task.text.toLowerCase().includes(search.toLowerCase()) ||
                    (task.tags &&
                        task.tags.some((tag) =>
                            tag.toLowerCase().includes(search.toLowerCase()),
                        ))),
        )
        .sort(
            (a, b) =>
                PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority),
        );

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((task) => task.done).length;
    const completion = totalTasks
        ? Math.round((doneTasks / totalTasks) * 100)
        : 0;

    return (
        <div
            className={`todo-list-container${darkMode ? " dark" : ""}`}
            aria-label="Liste de tâches"
        >
            <div className="todo-list-header">
                <h2 className="todo-list-title">Liste de tâches</h2>
                <button
                    className="dark-mode-toggle"
                    onClick={() => setDarkMode(!darkMode)}
                    aria-label="Basculer le mode sombre"
                >
                    {darkMode ? "☀️" : "🌙"}
                </button>
            </div>
            <div className="todo-progress-bar" aria-label="Progression">
                <div
                    className="progress-bar"
                    style={{ width: `${completion}%` }}
                ></div>
                <span>{completion}% complété</span>
            </div>
            <div className="todo-stats-row">
                <span>Total : {totalTasks}</span>
                <span>Terminées : {doneTasks}</span>
            </div>
            <div className="todo-search-filter-row">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher..."
                    aria-label="Rechercher des tâches"
                />
                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    aria-label="Filtrer par priorité"
                >
                    <option value="">Priorité</option>
                    {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    aria-label="Filtrer par catégorie"
                >
                    <option value="">Catégorie</option>
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>
            <div className="todo-input-row">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewTask(e.target.value)
                    }
                    placeholder="Ajouter une nouvelle tâche"
                    aria-label="Nouvelle tâche"
                />
                <select
                    value={priority}
                    onChange={(e) =>
                        setPriority(
                            e.target.value as "Haute" | "Moyenne" | "Faible",
                        )
                    }
                    aria-label="Priorité de la tâche"
                >
                    {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    aria-label="Date d'échéance"
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label="Catégorie de la tâche"
                >
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Tags (séparés par des virgules)"
                    aria-label="Tags de la tâche"
                />
                <button onClick={addTask} aria-label="Ajouter la tâche">
                    Ajouter
                </button>
            </div>
            <ul className="todo-list">
                {filteredTasks.map((task) => (
                    <li
                        key={task.id}
                        className={`todo-list-item priority-${task.priority.toLowerCase()}${task.done ? " done" : ""}${task.dueDate && new Date(task.dueDate) < new Date() && !task.done ? " overdue" : ""}`}
                        aria-label={`Tâche : ${task.text}`}
                    >
                        <input
                            type="checkbox"
                            className="todo-checkbox"
                            checked={task.done}
                            onChange={() => toggleTask(task.id)}
                            aria-label="Marquer comme terminée"
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
                                    aria-label="Modifier le texte de la tâche"
                                />
                                <button
                                    onClick={() => saveEdit(task.id)}
                                    className="todo-action-btn save"
                                    aria-label="Enregistrer la modification"
                                >
                                    Enregistrer
                                </button>
                            </>
                        ) : (
                            <>
                                <span
                                    className={`todo-task-text${task.done ? " done" : ""}`}
                                >
                                    {task.text}
                                </span>
                                <span className="todo-task-meta">
                                    <span className="todo-priority">
                                        {task.priority}
                                    </span>
                                    {task.dueDate && (
                                        <span className="todo-due-date">
                                            Échéance : {task.dueDate}
                                        </span>
                                    )}
                                    {task.category && (
                                        <span className="todo-category">
                                            Catégorie : {task.category}
                                        </span>
                                    )}
                                    {task.tags && task.tags.length > 0 && (
                                        <span className="todo-tags">
                                            Tags : {task.tags.join(", ")}
                                        </span>
                                    )}
                                    {task.dueDate &&
                                        new Date(task.dueDate) < new Date() &&
                                        !task.done && (
                                            <span className="todo-overdue">
                                                En retard !
                                            </span>
                                        )}
                                </span>
                                <button
                                    onClick={() =>
                                        startEdit(task.id, task.text)
                                    }
                                    className="todo-action-btn edit"
                                    aria-label="Modifier la tâche"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="todo-action-btn delete"
                                    aria-label="Supprimer la tâche"
                                >
                                    Supprimer
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            {/* Motivational features: streaks, badges */}
            <div className="todo-motivation-row">
                <span>Série : {doneTasks} jours</span>
                {completion === 100 && (
                    <span className="todo-badge">
                        🏆 Bravo, toutes les tâches sont terminées !
                    </span>
                )}
            </div>
        </div>
    );
}

export default TodoList;
