import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../fetcher";

let _id = 1;
function gid() {
  return _id++;
}

export function useUndo() {
  const [todos, setTodos] = useState([]);
  const [events, setEvents] = useState([]);
  const [undos, setUndos] = useState([]);
  const { data, mutate } = useSWR("/posts", fetcher);

  async function add(text) {
    const id = gid();
    const response = await fetch("http://localhost:4000/posts", {
      method: "POST",
      body: JSON.stringify({
        title: text,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const body = await response.json();
    mutate([...data, body], false);

    events.push({
      type: "add",
      values: {
        id,
        text,
      },
    });
    setEvents(events);
    return id;
  }

  async function deleteTodo(id) {
    const todoIndex = data.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return;
    }
    const todo = data[todoIndex];

    events.push({ type: "delete", values: { id, title: todo.title } });
    setEvents(events);

    const del = await fetch("http://localhost:4000/posts/" + id, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const delBody = await del.json();
    mutate([...data, delBody], true);

    await fetch("http://localhost:4000/delete", {
      method: "POST",
      body: JSON.stringify({
        title: todo.title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  }

  async function updateTodo(id, title) {
    const todoIndex = data.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return;
    }
    const todo = data[todoIndex];

    const update = await fetch("http://localhost:4000/posts/" + id, {
      method: "PATCH",
      body: JSON.stringify({
        title: title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const updateBody = await update.json();
    mutate([...data, updateBody], true);

    await fetch("http://localhost:4000/update", {
      method: "POST",
      body: JSON.stringify({
        pastTitle: todo.title,
        newTitle: title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    events.push({ type: "update", values: { id, title } });
    setEvents(events);
  }

  async function undo() {
    if (events.length === 0) return;
    const newEvents = [...events];
    const event = newEvents.pop();
    const newUndos = [...undos, event];
    setUndos(newUndos);
    setEvents(newEvents);

    if (event.type === "delete") {
      const getUndo = await fetch("http://localhost:4000/delete", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const getUndoBody = await getUndo.json();
      const undo = await fetch("http://localhost:4000/posts", {
        method: "POST",
        body: JSON.stringify({
          title: getUndoBody[getUndoBody.length - 1].title,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const undoBody = await undo.json();
      mutate([...data, undoBody], false);
    } else if (event.type === "add") {
      const getUndo = await fetch("http://localhost:4000/posts", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const getUndoBody = await getUndo.json();
      const undo = await fetch(
        "http://localhost:4000/posts/" + getUndoBody[getUndoBody.length - 1].id,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const undoBody = await undo.json();
      mutate([...data, undoBody], true);
    }
  }

  const redo = () => {
    if (undos.length === 0) return;
    const nUndo = undos.pop();
    if (nUndo.type === "add") {
      setTodos([...todos, { ...nUndo.values }]);
      setEvents([...events, { ...nUndo }]);
    } else if (nUndo.type === "delete") {
      const todoIndex = todos.findIndex((todo) => todo.id === undos.values.id);
      const newTodos = [...todos];
      newTodos.splice(todoIndex, 1);
      setTodos(newTodos);
    }
  };
  return { add, deleteTodo, undo, redo, updateTodo };
}
