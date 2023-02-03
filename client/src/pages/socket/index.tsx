import { Button } from '@cloudscape-design/components';
import socketIO from 'socket.io-client';

// @ts-expect-error typing is wrong
const socket = socketIO.connect('http://localhost:4000');

function Socket() {
  const handleSendMessage = () => {
    socket.emit('message', {
      text: 'Hello!',
      name: 'me',
      id: `${socket.id}${Math.random()}`,
      socketID: socket.id,
    });
  };
  return <Button onClick={handleSendMessage}>Socket</Button>;
}

export default Socket;
