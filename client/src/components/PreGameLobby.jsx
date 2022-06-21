import React from "react";
import Button from "react-bootstrap/Button";
import SettingsIcon from "@mui/icons-material/Settings";

export const PreGameLobby = ({ startGame, handleShow, playerReady }) => {
  return (
    <div>
      <Button variant="success" onClick={() => startGame()}>
        {playerReady ? "Unready" : "Ready"}
      </Button>
      <Button id="settingsBtn" onClick={() => handleShow()}>
        <SettingsIcon />
      </Button>
    </div>
  );
};
