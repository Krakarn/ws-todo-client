import { observable } from 'mobx';

import { IComponentHooks } from './componentHooks';
import { ResourcesState } from './resources';

import { LoginUIState } from './ui/login';
import { SubscribeUIState } from './ui/subscribe';
import { TasksUIState } from './ui/tasks';
import { TeamUIState } from './ui/team';

export class AppState implements IComponentHooks {
  @observable public resources: ResourcesState;
  @observable public loginUI: LoginUIState;
  @observable public subscribeUI: SubscribeUIState;
  @observable public tasksUI: TasksUIState;
  @observable public teamUI: TeamUIState;

  constructor() {
    this.resources = new ResourcesState();

    this.loginUI = new LoginUIState(
      this.resources,
    );

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

  public mount() {
  }

  public unmount() {
  }
}
