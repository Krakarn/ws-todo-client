import * as Rx from 'rxjs';
import websocketConnect from 'rxjs-websockets';

import { action, computed, observable } from 'mobx';

import { Subscription } from './subscription';

export class SubscribeUIState {
  @observable public response: string;
  @observable public waitingForResponse: boolean;
  @observable public connecting: boolean;
  @observable public connected: boolean;
  @observable public error: string;

  @observable public subscriptions: Subscription[];

  private input: Rx.Subject<string>;
  private messagesSubscription: Rx.Subscription;
  private connectionStatusSubscription: Rx.Subscription;

  constructor() {
    this.response = '';
    this.waitingForResponse = false;
    this.connecting = false;
    this.connected = false;
    this.error = void 0;

    this.subscriptions = [];

    this.input = new Rx.Subject();
    this.messagesSubscription = void 0;
    this.connectionStatusSubscription = void 0;
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

  @action public connect() {
    if (this.connected) {
      return;
    }

    this.setConnected(false);
    this.connecting = true;

    const { messages, connectionStatus } = websocketConnect(
      'ws://localhost:8090',
      this.input
    );

    this.messagesSubscription = messages.subscribe(
      this.receiveMessage.bind(this),
      this.onMessagesError.bind(this),
    );

    this.connectionStatusSubscription = connectionStatus.subscribe(
      numberConnected => {
        if (numberConnected > 0) {
          this.setConnected(true);
        }
      },
      this.onConnectionStatusError.bind(this)
    );
  }

  @action public disconnect() {
    this.setConnected(false);

    this.messagesSubscription.unsubscribe();
    this.connectionStatusSubscription.unsubscribe();

    this.messagesSubscription = void 0;
    this.connectionStatusSubscription = void 0;
  }

  @action public sendMessage(message: any) {
    const messageString = JSON.stringify(message);

    this.input.next(messageString);

    this.waitingForResponse = true;
  }

  @action public setError(error: string) {
    this.error = error;
  }

  @action private receiveMessage(message: any) {
    this.setError(void 0);

    this.waitingForResponse = false;

    const clientMessage = JSON.parse(message);

    if (clientMessage && clientMessage.type === 'subscribe') {
      this.subscriptions.push(clientMessage.subscription);
    }

    this.response = message;
  }

  @action private setConnected(connected: boolean) {
    this.waitingForResponse = false;
    this.connecting = false;
    this.error = void 0;
    this.connected = connected;
  }

  @action private onMessagesError(error: any) {
    this.disconnect();
    this.setError('Could not connect to the server. Try again later.');
  }

  @action private onConnectionStatusError(error: any) {
    this.disconnect();
    this.setError('Could not connect to the server. Try again later.');
  }
}
