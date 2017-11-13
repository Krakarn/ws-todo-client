export class Subscription {
  public readonly id: string;
  public readonly table: string;
  public readonly filter: string | void;

  constructor(
    id: string,
    table: string,
    filter?: string,
  ) {
    this.id = id;
    this.table = table;
    this.filter = filter;
  }
}
