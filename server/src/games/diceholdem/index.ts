import { v4 as uuidv4 } from 'uuid';
import Dice from '../common/dice';
import Lobby from '../common/lobby';
import Player from '../common/player';
import { Purse, PurseContents } from '../common/purse';

export enum PossibleActions {
  'NONE' = 'none',
  'CHECK' = 'check',
  'FOLD' = 'fold',
  'BET' = 'bet',
  'CALL' = 'call',
  'RAISE' = 'raise',
}

interface DiceHoldemGameState {
  public: {
    players: Player[];
    activePlayers: { [id: string]: { lastAction: PossibleActions } };
    round: number;
    pot: Purse;
    currentBet: Purse;
    dice?: Dice;
    buyIn: Purse;
    activePlayerId?: string;
    startingPlayerId?: string;
  };
  private: { [id: string]: { dice: Dice } };
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

  gameId = uuidv4();
  state: DiceHoldemGameState;
  lobby: Lobby;
  maxPlayers: number;
  betActions: {
    [key in PossibleActions]: (
      playerId: string,
      data: { purse: PurseContents }
    ) => { ok: boolean; message: string };
  };

  constructor(lobby: Lobby, maxPlayers?: number) {
    this.state = {
      public: {
        players: [],
        activePlayers: {},
        round: 0,
        pot: new Purse(),
        currentBet: new Purse(),
        buyIn: new Purse({ silver: 1 }),
      },
      private: {},
    };
    this.lobby = lobby;
    this.maxPlayers = maxPlayers ? maxPlayers : 6;
    this.betActions = {
      [PossibleActions.CHECK]: this.handleCheck,
      [PossibleActions.FOLD]: this.handleFold,
      [PossibleActions.BET]: this.handleBet,
      [PossibleActions.CALL]: this.handleCall,
      [PossibleActions.RAISE]: this.handleRaise,
      [PossibleActions.NONE]: () => {
        return { ok: false, message: 'No action.' };
      },
    };
  }

  /*
  ‘Check’ = Decline to Bet for the moment (only available if nobody has Bet yet).
  ‘Fold’ = Give up the Hand completely, along with any Chips contributed so far.
  ‘Bet’ = Raise the stakes by contributing chips that others must match to stay in the hand. Only available if no one has Bet yet.
  ‘Call’ = Agree to put in the same money as the most-recent player has done.
  ‘Raise’ = Increase the Bet made by the previous player by at least an amount equal to any previous Raise.
  */

  determineNextPlayer = (playerId: string) => {
    const index = Object.keys(this.state.public.activePlayers).indexOf(
      playerId
    );
    return index >= this.state.public.players.length
      ? this.state.public.players[0].id
      : this.state.public.players[index + 1].id;
  };

  determingStartingPlayer = () => {
    if (!this.state.public.startingPlayerId) {
      // choose random player
      this.state.public.startingPlayerId =
        this.state.public.players[
          Math.floor(this.state.public.players.length * Math.random())
        ].id;
    } else {
      // choose next player
      this.state.public.startingPlayerId = this.determineNextPlayer(
        this.state.public.startingPlayerId
      );
    }
  };

  startBettingRound = () => {
    this.state.public.activePlayerId = this.state.public.startingPlayerId;
    this.lobby.io
      .in(this.lobby.id)
      .emit('startBet', { activePlayer: this.state.public.activePlayerId });
  };

  evaluateWinner = () => {
    console.log('evaluate winner');
    return this.state.public.players[0];
  };

