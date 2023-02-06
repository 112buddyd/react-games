import cors from 'cors';
import express from 'express';
import http from 'http';
import GameServer from './gameServer';

const PORT = 4000;

const app = express();
const httpServer = new http.Server(app);
app.use(cors());
new GameServer(httpServer);

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
