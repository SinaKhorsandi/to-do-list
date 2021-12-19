import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../fetcher";

export function useUndo() {
  const [todos, setTodos] = useState([]);
  const [events, setEvents] = useState([]);
  const [undos, setUndos] = useState([]);
  const { data, mutate } = useSWR("/posts", fetcher);


  
  async function add(title) {
    const response = await fetch("http://localhost:4000/posts", {
      method: "POST",
      body: JSON.stringify({
        title: title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const body = await response.json();
    mutate([...data, body], false);

    const events = await fetch("http://localhost:4000/events", {
      method: "POST",
      body: JSON.stringify({
        type: "add",
        title: title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    await events.json();
  }



  async function deleteTodo(id) {
    const todoIndex = data.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return;
    }
    const todo = data[todoIndex];

    const events = await fetch("http://localhost:4000/events", {
      method: "POST",
      body: JSON.stringify({
        type: "delete",
        title: todo.title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    await events.json();
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
    const events = await fetch("http://localhost:4000/events", {
      method: "POST",
      body: JSON.stringify({
        type: "update",
        title: title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    await events.json();
  }



  async function undo() {
    const getEvents = await fetch("http://localhost:4000/events", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const eventsBody = await getEvents.json();
    if (eventsBody.length === 0) return;

    const event = eventsBody[eventsBody.length - 1];

    await fetch("http://localhost:4000/events/" + event.id, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const undos = await fetch("http://localhost:4000/undos", {
      method: "POST",
      body: JSON.stringify({
        eventID: event.id,
        type: event.type,
        title: event.title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    await undos.json();

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
