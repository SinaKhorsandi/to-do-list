import React, { useState } from "react";
import Todo from "./todo";
import TodoForm from "./todo-form";

function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    const newTodos = [todo, ...todos];
    setTodos(newTodos);
  };

  const handleDelete = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const handleEdit = (id, value) => {
    setTodos((todos) => todos.map((todo) => (todo.id === id ? value : todo)));
  };

  const handeleComplete = (id) => {
    const updateTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.isCompleted = !todo.isCompleted;
      }
      return todo;
    });
    setTodos(updateTodos);
  };
  const handleClear = () => {
    setTodos([]);
  };

  return (
    <div className="todo-app">
      <h1>To Do</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        onDelete={handleDelete}
        onUpdate={handleEdit}
        onCompleted={handeleComplete}
        onClear={handleClear}
      />
      <button
        className={todos.length > 0 ? "todo-clear" : "disabled"}
        onClick={handleClear}
      >
        پاک کردن
      </button>
    </div>
  );
}

export default TodoList;
