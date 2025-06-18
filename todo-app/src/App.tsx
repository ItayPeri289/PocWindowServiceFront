import React, {
  useState,
  useEffect,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

interface Todo {
  id: string;
  name: string;
  description?: string;
  isCompleted: boolean;
}

const API_URL = "https://localhost:5001/tasks";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState<string>("");

  // Fetch all tasks
  useEffect(() => {
    axios
      .get<Todo[]>(API_URL)
      .then((response) => setTodos(response.data))
      .catch(console.error);
  }, []);

  // Add a new task
  const addTodo = (): void => {
    const trimmed = input.trim();
    if (!trimmed) return;
    axios
      .post<Todo>(API_URL, { name: trimmed, isCompleted: false })
      .then((response) => setTodos((prev) => [...prev, response.data]))
      .catch(console.error);
    setInput("");
  };

  // Toggle completion
  const toggleTodo = (todo: Todo): void => {
    axios
      .put(`${API_URL}/${todo.id}`, { ...todo, isCompleted: !todo.isCompleted })
      .then(() =>
        setTodos((prev) =>
          prev.map((t) =>
            t.id === todo.id ? { ...t, isCompleted: !t.isCompleted } : t
          )
        )
      )
      .catch(console.error);
  };

  // Delete a task
  const removeTodo = (id: string): void => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => setTodos((prev) => prev.filter((t) => t.id !== id)))
      .catch(console.error);
  };

  // Start editing
  const startEdit = (todo: Todo): void => {
    setEditingId(todo.id);
    setEditInput(todo.name);
  };

  // Save edit
  const saveEdit = (id: string): void => {
    const trimmed = editInput.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    axios
      .put(`${API_URL}/${id}`, { ...todo, name: trimmed })
      .then(() =>
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, name: trimmed } : t))
        )
      )
      .catch(console.error);
    setEditingId(null);
    setEditInput("");
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditInput("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") addTodo();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void =>
    setInput(e.target.value);
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>): void =>
    setEditInput(e.target.value);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="start"
      minHeight="100vh"
      bgcolor="background.default"
      p={2}
    >
      <Box
        width={400}
        bgcolor="background.paper"
        p={3}
        borderRadius={2}
        boxShadow={3}
      >
        <Box mb={2}>
          <TextField
            label="Add a new task"
            variant="outlined"
            fullWidth
            value={input}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </Box>
        <Box mb={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={addTodo}
            disabled={!input.trim()}
          >
            Add Todo
          </Button>
        </Box>
        <List>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              secondaryAction={
                editingId === todo.id ? (
                  <>
                    <IconButton edge="end" onClick={() => saveEdit(todo.id)}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={cancelEdit}>
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton edge="end" onClick={() => startEdit(todo)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => removeTodo(todo.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
              }
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={todo.isCompleted}
                  onChange={() => toggleTodo(todo)}
                />
              </ListItemIcon>
              {editingId === todo.id ? (
                <TextField
                  fullWidth
                  variant="standard"
                  value={editInput}
                  onChange={handleEditChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(todo.id);
                    if (e.key === "Escape") cancelEdit();
                  }}
                />
              ) : (
                <ListItemText
                  primary={todo.name}
                  sx={{
                    textDecoration: todo.isCompleted ? "line-through" : "none",
                    color: todo.isCompleted ? "text.disabled" : "text.primary",
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default App;
