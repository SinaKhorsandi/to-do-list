import React, { useState } from "react";
import { useCtrlZ } from "./hooks/useCtrlZ";
import { useUndo } from "./hooks/useUndo";
import Todo from "./todo";
import TodoForm from "./todo-form";

function TodoList() {

  const { todos, add, deleteTodo, undo, redo } = useUndo()

  useCtrlZ({ onCtrlZ: undo })

  console.log("todos", todos)

  return (
    <div className="todo-app">
      <h1>To Do</h1>
      <TodoForm onSubmit={add} />
      <Todo
        todos={todos}
        onDelete={deleteTodo}
      />
      <button onClick={undo} className="undo-button">
        undo
      </button>
      <button onClick={redo} className="undo-button" >
        redo
      </button>
    </div>
  );
}

export default TodoList;
