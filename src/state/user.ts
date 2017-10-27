import { observable } from 'mobx';

import { TodoItemState } from './todo-item';

export class UserState {
  public readonly id: string;

  @observable public name: string;
  @observable public todos: TodoItemState[];

  constructor(id: string, name: string, todos: TodoItemState[] = []) {
    this.id = id;
    this.name = name;
    this.todos = todos;
  }
}
