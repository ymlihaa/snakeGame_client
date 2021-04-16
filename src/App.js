import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://localhost:3001");

function App() {
  const [gameActive, setGameActive] = useState(false);
  // const [canvas, setCanvas] = useState(null);
  // const [ctx, setCtx] = useState(null);
  // const [food, setFood] = useState(null);
  // const [gridSize, setGridSize] = useState(null);
  // const [size, setSize] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(null);
  const [gameCodeDisplay, setGameCodeDisplay] = useState("");
  const [gameCodeInput, setGameCodeInput] = useState("");
  const [showGameBoard, setShowGameBoard] = useState(false);
  const canvasRef = useRef(null);
  let canvas, ctx;

  // let canvas = document.getElementById("canvas");
  // let ctx = canvas.getContext("2d");
  useEffect(() => {
    socket.on("init", handleInit);
    socket.on("gameState", handleGameState);
    socket.on("gameOver", handleGameOver);
    socket.on("gameCode", handleGameCode);
    socket.on("unknownCode", handleUnknownCode);
    socket.on("tooManyPlayers", handleTooManyPlayers);
    // const canvas = canvasRef.current;
    // const ctx = canvas.getContext("2d");
    // setCanvas(canvas);
    // setCtx(ctx);
  }, []);

  useEffect(() => {
    console.log(gameCodeInput);
  }, [gameCodeInput]);

  const handleInput = (e) => {
    console.log("handleInput : ", e.target.value);
    setGameCodeInput(e.target.value);
  };

  const newGame = () => {
    setShowGameBoard(true);
    socket.emit("newGame");
    init();
  };

  const joinGame = () => {
    const code = gameCodeInput;
    setShowGameBoard(true);
    socket.emit("joinGame", code);
    setGameCodeDisplay(code);
    init();
  };

  const init = () => {
    let canvas, ctx;
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = canvas.height = 800;

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.addEventListener("keydown", keydown);
    setGameActive(true);
  };

  const keydown = (e) => {
    socket.emit("keydown", e.keyCode);
  };

  const paintGame = (state) => {
    console.log("paint game Stata :", state);
    let canvas, ctx;
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    console.log(ctx);
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log("paint game State : state.food : ", state.food);
    const food = state.food;
    const gridSize = state.gridSize;
    const size = canvas.width / gridSize;

    ctx.fillStyle = "yellow";
    ctx.fillRect(food.x * size, food.y * size, size, size);

    paintPlayer(state.player[0], size, "green");
    paintPlayer(state.player[1], size, "red");
  };

  const paintPlayer = (playerState, size, colour) => {
    const snake = playerState.snake;

    ctx.fillStyle = colour;
    for (let cell of snake) {
      ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }
  };

  const handleInit = (number) => {
    setPlayerNumber(number);
  };

  const handleGameState = (gameState) => {
    console.log("handleGAmeState : Gamestate : ", gameState);
    if (!gameState) return;
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState));
  };

  const handleGameOver = (data) => {
    if (!gameActive) return;
    data = JSON.parse(data);
    setGameActive(false);
    if (data.winner === playerNumber) {
      alert("You Win !");
    } else {
      alert("You Lose :(");
    }
  };

  const handleGameCode = (gameCode) => {
    setGameCodeDisplay(gameCode);
    console.log(gameCode);
  };

  const handleUnknownCode = () => {
    reset();
    alert("Unknown Game Code");
  };

  const handleTooManyPlayers = () => {
    reset();
    alert("This game is already in progress");
  };

  const reset = () => {
    setPlayerNumber(null);
    setGameCodeInput("");
  };

  return (
    <div>
      <section class="vh-100">
        <div class="container h-100">
          <div id="initialScreen" class="h-100">
            <div class="d-flex flex-column align-items-center justify-content-center h-100">
              <h1>Multiplayer Snake</h1>
              <button
                onClick={newGame}
                type="submit"
                class="btn btn-success"
                id="newGameButton"
              >
                Create New Game
              </button>
              <div>OR</div>
              <div class="form-group">
                <input
                  onChange={handleInput}
                  type="text"
                  placeholder="Enter Game Code"
                  id="gameCodeInput"
                />
              </div>
              <button
                onClick={joinGame}
                type="submit"
                class="btn btn-success"
                id="joinGameButton"
              >
                Join Game
              </button>
            </div>
          </div>
          <div id="gameScreen" class="h-100">
            <div class="d-flex flex-column align-items-center justify-content-center h-100">
              <h1>
                Your game code is:{" "}
                <span id="gameCodeDisplay">{gameCodeDisplay}</span>
              </h1>

              <canvas id="canvas" ref={canvasRef}></canvas>
            </div>
          </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
