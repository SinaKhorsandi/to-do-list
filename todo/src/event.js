const todos = [];
const events = [];
const undos = [];

let _id = 0;
function gid() {
  return _id++;
}

const addTodo = (id, text) => {
  todos.push({ id, text });

  events.push({ type: "add", values: { id, text } });
};

const deleteTodo = (id) => {
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    return;
  }
  const todo = todos[todoIndex];
  todos.splice(todoIndex, 1);

  events.push({ type: "delete", values: { id, text: todo.text } });
};



const undo = () => {
  if (events.length === 0) return;
  const event = events.pop();
  undos.push(event)
  if (event.type === "delete") {
    todos.push({ ...event.values });
  } else if (event.type === "add") {
    const todoIndex = todos.findIndex((todo) => todo.id === events.values.id);
    todos.splice(todoIndex, 1);
  }

};

const redo = () => {
  if (undos.length === 0) return;
  const nUndo = undos.pop()
  if (nUndo.type === "add") {
    todos.push({ ...nUndo.values });
    events.push({ ...nUndo });
  } else if (nUndo.type === "delete") {
    const todoIndex = todos.findIndex((todo) => todo.id === undos.values.id);
    todos.splice(todoIndex, 1);
  }
};

const todoId = gid();
addTodo(todoId, "first");
addTodo(1, "second");



undo();
redo();
// undo();


  console.log("todos: ",todos)
  console.log("event:",events)
  console.log("undo:", undos)