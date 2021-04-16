import React, { useState, useEffect } from "react";

export default function JoinGame({ newGame, joinGame }) {
  const [inputVal, setInput] = useState("");

  return (
    <div id="initialScreen" class="h-100 p-4">
      <h1 className="text-center">Snake Game</h1>
      <div class="d-flex align-items-center justify-content-center h-100">
        <button
          onClick={newGame}
          type="submit"
          class="btn btn-primary"
          id="newGameButton"
        >
          Create New Game
        </button>
        <div>OR</div>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <div class="form-group">
            <input
              onChange={handleChangeInput}
              type="text"
              placeholder="Enter Game Code"
              id="gameCodeInput"
            />
          </div>
          <button
            onClick={() => {
              joinGame(inputVal);
            }}
            type="submit"
            class="btn btn-primary"
            id="joinGameButton"
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
}
