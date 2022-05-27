import { Modal as Popup, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, { useEffect, useState } from "react";

export const Register = ({ show, handleClose, register }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    register(username, password, passwordConf);
  };

  return (
    <div>
      <Popup show={show} onHide={handleClose}>
        <Popup.Header closeButton>
          <Popup.Title>Register</Popup.Title>
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
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                value={passwordConf}
                autoComplete="new-password"
                onChange={(e) => setPasswordConf(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Popup.Body>

        <Popup.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={(e) => handleRegister(e)}>
            Register
          </Button>
        </Popup.Footer>
      </Popup>
    </div>
  );
};
