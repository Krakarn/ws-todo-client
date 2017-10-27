import { observable } from 'mobx';

export class TodoItemState {
  public readonly id: string;

  @observable public name: string;
  @observable public description: string;
  @observable public done: boolean;

  constructor(id: string, name: string, description: string, done: boolean) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.done = done;
  }
}
