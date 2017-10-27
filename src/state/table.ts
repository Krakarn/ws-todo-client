import { observable } from 'mobx';

export class TableState<T> {
  public readonly name: string;

  @observable public list: T[];

  constructor(name: string, list: T[] = []) {
    this.name = name;
    this.list = list;
  }
}
