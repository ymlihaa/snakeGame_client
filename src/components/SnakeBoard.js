import React, { useState, useEffect } from "react";
import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3001";

export default function SnakeBoard({ keydown, setGameInit }) {
  const BG_COLOUR = "#231f20";
  const SNAKE_COLOUR = "#c2c2c2";
  const FOOD_COLOUR = "#e66916";

  let canvas, ctx;
  let playerNumber;

  const [gameActive, setGameActive] = useState(false);

  const init = () => {
    const gameScreen = document.getElementById("gameScreen");
    gameScreen.style.display = "block";
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvas.height = 600;
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener("keydown", keydown);
    setGameActive(true);
  };

  const paintGame = (state) => {
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const gridsize = state.gridsize;
    const size = canvas.width / gridsize;

    ctx.fillStyle = FOOD_COLOUR;
    ctx.fillRect(food.x * size, food.y * size, size, size);

    paintPlayer(state.players[0], size, SNAKE_COLOUR);
    paintPlayer(state.players[1], size, "red");
  };

  const paintPlayer = (playerState, size, colour) => {
    const snake = playerState.snake;

    ctx.fillStyle = colour;
    for (let cell of snake) {
      ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }
  };

  const handleInit = (number) => {
    playerNumber = number;
  };

  const handleGameState = (gameState) => {
    if (!gameActive) {
      return;
    }
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState));
  };

  const handleGameOver = (data) => {
    if (!gameActive) {
      return;
    }
    data = JSON.parse(data);

    gameActive = false;

    if (data.winner === playerNumber) {
      alert("You Win!");
    } else {
      alert("You Lose :(");
    }
  };

  const handleGameCode = (gameCode) => {
    const gameCodeDisplay = document.getElementById("gameCodeDisplay");
    gameCodeDisplay.innerText = gameCode;
  };

  const handleUnknownCode = () => {
    console.log("handleUnknownCod");
    reset();
    alert("Unknown Game Code");
  };

  const handleTooManyPlayers = () => {
    reset();
    alert("This game is already in progress");
  };

  const reset = () => {
    playerNumber = null;
    setGameInit();
  };

  useEffect(() => {
    const socket = io(ENDPOINT);
    init();
    socket.on("init", handleInit);
    socket.on("gameState", handleGameState);
    socket.on("gameOver", handleGameOver);
    socket.on("gameCode", handleGameCode);
    socket.on("unknownCode", handleUnknownCode);
    socket.on("tooManyPlayers", handleTooManyPlayers);
  }, []);

  return (
    <div id="gameScreen" className="h-100">
      <div className="d-flex flex-column aling-items-center justify-content-center h-100">
        <canvas id="canvas"></canvas>
      </div>
    </div>
  );
}
