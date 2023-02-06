import { Server } from 'http';
import socketIO from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import Lobby from './games/common/lobby';
import Player from './games/common/player';

export default class GameServer {
  /*
  The GameServer will contain all active players and lobbies
  It GameServer should not care about what kind of player or game it is tracking.
  It should handle creating lobbies, letting players join/leave lobbies
  It should handle listening for requests and responding with updates
  */
  players: { [id: string]: Player } = {};
  lobbies: { [id: string]: Lobby } = {};
  io: socketIO.Server<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    unknown
  >;

  constructor(httpServer: Server) {
    this.io = new socketIO.Server(httpServer, {
      cors: {
        origin: 'http://localhost:5173',
      },
    });

    this.io.on('connection', (socket) => {
      console.log(`⚡: ${socket.id} user just connected!`);
      socket.join('lobby');
      this.getOrCreatePlayer(socket.id);

      socket.on('newLobby', (data) => {
        console.log('got newLobby', data);
        // const player = this.getOrCreatePlayer(socket.id);
        const lobby = new Lobby(data.gameType, this.io);
        // socket.join(lobby.id);
        // lobby.addPlayer(player);
        this.lobbies[lobby.id] = lobby;
        this.io.sockets
          .in('lobby')
          .emit('newLobbyCreated', { id: lobby.id, gameType: lobby.gameType });
      });

      socket.on('listLobbies', () => {
        console.log('gotlistLobbies', Object.keys(this.lobbies));
        socket.emit('lobbyList', Object.keys(this.lobbies));
      });

      socket.on('leaveLobby', () => {
        socket.join('lobby');
        socket.emit('changedLobby', { id: 'lobby' });
      });

      socket.on('joinLobby', (data) => {
        const player = this.getOrCreatePlayer(socket.id);
        const lobby = this.lobbies[data.id];
        lobby.addPlayer(player);
        socket.join(data.id);
        this.io
          .in(data.id)
          .emit('playerJoined', `${player.name} joined the lobby.`);
      });

      socket.on('startGame', (data) => {
        const lobby = this.lobbies[data.id];
        lobby.startGame();
      });

      socket.on('action', (data) => {
        const lobby = this.lobbies[data.id];
        if (!lobby) {
          socket.emit('noGameFound');
        } else {
          lobby.handleAction(socket.id, data);
        }
      });

      socket.on('requestGameState', (data) => {
        const lobby = this.lobbies[data.id];
        if (!lobby) {
          socket.emit('noGameFound');
        } else {
          socket.emit('gameState', {
            id: lobby.id,
            state: lobby.sendGameState(socket.id),
          });
        }
      });

      socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
      });
    });
  }

  addPlayer = (id: string) => {
    const player = new Player(id, id);
    this.players[player.id] = player;
    return player;
  };

  getOrCreatePlayer = (id: string) => {
    let player = this.players[id];
    if (!player) {
      player = this.addPlayer(id);
    }
    return player;
  };
}
