import { ColumnLayout } from '@cloudscape-design/components';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useState } from 'react';
import socketIO from 'socket.io-client';
import DiceViewer from './DiceViewer';
import PlayerView from './PlayerView';

// @ts-expect-error typing is wrong
const socket = socketIO.connect('http://localhost:4000');
function DicePoker() {
  const [gameState, setGameState] = useState<GameState>({});

  const handleStart = () => {
    socket.emit('newGame', {
      game: 'diceholdem',
      socketID: socket.id,
    });
  };

  useEffect(() => {
    socket.on('gameState', (data) => setGameState(JSON.parse(data)));
  }, [socket]);

  return (
    <SpaceBetween size="l">
      <Header variant="h1">Dice Poker </Header>
      <Button variant="normal" onClick={handleStart}>
        Start game
      </Button>
      {gameState.round >= 0 && (
        <>
          <Header variant="h2">Table's Dice:</Header>
          <DiceViewer dice={gameState.dice} />
          <ColumnLayout columns={4}>
            {Object.values(gameState.players).map((player) => (
              <PlayerView key={player.id} player={player} />
            ))}
          </ColumnLayout>
        </>
      )}
      <Box variant="pre">{JSON.stringify(gameState, undefined, 2)}</Box>
    </SpaceBetween>
  );
}

export default DicePoker;
function useEffect(arg0: () => void, arg1: any[]) {
  throw new Error('Function not implemented.');
}
