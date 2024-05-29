import React from 'react'
import { useEffect, useMemo, useRef, useState } from "react";
import './memoryGame.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const allGameIcons = [
  "🎉",
  "💗",
  "🤡",
  "🎁",
  "🦊",
  "🚀",
  "👀",
  "✨",
  "💣",
  "👑",
  "🎈",
];

const levelClearedMsg = [
  "🌟 Great start",
  "⭐️ Nice progress!",
  "🎉 Well done! Move on..",
  "🏆 Impressive skills!",
  "🌟 Halfway mark!",
  "🌟 Excellent work!",
  "⚡️ Remarkable progress!",
  "🎯 Outstanding performance!",
  "🔥 Incredible perseverance!",
  "🎉 Congratulations, you've conquered!",
]

function MemoryGame() {

  const [pieces, setPices] = useState([]);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(null);

  let timeout = useRef();

  const isGameCompleted = useMemo(() => {
    if (pieces.length > 0 && pieces.every((piece) => piece.solved)) {
      return true;
    }
    return false;
  }, [pieces]);

  const startGame = () => {
    const gameIcons = [];
    for (let i = 0; i <= level; i++) {
      gameIcons.push(allGameIcons[i]);
    }
    const duplicateGameIcons = [...gameIcons, ...gameIcons];
    setLives(level * (duplicateGameIcons.length + 10));
    const newGameIcons = [];

    while (newGameIcons.length < gameIcons.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateGameIcons.length);
      newGameIcons.push({
        emoji: duplicateGameIcons[randomIndex],
        flipped: false,
        solved: false,
        position: newGameIcons.length,
      });
      duplicateGameIcons.splice(randomIndex, 1);
    }
    setPices(newGameIcons);
  };

  useEffect(() => {
    startGame();
  }, [level]);

  const handleActive = (data) => {
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    if (flippedData.length === 2) return;
    const newPieces = pieces.map((piece) => {
      if (piece.position === data.position) {
        if (!piece.flipped) setLives(lives - 1);
        piece.flipped = !piece.flipped;
      }
      return piece;
    });
    setPices(newPieces);
  };

  const gameLogicForFlipped = () => {
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    if (flippedData.length === 2) {
      timeout.current = setTimeout(() => {
        setPices(
          pieces.map((piece) => {
            if (
              piece.position === flippedData[0].position ||
              piece.position === flippedData[1].position
            ) {
              if (flippedData[0].emoji === flippedData[1].emoji) {
                piece.solved = true;
                setLives(lives + 3);
              } else {
                piece.flipped = false;
              }
            }
            return piece;
          })
        );
      }, 800);
    }
  };

  useEffect(() => {
    gameLogicForFlipped();
    return () => {
      clearTimeout(timeout.current);
    };
  }, [pieces]);

  const restartGame = () => {
    setLevel(1);
    startGame();
  };


  return (
    <main>
      <link
  rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"/>
      <Container  bg="primary">
        <p className='mg-title'>Memory Game<br></br> </p>
        <p ><span style={{float:"right", fontSize:"20px",position:"absolute",marginLeft:"15%",marginTop:"100px",textAlign:"center"}}>Level - {level} <label htmlFor="">　　</label>Tries left - {lives}</span> </p>
        <div className="memorygame-container">
        <Row  >
        {pieces.map((data, index) => (
        <Col xs={4} sm={3} lg={2}>
           <div
            className={`flip-card ${
              data.flipped || data.solved ? "active" : ""
            } `}
            key={index}
            onClick={() => handleActive(data)}
          >
            <div class="flip-card-inner">
              <div class="flip-card-front"/>
              <div class="flip-card-back">{data.emoji}
              </div>
            </div>
          </div>
        </Col>
        ))}
        </Row>
        </div>
        {isGameCompleted && (
        <div className="game-completed">
          <h1 style={{textAlign:"center"}}> {levelClearedMsg[level - 1]} </h1>
          {level === 10 ? (
            <button onClick={restartGame}> Play Again </button>
          ) : (
            <Button
              onClick={() => {
                setLevel(level + 1);
              }}
            >
              Next Level
            </Button>
          )}
          {/* <Confetti width={window.innerWidth} height={window.innerHeight} /> */}
        </div>
      )}

      {lives === 0 && !isGameCompleted && (
        <div className="game-completed">
          <h1> Game Over </h1>
          <button onClick={restartGame}> Play Again </button>
        </div>
      )}
      </Container>
      <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" crossorigin></script>

<script
  src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"
  crossorigin></script>

<script
  src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"
  crossorigin></script>

<script>var Alert = ReactBootstrap.Alert;</script>
      </main>
  )
}

export default MemoryGame
