import { Modal as Popup, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, { useState } from "react";

export const Login = ({ show, login, setShow, setCookie }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const handleClose = () => {
    setShow(false);
    setErrorMsg(null);
    setUsername("");
    setPassword("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    login(username, password)
      .then((res) => {
        console.log(res.data);
        setCookie("username", username, { maxAge: 3600 });
        localStorage.clear();
        handleClose();
      })
      .catch((err) => {
        console.log("err:", err.response.data);
        setErrorMsg(err.response.data);
      });
  };

  return (
    <div>
      <Popup show={show} onHide={handleClose}>
        <Popup.Header closeButton>
          <Popup.Title>Login</Popup.Title>
        </Popup.Header>
        <Popup.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nickname69"
                value={username}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <Form.Text></Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                value={password}
                autoComplete="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
          {errorMsg && <p>{errorMsg}</p>}
        </Popup.Body>
        <Popup.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={(e) => handleLogin(e)}>
            Save Changes
          </Button>
        </Popup.Footer>
      </Popup>
    </div>
  );
};
