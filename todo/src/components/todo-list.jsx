import React, { useState } from 'react'
import TodoForm from './todo-form'
import Todo from './todo'

function TodoList() {

    const [todos, setTodos] = useState([]);

    const addTodo = (todo) => {
        const newTodos = [todo, ...todos]
        setTodos(newTodos)
    };

    const handleDelete = (id) => {
        const newTodos = todos.filter((todo) => todo.id !== id);
        setTodos(newTodos);
    }

    const handleEdit = (id, newValue) => {
        setTodos((todos) => todos.map(item => (item.id === id ? newValue : item)))
    }

    return (
        <div className="todo-app">
            <h1>To Do</h1>
            <TodoForm onSubmit={addTodo} />
            <Todo
                todos={todos}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    )
}

export default TodoList
