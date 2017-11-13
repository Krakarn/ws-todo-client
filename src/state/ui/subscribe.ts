import * as Rx from 'rxjs';
import websocketConnect from 'rxjs-websockets';

import { action, computed, observable } from 'mobx';

import { ConnectionStatus } from '../message-bus-connection';
import { ResourcesState } from '../resources';

export class SubscribeUIState {
  @computed public get connecting(): boolean {
    return this.resources.status === ConnectionStatus.Connecting;
  }
  @computed public get connected(): boolean {
    return this.resources.status === ConnectionStatus.Connected;
  }
  @computed public get error(): string {
    if (this.resources.lastError) {
      if (this.resources.lastError.message) {
        return this.resources.lastError.message;
      } else {
        return 'Could not connect to the server. Try again later.';
      }
    }

    return '';
  }

  private resources: ResourcesState;

  constructor(
    resources: ResourcesState,
  ) {
    this.resources = resources;
  }

  @computed public get connectionStatus() {
    return this.connected ?
      'Connected' : this.connecting ?
      'Connecting' :
      'Disconnected'
    ;
  }

  @computed public get connectionStatusColor() {
    return this.connected ?
      'green' : this.connecting ?
      'yellow' :
      'red'
    ;
  }
}
