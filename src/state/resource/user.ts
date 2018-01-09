import { computed, observable } from 'mobx';

import { TaskState } from './task';

export class UserState {
  public readonly id: string;

  @observable public name: string;
  @observable public tasks: TaskState[];

  @computed public get json(): any {
    return {
      id: this.id,
      name: this.name,
      tasks: this.tasks.map(task => task.json),
    };
  }

  constructor(id: string, name: string, tasks: TaskState[] = []) {
    this.id = id;
    this.name = name;
    this.tasks = tasks;
  }

  public static fromJson(json: any): UserState {
    return new UserState(
      json.id,
      json.name,
    );
  }
}
