import { createBrowserRouter, RouteObject } from 'react-router-dom';
import DiceHoldEm from './pages/diceholdem/index';
import Lobbies from './pages/lobbies';
import Root from './Root';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'lobbies',
        element: <Lobbies />,
      },
      {
        path: 'diceholdem/:id',
        element: <DiceHoldEm />,
      },
    ],
  },
];

const Router = createBrowserRouter(routes);

export default Router;
