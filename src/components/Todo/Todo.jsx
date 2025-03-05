import "./App.css";
import styled from "styled-components";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import PropTypes from "prop-types";

const TodoItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border: 1px solid black;
`;

const TodoContent = styled.div`
  color: ${(props) => props.theme.colors.navy};
  font-size: 12px;

  ${(props) =>
    props.size === "M" &&
    `
    font-size: 20px;
    `}

  ${(props) =>
    props.$isDone &&
    `
    text-decoration: line-through;
    `}
`;

const TodoButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.div`
  border: 1px solid black;
  margin-left: 5px;
  padding: 5px;
  border-radius: 3px;
  font-size: 16px;
  }
`;

function writeToLocalStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function App() {
  const id = useRef(1);
  const [todos, setTodos] = useState(() => {
    let todoData = localStorage.getItem("todos") || "";
    if (todoData) {
      todoData = JSON.parse(todoData);
      const maxId = Math.max(...todoData.map((todo) => todo.id), 0);
      id.current = maxId + 1;
    } else {
      todoData = [];
    }
    return todoData;
  });

  const [value, setValue] = useState("");

  useLayoutEffect(() => {}, []);

  useEffect(() => {
    writeToLocalStorage(todos);
  }, [todos]);

  const handleButtonClick = () => {
    setTodos([
      ...todos,
      {
        id: id.current,
        content: value,
        isDone: false,
      },
    ]);
    setValue("");
    id.current++;
  };

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleIsDone = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id !== id) return todo;
        return {
          ...todo,
          isDone: !todo.isDone,
        };
      })
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="todo"
        value={value}
        onChange={handleInputChange}
      />
      {/* value跟state做掛鉤 */}
      <button onClick={handleButtonClick}>Add Todo</button>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleIsDone={handleToggleIsDone}
        />
      ))}
    </div>
  );
}

function TodoItem({ size, todo, handleDeleteTodo, handleToggleIsDone }) {
  const handleToggleClick = () => {
    handleToggleIsDone(todo.id);
  };
  const handleDeleteClick = () => {
    handleDeleteTodo(todo.id);
  };

  return (
    <div>
      <TodoItemWrapper>
        <TodoContent $isDone={todo.isDone} size={size}>
          {todo.content}
        </TodoContent>
        <TodoButtonWrapper>
          <Button onClick={handleToggleClick}>
            {todo.isDone ? "未完成" : "已完成"}
          </Button>
          <Button onClick={handleDeleteClick}>刪除</Button>
        </TodoButtonWrapper>
      </TodoItemWrapper>
    </div>
  );
}

TodoItem.propTypes = {
  size: PropTypes.string,
  todo: PropTypes.object,
  handleDeleteTodo: PropTypes.func,
  handleToggleIsDone: PropTypes.func,
};

export default App;
