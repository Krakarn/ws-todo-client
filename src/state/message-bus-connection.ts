import { action, computed, observable } from 'mobx';
import * as Rx from 'rxjs';
import websocketConnect from 'rxjs-websockets';

export enum ConnectionStatus {
  Connected,
  Disconnected,
  Connecting,
}

export class MessageBusConnection {
  @observable public lastError: any;

  @computed public get status(): ConnectionStatus {
    if (this.connecting) {
      return ConnectionStatus.Connecting;
    }

    return this.connected ?
      ConnectionStatus.Connected :
      ConnectionStatus.Disconnected
    ;
  }

  @observable private numberOfConnections: number;
  @observable private connecting: boolean;

  @computed private get connected(): boolean {
    return this.numberOfConnections > 0;
  }

  private url: string;
  private input: Rx.Subject<string>;
  private messagesSubscription: Rx.Subscription;
  private connectionStatusSubscription: Rx.Subscription;

  private onMessage: (message: string) => void;
  private onError: (error: any) => void;

  constructor(
    url: string,
    onMessage: (message: string) => void,
    onError: (error: any) => void = () => void 0,
  ) {
    this.lastError = void 0;

    this.numberOfConnections = 0;
    this.connecting = false;

    this.url = url;

    this.input = new Rx.ReplaySubject(10);
    this.messagesSubscription = void 0;
    this.connectionStatusSubscription = void 0;

    this.onMessage = onMessage;
    this.onError = onError;
  }

  @action public connect() {
    if (this.status === ConnectionStatus.Connected) {
      return;
    }

    this.connecting = true;

    const { messages, connectionStatus } = websocketConnect(
      this.url,
      this.input,
    );

    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }

    if (this.connectionStatusSubscription) {
      this.connectionStatusSubscription.unsubscribe();
    }

    this.messagesSubscription = messages.subscribe(
      message => this._onMessage(message),
      error => this._onError(error),
    );

    this.connectionStatusSubscription = connectionStatus.subscribe(
      numberConnected => {
        this.setNumberConnected(numberConnected);
        this.connecting = numberConnected === 0;
      },
      error => this.onError(error),
    );
  }

  @action public disconnect() {
    if (this.status === ConnectionStatus.Disconnected) {
      return;
    }

    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
      this.messagesSubscription = void 0;
    }

    if (this.connectionStatusSubscription) {
      this.connectionStatusSubscription.unsubscribe();
      this.connectionStatusSubscription = void 0;
    }

    this.numberOfConnections = 0;
    this.connecting = false;
  }

  @action public sendMessage(message: string) {
    this.input.next(message);
  }

  @action private setNumberConnected(numberConnected: number) {
    this.numberOfConnections = numberConnected;
  }

  @action private _onMessage(message: any) {
    if (message && typeof message.size === 'number' && message.size === 0) {
      return;
    }

    this.onMessage(message);
  }

  @action private _onError(error: any) {
    this.lastError = error;
    this.onError(error);
  }
}
