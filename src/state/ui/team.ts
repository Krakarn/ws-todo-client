import { computed } from 'mobx';

import { UserState } from '../resource/user';
import { ResourcesState } from '../resources';

export class TeamUIState {
  @computed public get users(): UserState[] {
    return this.resources.tables['user'].list;
  }

  private resources: ResourcesState;

  constructor(
    resources: ResourcesState,
  ) {
    this.resources = resources;
  }
}
