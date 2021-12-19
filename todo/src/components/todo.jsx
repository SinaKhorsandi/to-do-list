import React, { useState } from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import TodoForm from "./todo-form";

function Todo({ todos, onDelete, onUpdate, onCompleted }) {
  const [edit, setEdit] = useState({
    id: null,
    text: "",
  });

  const updateTodo = (title) => {
    onUpdate(edit.id, title);
    setEdit({
      id: null,
      text: "",
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
        {todo.title}
        <div className="icons">
          {/* <RiCheckLine
            className="complete-icon"
            onClick={() => onCompleted(todo.id)}
          /> */}
          <TiEdit
            className="edit-icon"
            onClick={() => setEdit({ id: todo.id, title: todo.title })}
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
