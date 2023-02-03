export type PurseContents = {
  platinum?: number;
  gold?: number;
  electrum?: number;
  silver?: number;
  copper?: number;
};

// enum Coin {
//   PLATINUM = 'platinum',
//   GOLD = 'gold',
//   ELECTRUM = 'electrum',
//   SILVER = 'silver',
//   COPPER = 'copper',
// }

export enum CoinValue {
  PLATINUM = 10,
  GOLD = 1,
  ELECTRUM = 0.5,
  SILVER = 0.1,
  COPPER = 0.01,
}

export class Purse {
  private platinum = 0;
  private gold = 0;
  private electrum = 0;
  private silver = 0;
  private copper = 0;

  constructor(startingAmount?: PurseContents) {
    if (startingAmount) {
      this.platinum = startingAmount.platinum || 0;
      this.gold = startingAmount.gold || 0;
      this.electrum = startingAmount.electrum || 0;
      this.silver = startingAmount.silver || 0;
      this.copper = startingAmount.copper || 0;
    }
  }

  getContents = () => {
    return {
      platinum: this.platinum,
      gold: this.gold,
      electrum: this.electrum,
      silver: this.silver,
      copper: this.copper,
    } as PurseContents;
  };

  getTotalGold = () => {
    return (
      this.platinum * CoinValue.PLATINUM +
      this.gold * CoinValue.GOLD +
      this.electrum * CoinValue.ELECTRUM +
      this.silver * CoinValue.SILVER +
      this.copper * CoinValue.COPPER
    );
  };

  add = (amount: PurseContents) => {
    Object.entries(amount).forEach((k, v) => {
      // @ts-expect-error not sure how to type this properly
      this[k] += v;
    });
  };

  remove = (amount: PurseContents) => {
    Object.entries(amount).forEach((k, v) => {
      // @ts-expect-error not sure how to type this properly
      this[k] -= v;
    });
  };
}

//   roundToGold = () => {
//     this.value.silver += Math.floor(
//       this.value.copper / (Worth.silver / Worth.copper)
//     );
//     this.value.copper = this.value.copper % (Worth.silver / Worth.copper);

//     this.value.electrum += Math.floor(
//       this.value.silver / (Worth.electrum / Worth.silver)
//     );
//     this.value.silver = this.value.silver % (Worth.electrum / Worth.silver);

//     this.value.gold += Math.floor(
//       this.value.electrum / (Worth.gold / Worth.electrum)
//     );
//     this.value.electrum = this.value.electrum % (Worth.gold / Worth.electrum);
//   };

//   roundUp = () => {
//     const total =
//       this.value.platinum * Worth.platinum +
//       this.value.gold * Worth.gold +
//       this.value.electrum * Worth.electrum +
//       this.value.silver * Worth.silver +
//       this.value.copper * Worth.copper;

//     this.value.platinum = Math.floor(total / Worth.platinum);
//     let remainder = total % Worth.platinum;
//     this.value.gold = Math.floor(remainder / Worth.gold);
//     remainder = remainder % Worth.gold;
//     this.value.electrum = Math.floor(remainder / Worth.electrum);
//     remainder = remainder % Worth.electrum;
//     this.value.silver = Math.floor(remainder / Worth.silver);
//     remainder = remainder % Worth.silver;
//     this.value.copper = remainder / Worth.copper;
//   };
// }
