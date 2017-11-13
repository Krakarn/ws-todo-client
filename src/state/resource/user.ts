import { computed, observable } from 'mobx';

import { TodoItemState } from './todo-item';

export class UserState {
  public readonly id: string;

  @observable public name: string;
  @observable public todos: TodoItemState[];

  @computed public get json(): any {
    return {
      id: this.id,
      name: this.name,
      todos: this.todos.map(todo => todo.json),
    };
  }

  constructor(id: string, name: string, todos: TodoItemState[] = []) {
    this.id = id;
    this.name = name;
    this.todos = todos;
  }

  public static fromJson(json: any): UserState {
    return new UserState(
      json.id,
      json.name,
    );
  }
}
