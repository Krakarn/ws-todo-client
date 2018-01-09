import { action, computed } from 'mobx';

import { TaskState } from '../resource/task';
import { ResourcesState } from '../resources';

export class TasksUIState {
  @computed public get tasks(): TaskState[] {
    return this.resources.tables['task'].list;
  }

  public resources: ResourcesState;

  private taskSubscriptionHandle: string;

  constructor(
    resources: ResourcesState,
  ) {
    this.resources = resources;
  }

  @action public mount() {
    this.taskSubscriptionHandle = this.resources.subscribe('task');
  }

  @action public unmount() {
    this.resources.unsubscribe(this.taskSubscriptionHandle);
  }
}
