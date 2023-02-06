import Badge from '@cloudscape-design/components/badge';
import SpaceBetween from '@cloudscape-design/components/space-between';

interface DiceViewerProps {
  dice?: number[]|string[];
}

function DiceViewer({ dice }: DiceViewerProps) {
  return (
    <SpaceBetween size="xs" direction="horizontal">
      {dice && dice.map((d, i) => (
        <Badge key={i} color="blue">
          <h1>{d}</h1>
        </Badge>
      ))}
    </SpaceBetween>
  );
}

export default DiceViewer;
