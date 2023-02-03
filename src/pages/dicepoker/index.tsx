import { ColumnLayout } from '@cloudscape-design/components';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import DiceViewer from './DiceViewer';
import PlayerView from './PlayerView';

interface GameState {
  players: { [id: string]: Player };
  round: number;
  pot: number;
  dice: number[];
}

enum PlayerStatus {
  IN = 'in',
  OUT = 'out',
}

export interface Player {
  id: string;
  name: string;
  dice: number[];
  purse: number;
  currentBet: number;
  status: PlayerStatus;
}

const rollDie = () => {
  return Math.floor(Math.random() * 6) + 1;
};

const generateDicePool = (size: number) => {
  return Array(size)
    .fill(0)
    .map((_) => rollDie());
};

const createPlayer = (name: string) => {
  return {
    id: nanoid(),
    name: name,
    dice: generateDicePool(2),
    purse: 10,
    currentBet: 0,
    status: PlayerStatus.IN,
  };
};

function DicePoker() {
  const [gameState, setGameState] = useState<GameState>({
    players: {},
    round: -1,
    pot: 0,
    dice: [],
  });

  const handleStart = () => {
    const p1 = createPlayer('Player 1');
    const p2 = createPlayer('Player 2');
    const p3 = createPlayer('Player 3');
    const p4 = createPlayer('Player 4');
    setGameState({
      players: { [p1.id]: p1, [p2.id]: p2, [p3.id]: p3, [p4.id]: p4 },
      dice: generateDicePool(5),
      round: 1,
      pot: 0,
    });
  };

  return (
    <SpaceBetween size="l">
      <Header variant="h1">Dice Poker </Header>
      {gameState.round < 0 && (
        <Button variant="normal" onClick={handleStart}>
          Start game
        </Button>
      )}
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
