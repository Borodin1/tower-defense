import { useState, useEffect, useRef, useCallback } from "react";
import Enemy from "./components/Enemy";
import Tower from "./components/Tower";
import GameLog from "./components/GameLog";

const App = () => {
  const [range] = useState(100);
  const [enemies, setEnemies] = useState([
    { name: "BotA", distance: 200, speed: 10, alive: true },
    { name: "BotB", distance: 100, speed: 10, alive: true },
    { name: "BotC", distance: 90, speed: 10, alive: true },
  ]);
  const [turn, setTurn] = useState(0);
  const [log, setLog] = useState([]);
  const [gameStatus, setGameStatus] = useState("");

  const requestRef = useRef(null);

  const hitChance = 0.5;

  const startGame = () => {
    setGameStatus("playing");
  };

  const playTurn = useCallback(() => {
    setTimeout(() => {
      const inRangeEnemies = enemies.filter(
        (enemy) => enemy.distance <= range && enemy.alive
      );
      const movedEnemies = enemies
        .filter((enemy) => enemy.alive)
        .map((enemy) => ({
          ...enemy,
          distance: Math.max(enemy.distance - enemy.speed, 0),
        }));

      const reachedTower = movedEnemies.some((enemy) => enemy.distance === 0);

      const allEnemiesDefeated = movedEnemies.length === 0;

      if (allEnemiesDefeated) {
        setGameStatus("won");
        cancelAnimationFrame(requestRef.current);
      } else if (reachedTower) {
        setGameStatus("lose");
        cancelAnimationFrame(requestRef.current);
      } else {
        setTurn((prevTurn) => prevTurn + 1);
        setEnemies(movedEnemies);
        requestRef.current = requestAnimationFrame(playTurn);
      }

      if (inRangeEnemies.length > 0) {
        const livingEnemies = inRangeEnemies.filter((enemy) => enemy.alive);
        if (livingEnemies.length > 0) {
          const closestEnemy = livingEnemies.reduce((prev, curr) =>
            prev.distance < curr.distance ? prev : curr
          );

          const randomValue = Math.random();
          if (randomValue <= hitChance && closestEnemy.alive) {
            setEnemies(
              enemies.map((enemy) =>
                enemy === closestEnemy ? { ...enemy, alive: false } : enemy
              )
            );
            setLog((prevLog) => [
              ...prevLog,
              `Turn ${turn + 1}: Kill ${closestEnemy.name} at ${
                closestEnemy.distance
              }m`,
            ]);
          } else {
            setLog((prevLog) => [
              ...prevLog,
              `Turn ${turn + 1}: Miss ${closestEnemy.name} at ${
                closestEnemy.distance
              }m`,
            ]);
          }
        }
      }
    }, 100);
  }, [enemies, range, gameStatus]);

  useEffect(() => {
    if (gameStatus) {
      requestRef.current = requestAnimationFrame(playTurn);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameStatus, playTurn]);
  return (
    <div>
      <button onClick={startGame}>Start</button>
      <a href="/">Restart</a>
      <Tower range={range} />
      {enemies.map((enemy) => (
        <Enemy
          key={enemy.name}
          name={enemy.name}
          distance={enemy.distance}
          speed={enemy.speed}
        />
      ))}
      <GameLog log={log} gameStatus={gameStatus} turns={turn} />
    </div>
  );
};

export default App;
