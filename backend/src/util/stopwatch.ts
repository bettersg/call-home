class Stopwatch {
  private startDate: Date = new Date();

  private stopDate: Date = new Date();

  public millisTaken: number;

  start() {
    this.startDate = new Date();
  }

  stop() {
    this.stopDate = new Date();
    this.millisTaken = Number(this.stopDate) - Number(this.startDate);
  }
}

export default Stopwatch;
