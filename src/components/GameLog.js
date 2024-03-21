const GameLog = ({ log, gameStatus, turns }) => (
  <div>
    {log.map((entry, index) => (
      <div key={index}>{entry}</div>
    ))}
    {gameStatus === "won" && <div>Tower WIN in {turns} turn(s)</div>}
    {gameStatus === "lost" && <div>Tower LOSES in {turns} turn(s)</div>}
  </div>
);
export default GameLog;
