import { action, computed } from 'mobx';

import { UserState } from '../resource/user';
import { ResourcesState } from '../resources';

export class TeamUIState {
  @computed public get users(): UserState[] {
    return this.resources.tables['user'].list;
  }

  private resources: ResourcesState;
  private userSubscriptionHandle: string;

  constructor(
    resources: ResourcesState,
  ) {
    this.resources = resources;
  }

  @action public mount() {
    this.userSubscriptionHandle = this.resources.subscribe('user');
  }

  @action public unmount() {
    this.resources.unsubscribe(this.userSubscriptionHandle);
  }
}
