import styled from "styled-components";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const API_ENDPOINT =
  "https://student-json-api.lidemy.me/comments?_sort=createdAt&_order=desc";

const Page = styled.div`
  width: 500px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
`;
const MessageForm = styled.form`
  margin-top: 16px;
`;

const AuthorInputBox = styled.input``;
const MessageTextarea = styled.textarea`
  display: block;
  width: 100%;
  height: 150px;
  margin-top: 5px;
`;

const SubmitButton = styled.button`
  margin-top: 8px;
`;
const MessageList = styled.div`
  margin-top: 8px;
`;
const MessageContainer = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  padding: 8px 16px;

  & + & {
    margin-top: 8px;
  }
`;
const MessageHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const MessageAuthor = styled.div`
  color: blue;
  font-size: 16px;
`;
const MessageTime = styled.div``;
const MessageBody = styled.div`
  font-size: 16px;
  margin-top: 16px;
`;

const ErrorMessage = styled.div`
  margin-top: 16px;
  color: red;
`;
const Loading = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content center;
`;
function Message({ author, time, children }) {
  return (
    <MessageContainer>
      <MessageHead>
        <MessageAuthor>{author}</MessageAuthor>
        <MessageTime>{time}</MessageTime>
      </MessageHead>
      <MessageBody>{children}</MessageBody>
    </MessageContainer>
  );
}

Message.propTypes = {
  author: PropTypes.string,
  time: PropTypes.string,
  childrem: PropTypes.node,
};

function App() {
  const [messages, setMessages] = useState(null);
  const [messageApiError, setMessageApiError] = useState(null);
  const [nickname, setNickname] = useState("");
  const [value, setValue] = useState();
  const [postMessageError, setPostMessageError] = useState(null);
  const [isLoadingPostMessage, setIsLoadingPostMessage] = useState(false);

  const fetchMessages = () => {
    return fetch(API_ENDPOINT)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => {
        setMessageApiError(err.message);
      });
  };

  const handleInputChange = (e) => {
    setNickname(e.target.value);
  };

  const handleTextareaChange = (e) => {
    setValue(e.target.value);
  };

  const handleTextareaFocus = () => {
    setPostMessageError(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isLoadingPostMessage) return;
    setIsLoadingPostMessage(true);
    fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nickname: nickname,
        body: value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoadingPostMessage(false);
        if (data.ok === 0) {
          setPostMessageError(data.message);
          return;
        }
        setValue("");
        fetchMessages();
      })
      .catch((err) => {
        setIsLoadingPostMessage(false);
        setPostMessageError(err.message);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  return (
    <Page>
      {isLoadingPostMessage && <Loading>Loading...</Loading>}
      <Title>留言板</Title>
      <MessageForm onSubmit={handleFormSubmit}>
        暱稱：
        <AuthorInputBox
          value={nickname}
          onChange={handleInputChange}
          type="text"
        />
        <MessageTextarea
          value={value}
          onChange={handleTextareaChange}
          onFocus={handleTextareaFocus}
        />
        <SubmitButton>Submit</SubmitButton>
        {postMessageError && <ErrorMessage>{postMessageError}</ErrorMessage>}
      </MessageForm>
      {messageApiError && (
        <ErrorMessage>{messageApiError.toString()}</ErrorMessage>
      )}
      {messages && messages.length === 0 && <div>No message</div>}
      <MessageList>
        {messages &&
          messages.map((message) => (
            <Message
              key={message.id}
              author={message.nickname}
              time={new Date(message.createdAt).toLocaleString()}
            >
              {message.body}
            </Message>
          ))}
      </MessageList>
    </Page>
  );
}

export default App;
