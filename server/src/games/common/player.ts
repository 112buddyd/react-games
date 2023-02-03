import { Purse } from './purse';

// export interface Player {
//   id: string;
//   name: string;
//   dice?: Dice;
//   purse: Purse;
//   active: boolean;
// }

export default class Player {
  public readonly id: string;
  public name: string;
  private purse: Purse;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.purse = new Purse();
  }
}
