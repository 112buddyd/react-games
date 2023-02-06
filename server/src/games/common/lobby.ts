import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { v4 as uuidv4 } from 'uuid';
import DiceHoldEm, { PossibleActions } from '../diceholdem/index';
import GameType from './gameType';
import Player from './player';
import { PurseContents } from './purse';

export default class Lobby {
  id: string;
  players: Player[];
  state: unknown;
  game: DiceHoldEm;
  gameType: keyof typeof GameType;
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
  stateInterval: NodeJS.Timer;

  constructor(
    gameType: keyof typeof GameType,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>
  ) {
    this.id = uuidv4();
    this.players = [];
    this.game = new GameType[gameType](this);
    this.gameType = gameType;
    this.io = io;
    this.stateInterval = setInterval(this.intervalSendState, 3000);
  }

  intervalSendState = () => {
    this.io.in(this.id).emit('publicGameState', this.game.getPublicState());
    this.players.forEach((p) =>
      this.io.to(p.id).emit('privateGameState', this.game.getPrivateState(p.id))
    );
  };

  addPlayer = (player: Player) => {
    this.players.push(player);
  };

  removePlayer = (playerId: string) => {
    this.players = this.players.filter((p) => p.id != playerId);
  };

  handleAction = (
    playerId: string,
    data: { action: PossibleActions; purse: PurseContents }
  ) => {
    const response = this.game.handleAction(playerId, data);
    this.io.to(playerId).emit('actionResponse', response);
  };

  startGame = () => {
    this.game.startGame();
  };

  sendGameState = (playerId?: string) => {
    if (playerId) {
      this.io.to(playerId).emit('publicGameState', this.game.getPublicState());
    } else {
      this.io.in(this.id).emit('publicGameState', this.game.getPublicState());
    }
  };

  sendGameStatePrivate = (playerId: string) => {
    this.io
      .to(playerId)
      .emit('privateGameState', this.game.getPrivateState(playerId));
  };
}
