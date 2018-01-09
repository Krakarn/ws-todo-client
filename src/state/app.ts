import { observable } from 'mobx';

import { ResourcesState } from './resources';
import { SubscribeUIState } from './ui/subscribe';
import { TasksUIState } from './ui/tasks';
import { TeamUIState } from './ui/team';

export class AppState {
  @observable public resources: ResourcesState;
  @observable public subscribeUI: SubscribeUIState;
  @observable public tasksUI: TasksUIState;
  @observable public teamUI: TeamUIState;

  constructor() {
    this.resources = new ResourcesState();
    this.subscribeUI = new SubscribeUIState(
      this.resources,
    );
    this.tasksUI = new TasksUIState(
      this.resources,
    );
    this.teamUI = new TeamUIState(
      this.resources,
    );
  }
}
