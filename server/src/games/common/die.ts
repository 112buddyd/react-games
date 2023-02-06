export class Die {
  public value: number | string;
  public readonly faceCount: number;
  public readonly faces?: number[] | string[];
  constructor(faceCount: number, faces?: number[] | string[]) {
    this.faces = faces;
    this.faceCount = faceCount;
    this.value = this.roll();
  }

  roll = () => {
    const result = Math.floor(Math.random() * this.faceCount);
    if (this.faces) {
      this.value = this.faces[result];
      console.log('faces value', this.value);
      return this.value;
    }
    this.value = result + 1;
    console.log('value', this.value);
    return this.value;
  };
}

export default Die;
