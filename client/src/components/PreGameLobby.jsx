import React from "react";
import Button from "react-bootstrap/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import { ReactComponent as NotReady } from "../images/notReady.svg";
import { ReactComponent as Ready } from "../images/ready.svg";

export const PreGameLobby = ({
  cookies,
  startGame,
  handleShow,
  playerReady,
  opponentName,
  opponentReady,
  opponentResult,
  preGameCount,
  score,
  finish,
}) => {
  return (
    <div>
      <Button id="settingsBtn" onClick={() => handleShow()}>
        <SettingsIcon />
      </Button>

      <div className="namePlatesContainer">
        <div>
          <div className="preGameNamePlate user">
            <h2>{cookies.username}</h2>
            {opponentName && finish && <h1>{score.points}</h1>}
          </div>
          {opponentName && (playerReady ? <Ready /> : <NotReady />)}
        </div>

        {opponentName ? (
          <div>
            <div className="preGameNamePlate opponent">
              <h2>{opponentName}</h2>
              {opponentName && finish && <h1>{opponentResult.points}</h1>}
            </div>
            {opponentReady ? <Ready /> : <NotReady />}
          </div>
        ) : (
          <div>
            <div className="preGameNamePlate waiting">Waiting for player...</div>
          </div>
        )}
      </div>

      {opponentName && (
        <Button variant={playerReady ? "secondary" : "success"} onClick={() => startGame()}>
          {playerReady ? "Unready" : "Ready"}
        </Button>
      )}
      {preGameCount && (
        <>
          <h2>Game starting in...</h2>
          <h1>{preGameCount}</h1>
        </>
      )}
    </div>
  );
};
