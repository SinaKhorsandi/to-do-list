import React from "react";
import { useCtrlZ } from "./hooks/useCtrlZ";
import { useCtrlY } from "./hooks/useCtrlY";
import { useUndo } from "./hooks/useUndo";
import Todo from "./todo";
import TodoForm from "./todo-form";
import useSWR from "swr";
import { fetcher } from '../fetcher';


function TodoList() {

  const { add, deleteTodo, undo, redo, updateTodo } = useUndo()
  const { data, error } = useSWR("/posts", fetcher);

  useCtrlZ({ onCtrlZ: undo })
  useCtrlY({ onCtrlY: redo })

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div className="todo-app">
      <h1>To Do</h1>
      <TodoForm onSubmit={add} />
      <Todo
        todos={data}
        onDelete={deleteTodo}
        onUpdate={updateTodo}
      />
      <div >
        <button onClick={undo} className="undo-button">
          undo
        </button>
        <button onClick={redo} className="redo-button" >
          redo
        </button>
      </div>
    </div>
  );
}

export default TodoList;
