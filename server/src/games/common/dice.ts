import Die from './die';

export class Dice {
  private dice: Die[];

  constructor(count: number, faceCount: number, faces?: string[] | number[]) {
    this.dice = Array(count).map(() => {
      return new Die(faceCount, faces);
    });
  }

  rollAll = () => {
    for (const die of this.dice) {
      die.roll();
    }
  };

  rollAt = (index: number) => {
    this.dice[index].roll();
  };

  getAllValues = () => {
    return this.dice.map((d) => d.value);
  };

  getValueAt = (index: number) => {
    return this.dice[index].value;
  };

  addDie = (faceCount: number, faces?: string[] | number[]) => {
    this.dice.push(new Die(faceCount, faces));
  };
}

export default Dice;
