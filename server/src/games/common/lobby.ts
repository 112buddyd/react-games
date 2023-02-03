import { v4 as uuidv4 } from 'uuid';
import GameType from './gameType';
import Player from './player';

export default class Lobby {
  public readonly id: string;
  public readonly gameType: GameType;
  public players: Player[];
  public readonly state: unknown;

  constructor(gameType: GameType) {
    this.id = uuidv4();
    this.gameType = gameType;
    this.players = [];
    this.state = {};
  }

  addPlayer = (player: Player) => {
    this.players.push(player);
  };

  removePlayer = (playerId: string) => {
    this.players = this.players.filter((p) => p.id != playerId);
  };

  handleAction = (data: unknown) => {
    console.log(data);
  };
}
