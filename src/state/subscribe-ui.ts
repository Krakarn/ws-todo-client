import * as Rx from 'rxjs';
import websocketConnect from 'rxjs-websockets';

import { action, computed, observable } from 'mobx';

import { Subscription } from './subscription';
import { TableState } from './table';
import { TodoItemState } from './todo-item';
import { UserState } from './user';

export class SubscribeUIState {
  @observable public response: string;
  @observable public waitingForResponse: boolean;
  @observable public connecting: boolean;
  @observable public connected: boolean;
  @observable public error: string;

  @observable public subscriptions: Subscription<any>[];
  @observable public tables: {[tableName:string]: TableState<any>};

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
    this.tables = {
      user: new TableState('user'),
      todoItem: new TableState('todoItem'),
    };

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

    if (message && typeof message.size === 'number' && message.size === 0) {
      return;
    }

    const clientMessage = JSON.parse(message);

    if (clientMessage) {
      switch(clientMessage.type) {
        case 'subscribe':
          this.subscriptions.push(clientMessage.subscription);
          break;
        case 'list':
          this.handleListMessage(clientMessage);
          break;
        case 'create':
          this.handleCreateMessage(clientMessage);
          break;
        case 'update':
          this.handleUpdateMessage(clientMessage);
          break;
        case 'delete':
          this.handleDeleteMessage(clientMessage);
          break;
      }
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

  private getSubscriptionById<T>(subscriptionId: string): Subscription<T> {
    return this.subscriptions.find(s => s.id === subscriptionId);
  }

  private getGenerateItemFn(clientMessage: any) {
    let generateItem: (rawItem: any) => any = rawItem => rawItem;

    switch(clientMessage.table) {
      case 'user':
        generateItem = rawItem => new UserState(
          rawItem.id,
          rawItem.name,
          rawItem.todos,
        );
        break;

      case 'todo-item':
        generateItem = rawItem => new TodoItemState(
          rawItem.id,
          rawItem.name,
          rawItem.description,
          rawItem.done,
        );
        break;
    }

    return generateItem;
  }

  private handleListMessage(clientMessage: any) {
    const generateItem = this.getGenerateItemFn(clientMessage);

    this.tables[clientMessage.table].list = clientMessage.list.map(generateItem);
  }

  private handleCreateMessage(clientMessage: any) {
    const generateItem = this.getGenerateItemFn(clientMessage);

    this.tables[clientMessage.table].list.push(generateItem(clientMessage.item));
  }

  private handleUpdateMessage(clientMessage: any) {
    const item = this.tables[clientMessage.table].list.find(i => i.id === item.id);

    for (const k in clientMessage.item) {
      if (clientMessage.item.hasOwnProperty(k)) {
        item[k] = clientMessage.item[k];
      }
    }
  }

  private handleDeleteMessage(clientMessage: any) {
    this.tables[clientMessage.table].list =
      this.tables[clientMessage.table].list.filter(i => i.id !== clientMessage.item.id)
    ;
  }
}
