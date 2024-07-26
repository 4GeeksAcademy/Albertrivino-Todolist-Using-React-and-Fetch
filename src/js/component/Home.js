import React, { useEffect, useState } from "react";

//create your first component
const Home = () => {
    const [todo, setTodo] = useState([]); //usestate es el hook
    const [taskEntry, setTaskEntry] = useState("");
    const [editingTask, setEditingTask] = useState(null); // Nuevo estado para manejar la tarea en edición
    const [editingTaskId, setEditingTaskId] = useState(null); // Nuevo estado para manejar la id de la tarea en edición
    const [isNewTodo, setIsNewTodo] = useState(false);

    const taskDelete = (id) => {
        const updatedTodos = todo.filter((tarea) => tarea.id !== id);
        deleteTodo(id, updatedTodos);
    };

    const editTodo = (id, task) => {
        setEditingTask(task);
        setTaskEntry(task.label);
        setEditingTaskId(id);
    };

    function getTodos() {
        fetch('https://playground.4geeks.com/todo/users/albertrivino', {
            method: "GET",
        })
            .then(resp => {
                if (!resp.ok) {                 // solicitud para crear nueva lista en caso de 404
                    if (resp.status === 404) {
                        return createTodoList();
                    }
                    throw new Error("Error fetching todos");
                }
                return resp.json(); // Intentará parsear el resultado a JSON y retornará una promesa donde puedes usar .then para seguir con la lógica
            })
            .then(data => {
                if (data && data.todos) {
                    setTodo(data.todos); // asumiendo que data es array y no un objeto con una propiedad "todos"
                }})
            .catch(error => {
                // Manejo de errores
                console.log(error);
            });
    };
    function createTodoList() {             // funcion para crear usuario otra vez, cuando la API se resetea
        fetch('https://playground.4geeks.com/todo/users/albertrivino', {
            method: "POST",
            body: JSON.stringify([]),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error("Error creating todo list");
                }
                return resp.json();
            })
            .then(data => {
                console.log("Todo list created:", data);
                setTodo([]);
            })
            .catch(error => {
                // Manejo de errores
                console.log(error);
            });
    }

    function postTodo(newTask) {
        fetch("https://playground.4geeks.com/todo/todos/albertrivino", {
            method: "POST",
            body: JSON.stringify(newTask),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                return resp.json();
            })
            .then(() => {
                setTodo([...todo, newTask])
                setIsNewTodo(!isNewTodo)
            })
            .catch(error => {
                // Manejo de errores
                console.log(error);
            });
    }

    function deleteTodo(id, updatedTodos) {
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: "DELETE",
        })
            .then(resp => {
                if (resp.ok) {
                    setTodo(updatedTodos);
                }
                return resp.text();
            })
            .then(data =>
                console.log(data)
            ).catch(error => {
                // Manejo de errores
                console.log(error);
            });
    }

    function putTodo(id, editTask) {
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: "PUT",
            body: JSON.stringify(editTask),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                return resp.json();
            })
            .then(() => {
                const updatedTodos = todo.map(task => task.id === id ? { ...task, label: editTask.label } : task);
                setTodo(updatedTodos);
                setEditingTask(null);
                setTaskEntry("");
                setEditingTaskId(null);
            })
            .catch(error => {
                // Manejo de errores
                console.log(error);
            });
    }

    useEffect(() => {
        getTodos();
    }, [isNewTodo])

    return (
        <div className="text-center container mt-5">
            <form>
                <div className="mb-3">
                    <label htmlFor="exampleTodos" className="form-label h1">TODO'S</label>
                    <input type="text" className="form-control" id="exampleTodos" aria-describedby="emailHelp" placeholder="What needs to be done?"
                        value={taskEntry}
                        onChange={(e) => {
                            setTaskEntry(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && taskEntry.trim()) {
                                e.preventDefault();
                                if (editingTask) {
                                    const updatedTask = { ...editingTask, label: taskEntry };
                                    putTodo(editingTaskId, updatedTask);
                                } else {
                                    const newTask = { label: taskEntry, is_done: false };
                                    postTodo(newTask);
                                }
                                setTaskEntry("");
                            }
                        }}
                    />
                    <div id="emailHelp" className="form-text">This is your to-do list</div>
                    <div className=" d-md-flex justify-content-md-end">
                        <button className="btn btn-danger" onClick={() => {
                            setTodo([])
                        }}>All clear</button></div>
                </div>
                <div className="text-start d-md-flex justify-content-md-start">
                    <ul>
                        {todo.map((tarea, index) => {
                            return (
                                <li key={index}>
                                    {tarea.label}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-warning ms-2"
                                        onClick={() => taskDelete(tarea.id)}
                                    >
                                        <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success ms-2"
                                        onClick={() => editTodo(tarea.id, tarea)}
                                    >
                                        <i className="fa-solid fa-pencil"></i>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </form>
        </div>
    )
};

export default Home;