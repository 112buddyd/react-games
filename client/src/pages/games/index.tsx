import { SpaceBetween } from '@cloudscape-design/components';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import { useState } from 'react';
const WS_URL = 'ws://127.0.0.1:8000';

function Games() {
  const [messages, setMessages] = useState<unknown[]>([]);
  const ws = new WebSocket(WS_URL);
  ws.onopen = (event) => {
    ws.send(JSON.stringify({ event: 'message', data: { message: 'Hi' } }));
  };

  ws.onmessage = function (event) {
    const json = JSON.parse(event.data);
    try {
      if ((json.event = 'data')) {
        setMessages((current) => [...current, json.data.message]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickSendMessage = () => {
    ws.send(JSON.stringify({ event: 'message', data: { message: 'Click!' } }));
  };

  return (
    <Container>
      <SpaceBetween size="m">
        <Button onClick={handleClickSendMessage}>
          Click Me to send 'Hello'
        </Button>
      </SpaceBetween>
    </Container>
  );
}

export default Games;
