import styled from "styled-components";
import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { register, getMe } from "../../WebAPI";
import { setAuthToken } from "../../utils";
import { AuthContext } from "../../context";

const Root = styled.div`
  width: 700px;
  margin: 0 auto;
  text-align: center;
`;

const Field = styled.div`
  margin-top: 16px;
`;

const Input = styled.input`
  width: 200px;
  padding: 8px;
  font-size: 14px;
`;

const Button = styled.button`
  cursor: pointer;
  width: 80px;
  height: 40px;
  border: 1px solid grey;
  margin-top: 20px;
`;

const Error = styled.div`
  margin-top: 16px;
  color: red;
`;

export default function RegisterPage() {
  const { setUser } = useContext(AuthContext);
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const history = useHistory();

  const handleSubmit = (e) => {
    setErrMessage(null);
    register(nickname, username, password).then((data) => {
      if (data.ok === 0) {
        return setErrMessage(data.message);
      }
      setAuthToken(data.token);
      getMe().then((res) => {
        if (res.ok !== 1) {
          setAuthToken(null);
          return setErrMessage(res.toString());
        }
        setUser(res.data);
        history.push("/");
      });
    });
  };

  return (
    <Root>
      <form onSubmit={handleSubmit}>
        <Field>
          NICKNAME:{" "}
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </Field>
        <Field>
          USERNAME:{" "}
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field>
        <Field>
          PASSWORD:{" "}
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit">註冊</Button>
        {errMessage && (
          <Error>
            {errMessage.includes("required")
              ? "請填入所有欄位"
              : errMessage.includes("exists")
              ? "此帳號已存在"
              : errMessage}
          </Error>
        )}
      </form>
    </Root>
  );
}
