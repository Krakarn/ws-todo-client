import { computed, observable } from 'mobx';

export class TaskState {
  public readonly id: string;

  @observable public name: string;
  @observable public description: string;
  @observable public done: boolean;

  @computed public get json(): any {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      done: this.done,
    };
  }

  constructor(id: string, name: string, description: string, done: boolean) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.done = done;
  }

  public static fromJson(json: any): TaskState {
    return new TaskState(
      json.id,
      json.name,
      json.description,
      json.done,
    );
  }
}
