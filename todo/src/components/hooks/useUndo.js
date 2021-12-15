import { useState } from "react";

let _id = 0;
function gid() {
  return _id++;
}

export function useUndo() {
  const [todos, setTodos] = useState([]);
  const [events, setEvents] = useState([]);
  const [undos, setUndos] = useState([]);

  const add = (text) => {

    const id = gid();
    setTodos([...todos, { id, text }]);

    events.push({
      type: "add",
      values: {
        id,
        text,
      },
    });
    setEvents(events);
    return id;
  };

  const deleteTodo = (id) => {

    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return;
    }
    const todo = todos[todoIndex];
    const newTodos = [...todos];
    newTodos.splice(todoIndex, 1);
    setTodos(newTodos);

    events.push({ type: "delete", values: { id, text: todo.text } });
    setEvents(events);
  };

  const undo = () => {

    if (events.length === 0) return;
    const newEvents = [...events];
    const event = newEvents.pop();
    const newUndos = [...undos, event]
    setUndos(newUndos);
    setEvents(newEvents);

    if (event.type === "delete") {
      setTodos([...todos, { ...event.values }]);
    } else if (event.type === "add") {
      const todoIndex = todos.findIndex((todo) => todo.id === events.values.id);
      const newTodos = [...todos];
      newTodos.splice(todoIndex, 1);
      setTodos(newTodos);
    }
    console.log("undo", undos);

  };

  const redo = () => {
    if (undos.length === 0) return;
    const nUndo = undos.pop()
    if (nUndo.type === "add") {
      setTodos([...todos, { ...nUndo.values }]);
      setEvents([...events, { ...nUndo }]);
    } else if (nUndo.type === "delete") {
      const todoIndex = todos.findIndex((todo) => todo.id === undos.values.id);
      const newTodos = [...todos];
      newTodos.splice(todoIndex, 1);
      setTodos(newTodos);
    }
  }
  return { todos, add, deleteTodo, undo, redo };
}




