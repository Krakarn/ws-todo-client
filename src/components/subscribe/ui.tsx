import * as React from 'react';

import { observer } from 'mobx-react';

import { UserState } from '../../state/resource/user';
import { ResourcesState } from '../../state/resources';
import { Subscription } from '../../state/subscription';
import { SubscribeUIState } from '../../state/ui/subscribe';

import { SubscriptionList } from './subscription-list';
import { Table } from './table';
import { User } from './user';

type UserTable = new () => Table<UserState>;
const UserTable = Table as UserTable;

export interface ISubscribeUIComponentProps {
  subscribeUI: SubscribeUIState;
  resources: ResourcesState;
}

export interface ISubscribeUIComponentState {
  customInputValue: string;
  debugInputValue: string;
  tableValue: string;
  filterValue: string;
}

@observer export class SubscribeUI extends React.Component<
  ISubscribeUIComponentProps,
  ISubscribeUIComponentState
> {
  constructor(props) {
    super(props);

    this.state = {
      customInputValue: '',
      debugInputValue: '',
      tableValue: '',
      filterValue: '',
    };
  }

  public onSubmitCustom(e: Event) {
    try {
      e.preventDefault();

      this.props.resources.sendMessage(this.state.customInputValue);
    } catch(e) {
    }

    return false;
  }

  public onSubmitDebug(e: Event) {
    e.preventDefault();

    const message = {
      type: 'debug',
      expression: this.state.debugInputValue,
    };

    this.props.resources.sendMessage(JSON.stringify(message));

    return false;
  }

  public onSubmitSubscribe(e: Event) {
    e.preventDefault();

    this.props.resources.subscribe(this.state.tableValue, this.state.filterValue);

    return false;
  }

  public onCustomInputChange(event: Event) {
    this.setState({
      customInputValue: (event.target as HTMLInputElement).value,
    });
  }

  public onDebugInputChange(event: Event) {
    this.setState({
      debugInputValue: (event.target as HTMLInputElement).value,
    });
  }

  public onTableInputChange(event: Event) {
    this.setState({
      tableValue: (event.target as HTMLInputElement).value
    });
  }

  public onFilterInputChange(event: Event) {
    this.setState({
      filterValue: (event.target as HTMLInputElement).value
    });
  }

  public unsubscribe<T>(subscription: Subscription) {
    this.props.resources.unsubscribe(subscription.handle);
  }

  public onDeleteItem<T extends {id: string}>(table: string, item: T) {
    this.props.resources.delete(table, item.id);
  }

  public onUserChange(user: UserState) {
    this.props.resources.update('user', user.json);
  }

  public render() {
    return (
      <div>
        <div className='form-group row'>
          <div className='col-2'>
            <p className='alert alert-light'>Status: <span
              style={{
                borderRadius: '100%',
                border: '1px solid black',
                backgroundColor: this.props.subscribeUI.connectionStatusColor,
                width: '16px',
                height: '16px',
                display: 'inline-block',
              }}
              title={this.props.subscribeUI.connectionStatus}
            ></span></p>
          </div>
        </div>
        <div className='form-group'>
          <form onSubmit={this.onSubmitCustom.bind(this)}>
            <div className='form-group'>
              <input
                className='form-control'
                type='text'
                disabled={!this.props.subscribeUI.connected}
                value={this.state.customInputValue}
                onChange={this.onCustomInputChange.bind(this)}
              />
            </div>
            <button
              className='btn btn-secondary'
              type='submit'
              disabled={!this.props.subscribeUI.connected}
            >
              Send
            </button>
          </form>
          <form onSubmit={this.onSubmitDebug.bind(this)}>
            <div className='form-group'>
              <input
                className='form-control'
                type='text'
                disabled={!this.props.subscribeUI.connected}
                value={this.state.debugInputValue}
                onChange={this.onDebugInputChange.bind(this)}
              />
            </div>
            <button
              className='btn btn-secondary'
              type='submit'
              disabled={!this.props.subscribeUI.connected}
            >
              Send Debug
            </button>
          </form>
          <form onSubmit={this.onSubmitSubscribe.bind(this)}>
            <div className='form-group row'>
              <div className='col'>
                <label>Table:</label>
                <input
                  className='form-control'
                  type='text'
                  disabled={!this.props.subscribeUI.connected}
                  value={this.state.tableValue}
                  onChange={this.onTableInputChange.bind(this)}
                />
              </div>
              <div className='col'>
                <label>Filter:</label>
                <input
                  className='form-control'
                  type='text'
                  disabled={!this.props.subscribeUI.connected}
                  value={this.state.filterValue}
                  onChange={this.onFilterInputChange.bind(this)}
                />
              </div>
            </div>
            <button
              className='btn btn-primary'
              type='submit'
              disabled={!this.props.subscribeUI.connected}
            >Subscribe</button>
          </form>
        </div>

        {this.props.subscribeUI.error ?
          <p className='alert alert-danger'>{
            this.props.subscribeUI.error
          }</p> :
          ''
        }

        <div className='row'>
          <div className='col-6'>
            <p>Subscriptions</p>
            <SubscriptionList
              subscriptions={(this.props.resources as any).subscriptions}
              unsubscribe={this.unsubscribe.bind(this)}
            />
          </div>
          <div className='col-6'>
            <p>Users</p>
            <UserTable
              table={this.props.resources.tables.user}
              generateItem={item => <User user={item} onChange={this.onUserChange.bind(this)} />}
              onDelete={this.onDeleteItem.bind(this, 'user')}
            />
          </div>
        </div>
      </div>
    );
  }
}
