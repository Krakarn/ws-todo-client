import { observable } from 'mobx';

export class TableState<T> {
  public readonly name: string;
  public readonly generateEntry: (json: any) => T;

  @observable public list: T[];

  constructor(
    name: string,
    list: T[] = [],
    generateEntry: (json: any) => T = x => x,
  ) {
    this.name = name;
    this.list = list;
    this.generateEntry = generateEntry;
  }
}
