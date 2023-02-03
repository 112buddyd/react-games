import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Player } from '.';
import DiceViewer from './DiceViewer';

interface PlayerViewProps {
  player: Player;
}

function PlayerView({ player }: PlayerViewProps) {
  return (
    <Container header={<Header variant="h3">{player.name}</Header>}>
      <SpaceBetween size="xs">
        <Box>Your dice: </Box>
        <DiceViewer dice={player.dice} />
        <Box>Your purse: {player.purse}</Box>
        <Box>Your current bet: {player.currentBet}</Box>
      </SpaceBetween>
    </Container>
  );
}

export default PlayerView;
