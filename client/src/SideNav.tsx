import SideNavigation from '@cloudscape-design/components/side-navigation';
import { useNavigate } from 'react-router-dom';

function SideNav() {
  const navigate = useNavigate();
  return (
    <SideNavigation
      activeHref={window.location.pathname}
      header={{ text: 'React Games', href: '/' }}
      items={[
        { text: 'Lobbies', href: '/lobbies', type: 'link' },
        { text: 'Dice Poker', href: '/dicepoker', type: 'link' },
      ]}
      onFollow={(event) => {
        if (!event.detail.external) {
          event.preventDefault();
          navigate(event.detail.href);
        }
      }}
    />
  );
}

export default SideNav;
