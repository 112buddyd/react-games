import cors from 'cors';
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import Lobby from './games/common/lobby';
import Player from './games/common/player';
const app = express();
const httpServer = new http.Server(app);

const PORT = 4000;

app.use(cors());

const players: Player[] = [];
const lobbies: Lobby[] = [];

const socketServer = new socketIO.Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

const addPlayer = (id: string) => {
  const player = new Player(id, id);
  players.push(player);
  return player;
};

const getOrCreatePlayer = (id: string) => {
  let player = players.find((p) => p.id === id);
  if (!player) {
    player = addPlayer(id);
  }
  return player;
};

socketServer.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.join('lobby');
  getOrCreatePlayer(socket.id);

  socket.on('newLobby', (data) => {
    const player = getOrCreatePlayer(socket.id);
    const lobby = new Lobby(data.gameType);
    socket.join(lobby.id);
    lobby.addPlayer(player);
    lobbies.push(lobby);
    socketServer.sockets
      .in('lobby')
      .emit('newLobbyCreated', { id: lobby.id, gameType: lobby.gameType });
  });

  socket.on('listLobbies', () => {
    socket.emit(
      'lobbyList',
      lobbies.map((l) => l.id)
    );
  });

  socket.on('leaveLobby', () => {
    socket.join('lobby');
    socket.emit('changedLobby', { id: 'lobby' });
  });

  socket.on('joinLobby', (data) => {
    const player = getOrCreatePlayer(socket.id);
    socket.join(data.lobbyId);
    socketServer.sockets
      .in(data.lobbyId)
      .emit('playerJoined', `${player.name} joined the lobby.`);
  });

  socket.on('action', (data) => {
    const lobby = lobbies.find((l) => l.id == data.lobbyId);
    if (!lobby) {
      socket.emit('noGameFound');
    } else {
      lobby.handleAction(data);
    }
  });

  socket.on('requestGameState', (data) => {
    const lobby = lobbies.find((l) => l.id == data.lobbyId);
    if (!lobby) {
      socket.emit('noGameFound');
    } else {
      socket.emit('gameState', { lobbyId: lobby.id, state: lobby.state });
    }
  });

  socket.on('message', (data) => {
    console.log(data);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
