export class Subscription {
  public readonly handle: string;
  public readonly id: string;
  public readonly table: string;
  public readonly filter: string | void;

  constructor(
    handle: string,
    id: string,
    table: string,
    filter?: string,
  ) {
    this.handle = handle;
    this.id = id;
    this.table = table;
    this.filter = filter;
  }
}