  startGame = () => {
    this.state.public.players = this.lobby.players;
    this.state.public.round += 1;
    this.determingStartingPlayer();
    // players buy in
    this.state.public.players.forEach((p) => {
      this.state.public.activePlayers[p.id] = {
        lastAction: PossibleActions.NONE,
      };
    });
    this.state.public.players.forEach((p) => {
      p.purse.remove(this.state.public.buyIn.getContents()); // take buyin from player
      this.state.public.pot.add(this.state.public.buyIn.getContents()); // add buyin to pot
    });
    // players roll their dice
    this.state.public.players.forEach((p) => {
      this.state.private[p.id] = { dice: new Dice(2, 6) };
      this.lobby.sendGameStatePrivate(p.id);
    });
    // betting round raise, match, drop
    this.startBettingRound();
    // once all are matched, roll 5 community dice
    this.state.public.dice = new Dice(5, 6);
    // betting round again
    this.startBettingRound();
    // score, payout
    const winner = this.evaluateWinner();
    winner.purse.add(this.state.public.pot.getContents());
  };

  handleAction = (
    playerId: string,
    data: { action: PossibleActions; purse: PurseContents } = {
      action: PossibleActions.NONE,
      purse: {},
    }
  ) => {
    let response = {};
    if (playerId !== this.state.public.activePlayerId) {
      response = { ok: false, message: 'You are not the active player.' };
    } else if (Object.keys(this.betActions).includes(data.action)) {
      response = this.betActions[data.action](playerId, data);
      this.setNextPlayer();
    } else {
      response = { ok: false, message: 'Invalid action.' };
    }
    this.lobby.io.to(playerId).emit('actionResponse', response);
  };

  setNextPlayer = () => {
    if (this.state.public.activePlayerId) {
      this.state.public.activePlayerId = this.determineNextPlayer(
        this.state.public.activePlayerId
      );
    } else {
      this.determingStartingPlayer();
      this.state.public.activePlayerId = this.state.public.startingPlayerId;
    }
  };

  handleCheck = (playerId: string) => {
    this.lobby.io
      .in(this.lobby.id)
      .emit('actionTaken', { playerId, action: PossibleActions.CHECK });
    return { ok: true, message: 'You checked.' };
  };

  handleFold = (playerId: string) => {
    delete this.state.public.activePlayers[playerId];
    this.lobby.io
      .in(this.lobby.id)
      .emit('actionTaken', { playerId, action: PossibleActions.FOLD });
    return { ok: true, message: 'You folded.' };
  };

  handleBet = (playerId: string, data: { purse: PurseContents }) => {
    this.state.public.pot.add(data.purse);
    this.lobby.io.in(this.lobby.id).emit('actionTaken', {
      playerId,
      action: PossibleActions.BET,
      purse: data.purse,
    });
    return { ok: true, message: `You bet: ${JSON.stringify(data.purse)}` };
  };

  handleCall = (playerId: string) => {
    const callAmount = this.state.public.currentBet.getContents();
    this.state.public.pot.add(callAmount);
    this.lobby.io.in(this.lobby.id).emit('actionTaken', {
      playerId,
      action: PossibleActions.CALL,
    });
    return { ok: true, message: `You called: ${JSON.stringify(callAmount)}` };
  };

  handleRaise = (playerId: string, data: { purse: PurseContents }) => {
    this.state.public.pot.add(data.purse);
    this.lobby.io.in(this.lobby.id).emit('actionTaken', {
      playerId,
      action: PossibleActions.RAISE,
      purse: data.purse,
    });
    return { ok: true, message: `You raised: ${JSON.stringify(data.purse)}` };
  };

  getPlayerDice = (playerId: string) => {
    return this.state.private[playerId].dice.getAllValues();
  };

  getPublicState = () => {
    return {
      players: this.state.public.players.map((p) => {
        return { id: p.id, name: p.name, purse: p.purse.getContents() };
      }),
      activePlayers: this.state.public.activePlayers,
      round: this.state.public.round,
      pot: this.state.public.pot.getContents(),
      currentBet: this.state.public.currentBet.getContents(),
      dice: this.state.public.dice?.getAllValues(),
      buyIn: this.state.public.buyIn.getContents(),
      activePlayerId: this.state.public.activePlayerId,
      startingPlayerId: this.state.public.startingPlayerId,
    };
  };

  getPrivateState = (id: string) => {
    return this.state.private[id]?.dice
      ? this.state.private[id].dice.getAllValues()
      : [];
  };
}

export default DiceHoldEm;
