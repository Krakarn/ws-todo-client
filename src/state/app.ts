import { observable } from 'mobx';

import { SubscribeUIState } from './subscribe-ui';

export class AppState {
  @observable public subscribeUI: SubscribeUIState;

  constructor() {
    this.subscribeUI = new SubscribeUIState();
  }
}
