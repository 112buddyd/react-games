import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function Lobbies() {
  const [isConnected, setIsConnected] = useState(false);
  const [lobbies, setLobbies] = useState<unknown[]>([])

  const listLobbies = () => {
    if (isConnected) socket.emit('listLobbies');
  }

  const newLobby = () => {
    if (isConnected) socket.emit('newLobby', { gameType: 'DICEHOLDEM'});
  }

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnected')
      setIsConnected(false);
    });

    socket.on('lobbyList', (data) => {
      console.log(data);
      setLobbies(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('lobbiesList');
    };

  }, [])
  
  return (
    <Container header={<Header variant="h2" actions={
      <SpaceBetween size="xs" direction='horizontal'>
        <Button variant='icon' iconName='refresh' onClick={listLobbies}/>
        <Button variant='icon' iconName='add-plus' onClick={newLobby}/>
        </SpaceBetween>
        }>Lobbies</Header>}>
      <SpaceBetween size="m">
        {/* @ts-expect-error testing temp */}
        {lobbies && lobbies.map((l) => <Link to={`/diceholdem/${l}`}> {l}</Link>)}
      </SpaceBetween>
    </Container>
  );
}

export default Lobbies;
