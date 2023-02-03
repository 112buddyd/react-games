import { v4 as uuidv4 } from 'uuid';
import Dice from '../common/dice';
import { Purse } from '../common/purse';

interface GameState {
  players: Player[];
  round: number;
  pot: Purse;
  currentBet: Purse;
  dice?: Dice;
  buyIn: Purse;
}

export interface Player {
  id: string;
  name: string;
  dice?: Dice;
  purse: Purse;
  active: boolean;
}

class DiceHoldEm {
  // Poker hands, ranked high to low.
  // 1 Five -of-a-Kind    Aces ranking highest; 9s lowest.
  // 2 Four-of-a-Kind     Aces ranking highest; 9s lowest.
  // 3 Full House         Three-of-a-kind and a pair.  A, A, A, 9, 9 beats K, K, K, 10, 10.
  // 4 Straight           Five consecutive values.     A, K, Q, J, 10 beats K, Q, J, 10, 9.
  // 5 Three-of-a-Kind    Aces ranking highest; 9s lowest.
  // 6 Two Pairs          A, A, 10, 10, 9 beats K, K, Q, Q, 10
  // 7 One Pair           Aces ranking highest; 9s lowest.
  // 8 Highest Die        A, K, J, 10, 9 beats A, Q, J, 10, 9.

  private readonly gameId = uuidv4();
  private gameState: GameState;

  constructor() {
    this.gameState = {
      players: [],
      round: -1,
      pot: new Purse(),
      currentBet: new Purse(),
      buyIn: new Purse({ silver: 1 }),
    };
  }

  createPlayer = (name: string) => {
    this.gameState.players.push({
      id: uuidv4(),
      name: name,
      purse: new Purse({ gold: 10 }),
      active: true,
    });
  };

  runBettingRound = () => {
    console.log('betting round');
  };

  evaluateWinner = () => {
    console.log('evaluate winner');
    return this.gameState.players[0];
  };

  runGame = () => {
    // players buy in
    this.gameState.players.forEach((p) => {
      p.purse.remove(this.gameState.buyIn.getContents()); // take buyin from player
      this.gameState.pot.add(this.gameState.buyIn.getContents()); // add buyin to pot
    });
    // players roll their dice
    this.gameState.players.forEach((p) => (p.dice = new Dice(2, 6)));
    // betting round raise, match, drop
    this.runBettingRound();
    // once all are matched, roll 5 community dice
    this.gameState.dice = new Dice(5, 6);
    // betting round again
    this.runBettingRound();
    // score, payout
    const winner = this.evaluateWinner();
    winner.purse.add(this.gameState.pot.getContents());
  };
}

export default DiceHoldEm;
