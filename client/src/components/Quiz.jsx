import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import "../App.css";
import { socketLoad } from "../Helpers/socketLoad";
import { Header } from "./Header";
import { KeyPad } from "./KeyPad/Keypad";
import { ResultsList } from "./ResultsList/ResultsList";
import { SettingsModal } from "./Modal/SettingsModal";
import axios from "axios";

const Quiz = ({ socket, cookies, removeCookie, handleLeaveRoom, opponentName, setOpponentName, roomID, setRoomID }) => {
  const [gameSettings, setGameSettings] = useState(null);
  const [question, setQuestion] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [responses, setResponses] = useState([]);
  const [score, setScore] = useState({
    points: 0,
    correct: 0,
    total: 0,
  });
  const [socketID, setSocketID] = useState(null);

  const [opponentResult, setOpponentResult] = useState(null);
  const [opponentResponses, setOpponentResponses] = useState(null);

  const [clock, setClock] = useState(0);
  const [totalTime, setTotalTime] = useState(null);
  const [finish, setFinish] = useState(null);
  const [display, setDisplay] = useState("DISPLAY");
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  // Modal show/hide operations
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    socket.emit("requestSettings", roomID);
    setShow(true);
  };

  // Set-up socket event listeners
  useEffect(() => {
    if (socket && cookies.username) {
      socketLoad({
        setScore,
        score,
        socket,
        socketID,
        cookies,
        removeCookie,
        roomID,
        setRoomID,
        setOpponentName,
        setPlayerReady,
        setQuestions,
        setClock,
        setTotalTime,
        setFinish,
        setGameSettings,
        setQuestion,
        setOpponentResult,
        setOpponentResponses,
        setTimerIsRunning,
        setDisplay,
      });
    }
  }, [socket, cookies.username]);

  useEffect(() => {
    socket.emit("player ready", { username: cookies.username, roomID, playerReady });
  }, [playerReady]);

  const startGame = () => {
    // console.log("STARTING GAME");
    setPlayerReady((prev) => !prev);
    // setOpponentResult({ points: 0 });
    // setFinish(null);
    // setScore({ points: 0, correct: 0, total: 0 });
    // localStorage.setItem("score", JSON.stringify({ points: 0, correct: 0, total: 0 }));
    // setDisplay("0");
    // setTimerIsRunning(true);
    // socket.emit("resume");
  };

  const endGame = () => {
    socket.emit("end game", roomID);
    setTimerIsRunning(false);
    setClock(0);
    setFinish("Game over");
    setTotalTime(null);
    setQuestions(null);
    localStorage.clear();
  };

  const pause = () => {
    socket.emit("pause", roomID);
    setDisplay("PAUSED");
  };

  const resume = () => {
    socket.emit("resume", roomID);
    setDisplay("0");
  };

  const handleSubmit = () => {
    const formatInput = display.join("");

    if (formatInput === "") {
      return;
    }

    const result = Number(formatInput) === question.answer;
    console.log(result);

    if (result) {
      setScore((prev) => {
        return {
          correct: prev.correct + 1,
          total: prev.total + 1,
          points: Math.round(((prev.correct + 1) / (prev.total + 1)).toFixed(1) * (prev.correct + 1) * 10),
        };
      });
    } else {
      setScore((prev) => {
        return {
          ...prev,
          total: prev.total + 1,
          points: Math.round((prev.correct / (prev.total + 1)).toFixed(1) * prev.correct * 10),
        };
      });
    }

    const response = {
      ...question,
      input: formatInput,
      result: result,
    };

    setDisplay("0");

    setResponses((prev) => [...prev, response]);
  };

  const handleLogout = () => {
    handleLeaveRoom();
    axios
      .post("/logout", { username: cookies.username })
      .then((res) => {
        console.log(res.data.msg);
        socket.emit("opponent disconnect", { username: cookies.username, roomID });
        localStorage.clear();
        removeCookie("username", { path: "/" });
      })
      .catch((err) => console.log("Logout error:", err));
  };

  useEffect(() => {
    const renderQuestion = () => {
      const retrievedQuestion = questions[score.total];
      setQuestion(retrievedQuestion);
    };

    if (questions) {
      if (finish) {
        setFinish(null);
      }
      renderQuestion();
    }
  }, [questions, responses]);

  useEffect(() => {
    if (questions) {
      const scoreCached = JSON.parse(localStorage.getItem("score"));
      if (scoreCached) {
        setScore(scoreCached);
      } else {
        setScore({
          correct: 0,
          total: 0,
          points: 0,
        });
      }
      setResponses([]);
    }
  }, [questions]);

  useEffect(() => {
    if (score.total > 0) {
      localStorage.setItem("score", JSON.stringify(score));
      socket.emit("opponentScore", { score: { userID: socketID, ...score }, roomID });
    }

    if (finish) {
      socket.emit("opponentResponses", { responses: [...responses], roomID });
    }
  }, [finish, score, socket, socketID]);

  useEffect(() => {
    if (socket) {
      setSocketID(socket.id);
    }
  }, [socket]);

  // Onload check local storage (incase accidental refresh during game)
  useEffect(() => {
    const questionsCached = JSON.parse(localStorage.getItem("questions"));
    const scoreCached = JSON.parse(localStorage.getItem("score"));
    const totalTimeCached = JSON.parse(localStorage.getItem("totalTime"));

    if (questionsCached) {
      setQuestions(questionsCached);
      if (scoreCached) {
        setScore(scoreCached);
        console.log("Emitting score: ", scoreCached);
        socket.emit("opponentScore", { score: { userID: cookies.username, ...scoreCached }, roomID });
        setQuestion(questionsCached[scoreCached.total]);
        setDisplay("0");
        setTimerIsRunning(true);
        setTotalTime(totalTimeCached);
      }
    } else {
      if (scoreCached && !score) setScore({ points: 0, correct: 0, total: 0 });
      localStorage.setItem("score", JSON.stringify({ points: 0, correct: 0, total: 0 }));
      // socket.emit("opponentScore", {
      //   score: {
      //     userID: cookies.username,
      //     ...{ points: 0, correct: 0, total: 0 },
      //   },
      //   roomID,
      // });
    }
  }, []);

  return (
    <div>
      <h2>
        "{cookies.username}" {opponentName ? `Vs. "${opponentName}"` : "--> waiting for opponent to join..."}
      </h2>

      {finish && <h2>{finish}</h2>}

      {clock === 0 ? (
        <>
          <Button variant="success" onClick={() => startGame()}>
            {playerReady ? "Unready" : "Ready"}
          </Button>
          <Button id="settingsBtn" onClick={() => handleShow()}>
            <SettingsIcon />
          </Button>
          <Button variant="danger" onClick={() => handleLeaveRoom()}>
            Leave room
          </Button>
          <Button variant="secondary" onClick={() => handleLogout()}>
            Logout
          </Button>
        </>
      ) : (
        <Button onClick={() => endGame()}>End Game</Button>
      )}
      <Header
        cookies={cookies}
        score={score}
        opponentName={opponentName}
        opponentResult={opponentResult}
        clock={clock}
        finish={finish}
        setFinish={setFinish}
        timerIsRunning={timerIsRunning}
        setTimerIsRunning={setTimerIsRunning}
        totalTime={totalTime}
        onPause={() => pause()}
        onResume={() => resume()}
      />
      {/* <Timer /> */}
      {questions && (
        <KeyPad display={display} setDisplay={setDisplay} question={question} handleSubmit={handleSubmit} />
      )}
      {finish && (
        <ResultsList
          responses={responses}
          opponentResponses={opponentResponses}
          opponentName={opponentName}
          cookies={cookies}
        />
      )}

      <SettingsModal
        handleClose={handleClose}
        show={show}
        gameSettings={gameSettings}
        socket={socket}
        roomID={roomID}
      />
    </div>
  );
};

export default Quiz;
