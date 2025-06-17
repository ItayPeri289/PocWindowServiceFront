import React, { useState, type KeyboardEvent, type ChangeEvent } from "react";
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
  id: number;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState<string>("");

  const addTodo = (): void => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, completed: false },
    ]);
    setInput("");
  };

  const toggleTodo = (id: number): void => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: number): void => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo: Todo): void => {
    setEditingId(todo.id);
    setEditInput(todo.text);
  };

  const saveEdit = (id: number): void => {
    const trimmed = editInput.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo))
    );
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEditInput(e.target.value);
  };

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
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
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
                  primary={todo.text}
                  sx={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    color: todo.completed ? "text.disabled" : "text.primary",
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
