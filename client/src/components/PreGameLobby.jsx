import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import { ReactComponent as NotReady } from "../images/notReady.svg";
import { ReactComponent as Ready } from "../images/ready.svg";

export const PreGameLobby = ({ cookies, startGame, handleShow, playerReady, opponentName, opponentReady }) => {
  return (
    <div>
      <Button id="settingsBtn" onClick={() => handleShow()}>
        <SettingsIcon />
      </Button>

      <div className="namePlatesContainer">
        <div>
          <div className="preGameNamePlate user">{cookies.username}</div>
          {opponentName && (playerReady ? <Ready /> : <NotReady />)}
        </div>

        {opponentName ? (
          <div>
            <div className="preGameNamePlate opponent">{opponentName}</div>
            {opponentReady ? <Ready /> : <NotReady />}
          </div>
        ) : (
          <div>
            <div className="preGameNamePlate waiting">Waiting for player...</div>
          </div>
        )}
      </div>

      {opponentName && (
        <Button variant="success" onClick={() => startGame()}>
          {playerReady ? "Unready" : "Ready"}
        </Button>
      )}
    </div>
  );
};
