import React, { useEffect, useState } from "react";
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
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (finish) {
      if (score.points > opponentResult.points) {
        setWinner(cookies.username);
      } else if (score.points < opponentResult.points) {
        setWinner(opponentName);
      } else {
        setWinner("Tie");
      }
    } else {
      setWinner(null);
    }
  }, [finish]);

  return (
    <div>
      <Button id="settingsBtn" onClick={() => handleShow()}>
        <SettingsIcon />
      </Button>

      {finish && (
        <h1 style={{ color: `${winner === cookies.username ? "#00dd00" : "red"}` }} className="gameWinnerText">
          {winner === "Tie" ? "Tie game!" : `${winner} wins!`}
        </h1>
      )}

      <div className="namePlatesContainer">
        <div>
          <div className={`preGameNamePlate user ${winner === cookies.username ? "winner" : ""}`}>
            <h2>{cookies.username}</h2>
            {opponentName && finish && <h1>{score.points}</h1>}
          </div>
          <div className={finish ? "appearAfterFinish" : ""}>
            {opponentName && (playerReady ? <Ready /> : <NotReady />)}
          </div>
        </div>

        {opponentName ? (
          <div>
            <div className={`preGameNamePlate opponent ${winner === opponentName ? "winner" : ""}`}>
              <h2>{opponentName}</h2>
              {opponentName && finish && <h1>{opponentResult.points}</h1>}
            </div>
            <div className={finish ? "appearAfterFinish" : ""}>{opponentReady ? <Ready /> : <NotReady />}</div>
          </div>
        ) : (
          <div>
            <div className="preGameNamePlate waiting">Waiting for player...</div>
          </div>
        )}
      </div>

      {opponentName && (
        <Button
          className={finish ? "appearAfterFinish" : ""}
          variant={playerReady ? "secondary" : "success"}
          onClick={() => startGame()}
        >
          {playerReady ? "Unready" : "Ready"}
        </Button>
      )}
      {preGameCount && (
        <div key={69} className="countDownContainer">
          <h2>Game starting in...</h2>
          <h1 key={preGameCount} className="countDownNum">
            {preGameCount}
          </h1>
        </div>
      )}
    </div>
  );
};
