import * as uuid from 'uuid/v4';

import { action, computed, observable } from 'mobx';

import {
  ConnectionStatus,
  MessageBusConnection,
} from './message-bus-connection';

import { SessionState } from './resource/session';
import { TaskState } from './resource/task';
import { UserState } from './resource/user';
import { Subscription } from './subscription';
import { TableState } from './table';

interface IClientMessage {
  handle?: string;
  type: string;
}

interface IClientSubscriptionMessage extends IClientMessage {
  subscription: Subscription;
}

interface IClientSubscribeMessage extends IClientSubscriptionMessage {
  type: 'subscribe';
}

interface IClientUnsubscribeMessage extends IClientSubscriptionMessage {
  type: 'unsubscribe';
}

interface IClientTableMessage extends IClientMessage {
  type: string;
  table: string;
}

interface IClientListMessage extends IClientTableMessage {
  type: 'list';
  list: any[];
}

interface IClientItemMessage extends IClientTableMessage {
  item: any;
}

interface IClientCreateMessage extends IClientItemMessage {
  type: 'create';
}

interface IClientUpdateMessage extends IClientItemMessage {
  type: 'update';
  id: string;
}

interface IClientDeleteMessage extends IClientItemMessage {
  type: 'delete';
  id: string;
}

export class ResourcesState {
  @observable public tables: {[tableName:string]: TableState<any>};

  @observable private subscriptions: Subscription[];

  @computed public get status(): ConnectionStatus {
    return this.messageBusConnections &&
      this.messageBusConnections[0] &&
      this.messageBusConnections[0].status
    ;
  }

  @computed public get lastError(): any {
    return this.messageBusConnections &&
      this.messageBusConnections[0] &&
      this.messageBusConnections[0].lastError
    ;
  }

  private messageBusConnections: MessageBusConnection[];

  constructor() {
    this.tables = {
      session: new TableState(
        'session',
        [],
        SessionState.fromJson,
      ),
      task: new TableState(
        'task',
        [],
        TaskState.fromJson,
      ),
      user: new TableState(
        'user',
        [],
        UserState.fromJson,
      ),
    };
    this.subscriptions = [];

    this.messageBusConnections = [
      new MessageBusConnection(
        'ws://localhost:8090',
        message => this.onMessage(message),
        error => this.onError(error),
      )
    ];

    this.messageBusConnections.forEach(
      mbc => {
        mbc.connect();
      }
    );
  }

  @action public subscribe(table: string, filter?: string) {
    const id = uuid();

    this.sendMessage(JSON.stringify({
      handle: id,
      type: 'subscribe',
      table,
      filter,
    }));

    return id;
  }

  @action public unsubscribe(handle: string) {
    const subscription = this.subscriptions.find(s => s.handle === handle);

    if (subscription) {
      this.sendMessage(JSON.stringify({
        type: 'unsubscribe',
        subscriptionId: subscription.id,
      }));
    }
  }

  @action public create<T>(table: string, data: Partial<T>) {
    this.sendMessage(JSON.stringify({
      type: 'create',
      table,
      item: data,
    }));
  }

  @action public update<T>(table: string, data: Partial<T>) {
    this.sendMessage(JSON.stringify({
      type: 'update',
      table,
      item: data,
    }));
  }

  @action public delete(table: string, id: string) {
    this.sendMessage(JSON.stringify({
      type: 'delete',
      table,
      id,
    }));
  }

  @action public sendMessage(message: string) {
    this.messageBusConnections.forEach(
      mbc => mbc.sendMessage(message)
    );
  }

  @action private onMessage(message: string) {
    const serverMessage = JSON.parse(message);

    const handlers = {
      'subscribe': this.onSubscribeMessage.bind(this),
      'unsubscribe': this.onUnsubscribeMessage.bind(this),
      'list': this.onListMessage.bind(this),
      'create': this.onCreateMessage.bind(this),
      'update': this.onUpdateMessage.bind(this),
      'delete': this.onDeleteMessage.bind(this),
      'error': this.onError.bind(this),
    };

    const handler = handlers[serverMessage.type];

    if (!handler) {
      throw new Error(`Could not find client message handler for type ${serverMessage.type}`);
    }

    handler(serverMessage);
  }

  @action private onSubscribeMessage(serverMessage: IClientSubscribeMessage) {
    (serverMessage.subscription as any).handle = serverMessage.handle;
    this.subscriptions.push(serverMessage.subscription);
  }

  @action private onUnsubscribeMessage(serverMessage: IClientUnsubscribeMessage) {
    this.subscriptions = this.subscriptions.filter(
      sub => sub.id !== serverMessage.subscription.id
    );
  }

  @action private onListMessage(serverMessage: IClientListMessage) {
    const table = this.getTable<any>(serverMessage.table);

    table.list = serverMessage.list.map(table.generateEntry.bind(table));
  }

  @action private onCreateMessage(serverMessage: IClientCreateMessage) {
    const table = this.getTable<any>(serverMessage.table);

    const entry = table.generateEntry(serverMessage.item);

    table.list.push(entry);
  }

  @action private onUpdateMessage(serverMessage: IClientUpdateMessage) {
    const table = this.getTable<any>(serverMessage.table);

    const entry = table.list.find(e => e.id === serverMessage.item.id);

    for (const k in serverMessage.item) {
      if (serverMessage.item.hasOwnProperty(k)) {
        entry[k] = serverMessage.item[k];
      }
    }
  }

  @action private onDeleteMessage(serverMessage: IClientDeleteMessage) {
    const table = this.getTable<any>(serverMessage.table);

    table.list = table.list.filter(
      i => i.id !== serverMessage.item.id,
    );
  }

  private getTable<T>(tableName: string): TableState<T> {
    const table = this.tables[tableName];

    if (!table) {
      throw new Error(`Could not find table ${tableName}`);
    }

    return table;
  }

  @action private onError(error: any) {
    console.error(`ResourcesState MessageBusConnection Error:`, error);
  }
}
