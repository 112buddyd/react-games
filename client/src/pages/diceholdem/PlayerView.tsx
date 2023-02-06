import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Player } from '.';
import DiceViewer from './DiceViewer';

interface PlayerViewProps {
  player: Player;
  dice?: string[]| number[];
}

function PlayerView({ player, dice }: PlayerViewProps) {
  return (
    <Container header={<Header variant="h3">{player.name}</Header>}>
      <SpaceBetween size="xs">
        {dice && (
          <>
            <Box>Dice: </Box>
            <DiceViewer dice={dice} />
          </>
          )}
        <Box>{`Purse: ${player.purse}`}</Box>
        {/* <Box>{`Your current bet: ${player.currentBet}`}</Box> */}
      </SpaceBetween>
    </Container>
  );
}

export default PlayerView;
