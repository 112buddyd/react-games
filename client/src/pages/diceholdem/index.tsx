import { ColumnLayout } from '@cloudscape-design/components';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import DiceViewer from './DiceViewer';
import PlayerView from './PlayerView';

const socket = io('http://localhost:4000');

export type PurseContents = {
  platinum?: number;
  gold?: number;
  electrum?: number;
  silver?: number;
  copper?: number;
};

export enum PossibleActions {
  'NONE' = 'none',
  'CHECK' = 'check',
  'FOLD' = 'fold',
  'BET' = 'bet',
  'CALL' = 'call',
  'RAISE' = 'raise',
}

export type Player = {
  id: string;
  name: string;
  purse: PurseContents;
}

type PublicState = {
  players: Player[];
  activePlayers: { [id: string]: { lastAction: PossibleActions } };
  round: number;
  pot: PurseContents;
  currentBet: PurseContents;
  dice?: string[] | number [];
  buyIn: PurseContents;
  activePlayerId?: string;
  startingPlayerId?: string;
}

type PrivateState = {
  dice: string[] | number [];
}


function DiceHoldEm() {
  const {id} = useParams()
  const [isConnected, setIsConnected] = useState(false);
  const [playerId, setPlayerId] = useState<string>();
  const [publicState, setPublicState] = useState<PublicState>();
  const [privateState, setPrivateState] = useState<PrivateState>();

const startGame = () => {
  socket.emit('startGame', {id})
};

  useEffect(() => {
    socket.emit('joinLobby', {id})
  }, []);{}

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnected')
      setIsConnected(false);
    });

    socket.on('publicGameState', (data) => setPublicState(data));
    socket.on('privateGameState', (data) => setPrivateState(data));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('lobbiesList');
    };

  }, [])

  return (
    <SpaceBetween size="l">
      <Header variant="h1" actions={<Button variant="normal" onClick={startGame}>Start Game</Button>}>Dice Poker </Header>
      { publicState && <Box variant="pre">{JSON.stringify(publicState, null, 2)}</Box>}
      { privateState && <Box variant="pre">{JSON.stringify(privateState, null, 2)}</Box>}
      {publicState && publicState.round > 0 && (
        <>
          <Header variant="h2">Table's Dice:</Header>
          <DiceViewer dice={publicState.dice} />
          <ColumnLayout columns={4}>
            {Object.values(publicState.players).map((player) => (
              player.id === playerId ? (
                <PlayerView key={player.id} player={player} dice={privateState?.dice}/>
              ) : (
              <PlayerView key={player.id} player={player}/>
            )))}
          </ColumnLayout>
        </>
      )}
    </SpaceBetween>
  );
}

export default DiceHoldEm;
