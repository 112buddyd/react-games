import { createBrowserRouter, RouteObject } from 'react-router-dom';
import DicePoker from './pages/dicepoker/index';
import Games from './pages/games';
import Socket from './pages/socket';
import Root from './Root';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'games',
        element: <Games />,
      },
      {
        path: 'dicepoker',
        element: <DicePoker />,
      },
      {
        path: 'socket',
        element: <Socket />,
      },
    ],
  },
];

const Router = createBrowserRouter(routes);

export default Router;