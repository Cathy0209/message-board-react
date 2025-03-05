import { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const API_ENDPOINT =
  "https://student-json-api.lidemy.me/comments?_sort=createdAt&_order=desc";

const Page = styled.div`
  width: 300px;
  margin: 0 auto;
`;

const Header = styled.h1`
  color: #3f51b5;
  display: flex;
  justify-content: center;
`;

const MessageForm = styled.form`
  margin-top: 16px;
`;

const CommenterName = styled.div`
  font-size: 14px;
  display: flex;
  height: 21.5px;

  & > p {
    display: flex;
    align-items: center;
  }

  & > input {
    display: flex;
    align-items: ;
    height: 21.5px;
    width: 236px;
  }
`;

const MessageTextarea = styled.textarea`
  display: block;
  width: 100%;
  margin-top: 10px;
`;

const SubmitButton = styled.button`
  margin-top: 8px;
`;

const MessageList = styled.div``;

const MessageContainer = styled.div`
  margin-top: 8px;
  border: 1px solid #283593;
  border-radius: 5px;
  padding: 10px;
`;
const MessageHead = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #9e9e9e;
`;

const MessageAuthor = styled.div`
  color: #455a64;
  font-size: 14px;
`;

const MessageTime = styled.div`
  color: #455a64;
  font-size: 14px;
`;

const MessageBody = styled.div`
  margin-top: 8px;
`;

const MessageContext = styled.div`
  font-size: 12px;
`;

const ErrorMessage = styled.div`
  margin-top: 8px;
  color: red;
`;

function Message({ author, time, children }) {
  return (
    <MessageContainer>
      <MessageHead>
        <MessageAuthor>{author}</MessageAuthor>
        <MessageTime>{time}</MessageTime>
      </MessageHead>
      <MessageBody>
        <MessageContext>{children}</MessageContext>
      </MessageBody>
    </MessageContainer>
  );
}

Message.propTypes = {
  author: PropTypes.string,
  time: PropTypes.string,
  children: PropTypes.node,
};

function MessageBoard() {
  const [message, setMessage] = useState([]);
  const [messageApiError, setMessageApiError] = useState(null);
  const [value, setValue] = useState();
  const [nickname, setNickname] = useState();
  const [postMessageError, setPostMessageError] = useState();
  const [isLoadingPostMessage, setIsLoadingPostMessage] = useState(false);

  const fetchMessages = () => {
    return fetch(API_ENDPOINT)
      .then((res) => res.json())
      .then((data) => {
        setMessage(data);
      })
      .catch((err) => {
        setMessageApiError(err.message);
      });
  };

  const handleTextareaChange = (e) => {
    setValue(e.target.value);
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleTextareaFocus = () => {
    setPostMessageError(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isLoadingPostMessage) {
      return;
    }
    setIsLoadingPostMessage(true);
    fetch("https://student-json-api.lidemy.me/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname,
        body: value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoadingPostMessage(false);
        if (data.ok === 0) {
          setPostMessageError(data.message);
        }
        fetchMessages();
        setValue("");
        setNickname("");
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
      <Header>留言板</Header>
      <MessageForm onSubmit={handleFormSubmit}>
        <CommenterName>
          <p>留言者：</p>
          <input
            value={nickname}
            onChange={handleNicknameChange}
            onFocus={handleTextareaFocus}
          />
        </CommenterName>
        <MessageTextarea
          value={value}
          onChange={handleTextareaChange}
          onFocus={handleTextareaFocus}
          rows={12}
        />
        <SubmitButton disabled={isLoadingPostMessage}>送出留言</SubmitButton>
        {postMessageError && (
          <ErrorMessage>
            Failed to submit the message. Please try again!{" "}
            {postMessageError.toString()}
          </ErrorMessage>
        )}
      </MessageForm>
      {messageApiError && (
        <ErrorMessage>
          Something went wrong. {messageApiError.toString()}
        </ErrorMessage>
      )}
      <MessageList>
        {message.map((message) => (
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

export default MessageBoard;
