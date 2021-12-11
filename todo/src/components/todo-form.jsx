import React, { useState } from "react";

function TodoForm(props) {
  const [input, setInput] = useState(props.edit ? props.edit.value : "");

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSubmit({
      id: Math.floor(Math.random() * 10000),
      value: input,
    });

    setInput("");
  };

  if (props.edit) {
    return (
      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          className="todo-input"
          type="text"
          name="input"
          placeholder="برنامه خود را ویرایش کنید"
          value={input}
          onChange={handleChange}
        />
        <button className="todo-button">ویرایش</button>
      </form>
    );
  }
  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-input"
        type="text"
        name="input"
        placeholder="برنامه خود را وارد کنید"
        value={input}
        onChange={handleChange}
      />
      <button className="todo-button">اضافه</button>
    </form>
  );
}

export default TodoForm;
