import "./App.css";
import styled from "styled-components";
import { useState, useRef, useEffect, memo } from "react";

const Main = styled.main`
  width: 700px;
  height: auto;
  margin: 80px auto;
  background: #fff8d7;
  text-align: center;
  border: solid 1px #eac100;
  border-radius: 10px;
  box-shadow: 1.8px 2.4px 5px 0 rgb(0 0 0 / 30%);
  box-sizing: border-box;
`;

const TodoInput = styled.input`
  outline: none;
  border-top: solid 1px transparent;
  border-right: solid 1px transparent;
  border-bottom: solid 1px #eac100;
  border-left: solid 1px transparent;
  margin: 0 auto 20px auto;
  width: 600px;
  height: 40px;
  border: solid 1px #e0e0e0;
  background: #fff8d7;
  font-size: 24px;
  color: #977c00;
  box-sizing: border-box;
`;

const TodoTitle = styled.div`
  width: 100%;
  font-size: 55px;
  padding: 24px;
  box-sizing: border-box;
  color: #5b4b00;
`;

const TodoItemWrapper = styled.div`
  height: 50px;
  margin: 20px 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24px;

  box-sizing: border-box;

  & + & {
    margin-top: 5px;
  }
`;

const TodoContent = styled.div`
  color: #977c00;

  ${(props) =>
    props.isDone &&
    `
    text-decoration: line-through;
  `}
`;

const TodoButtonWrapper = styled.div``;

const Button = styled.button`
  padding: 4px;
  color: black;

  & + & {
    margin-left: 4px;
  }
`;

function TodoItem({ className, todo, handleDeleteTodo, handleToogleIsDone }) {
  const handleToggleClick = () => {
    handleToogleIsDone(todo.id);
  };

  const handleDeleteClick = () => {
    handleDeleteTodo(todo.id);
  };
  return (
    <TodoItemWrapper className={className} data-todo-id={todo.id}>
      <TodoContent isDone={todo.isDone}>{todo.content}</TodoContent>
      <TodoButtonWrapper>
        <Button onClick={handleToggleClick}>
          {todo.isDone ? "未完成" : "已完成"}
        </Button>
        <Button onClick={handleDeleteClick}>刪除</Button>
      </TodoButtonWrapper>
    </TodoItemWrapper>
  );
}

function writeTodosToLocalStorage(todos) {
  window.localStorage.setItem("todos", JSON.stringify(todos));
}

function App() {
  const id = useRef(1);

  const [todos, setTodos] = useState(() => {
    let todoData = window.localStorage.getItem("todos") || "";
    if (todoData) {
      todoData = JSON.parse(todoData);
      id.current = todoData[0].id + 1;
    } else {
      todoData = [];
    }
    return todoData;
  });
  const [value, setValue] = useState("");

  useEffect(() => {
    writeTodosToLocalStorage(todos);
  }, [todos]);

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleButtonClick = () => {
    setTodos([
      {
        id: id.current,
        content: value,
        isDone: false,
      },
      ...todos,
    ]);
    setValue("");
    id.current++;
  };

  const handleToogleIsDone = (id) => {
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

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  return (
    <Main>
      <TodoTitle>Todo List</TodoTitle>
      <TodoInput
        type="text"
        placeholder="Add todo..."
        value={value}
        onChange={handleInputChange}
      ></TodoInput>
      <button onClick={handleButtonClick}>Add</button>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleToogleIsDone={handleToogleIsDone}
        />
      ))}
    </Main>
  );
}

export default App;
