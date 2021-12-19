import useSWR from "swr";
import { fetcher } from "../../fetcher";

export function useUndo() {
  const { data, mutate } = useSWR("/posts", fetcher);

  // add: Add To ToDo List
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

  // deleteTodo: delete From ToDo List
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

  // updateTodo: Update ToDo List
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

  // undo: Undo function
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
    } else if (event.type === "update") {
      const getUpdate = await fetch("http://localhost:4000/update", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const getUpdateBody = await getUpdate.json();
      const getPosts = await fetch("http://localhost:4000/posts", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const getPostsBody = await getPosts.json();

      const lastUpdate = getUpdateBody[getUpdateBody.length - 1];
      const lastPost = getPostsBody[getPostsBody.length - 1];
      const undo = await fetch("http://localhost:4000/posts/" + lastPost.id, {
        method: "PUT",
        body: JSON.stringify({
          title: lastUpdate.pastTitle,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const undoBody = await undo.json();
      mutate([...data, undoBody], true);
    }
  }

  // redo: redo function
  async function redo() {
    const getUndos = await fetch("http://localhost:4000/undos", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const undoBody = await getUndos.json();

    if (undoBody.length === 0) return;

    const lastUndo = undoBody[undoBody.length - 1];
    console.log("lastUndo.id", lastUndo.id);

    await fetch("http://localhost:4000/undos/" + lastUndo.id, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const events = await fetch("http://localhost:4000/events", {
      method: "POST",
      body: JSON.stringify({
        type: lastUndo.type,
        title: lastUndo.title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    await events.json();

    if (lastUndo.type === "add") {
      const response = await fetch("http://localhost:4000/posts", {
        method: "POST",
        body: JSON.stringify({
          title: lastUndo.title,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const body = await response.json();
      mutate([...data, body], false);
    } else if (lastUndo.type === "delete") {
      const response = await fetch(
        "http://localhost:4000/posts/" + lastUndo.id,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const body = await response.json();
      mutate([...data, body], true);
    } else if (lastUndo.type === "update") {
      const getUpdate = await fetch("http://localhost:4000/update", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const getUpdateBody = await getUpdate.json();
      const getPosts = await fetch("http://localhost:4000/posts", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const getPostsBody = await getPosts.json();

      const lastUpdate = getUpdateBody[getUpdateBody.length - 1];
      const lastPost = getPostsBody[getPostsBody.length - 1];
      const undo = await fetch("http://localhost:4000/posts/" + lastPost.id, {
        method: "PUT",
        body: JSON.stringify({
          title: lastUpdate.newTitle,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const undoBody = await undo.json();
      mutate([...data, undoBody], true);
    }
  }
  return { add, deleteTodo, undo, redo, updateTodo };
}
