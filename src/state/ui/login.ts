import { observable } from 'mobx';

import { IComponentHooks } from '../componentHooks';
import { ResourcesState } from '../resources';

import { SessionState } from '../resource/session';

export class LoginUIState {
  public resources: ResourcesState;

  constructor(
    resources: ResourcesState,
  ) {
    this.resources = resources;
  }

  public login(name: string, password: string) {
    this.resources.create('session', {name, password});
  }
}

