import React, { useState } from "react";
import { RiCheckLine } from "react-icons/ri";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import TodoForm from "./todo-form";

function Todo({ todos, onDelete, onUpdate, onCompleted }) {
  const [edit, setEdit] = useState({
    id: null,
    value: "",
  });

  const updateTodo = (value) => {
    onUpdate(edit.id, value);
    setEdit({
      id: null,
      value: "",
    });
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={updateTodo} />;
  }

  return todos.map((todo, index) => (
    <div key={index} className="todo-container">
      <div
        key={todo.id}
        className={todo.isCompleted ? "todo-row complete" : "todo-row "}
      >
        {todo.value}
        <div className="icons">
          <RiCheckLine
            className="complete-icon"
            onClick={() => onCompleted(todo.id)}
          />
          <TiEdit
            className="edit-icon"
            onClick={() => setEdit({ id: todo.id, value: todo.value })}
          />
          <RiCloseCircleLine
            className="delete-icon"
            onClick={() => onDelete(todo.id)}
          />
        </div>
      </div>
    </div>
  ));
}

export default Todo;
