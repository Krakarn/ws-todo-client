import * as React from 'react';

import { observer } from 'mobx-react';

import { SubscribeUIState } from '../../state/subscribe-ui';
import { Subscription } from '../../state/subscription';
import { UserState } from '../../state/user';

import { SubscriptionList } from './subscription-list';
import { Table } from './table';
import { User } from './user';

type UserTable = new () => Table<UserState>;
const UserTable = Table as UserTable;

export interface ISubscribeUIComponentProps {
  subscribeUI: SubscribeUIState;
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

      this.props.subscribeUI.sendMessage(JSON.parse(this.state.customInputValue));
    } catch(e) {
      this.props.subscribeUI.setError(e.message);
    }

    return false;
  }

  public onSubmitDebug(e: Event) {
    e.preventDefault();

    const message = {
      type: 'debug',
      expression: this.state.debugInputValue,
    };

    this.props.subscribeUI.sendMessage(message);

    return false;
  }

  public onSubmitSubscribe(e: Event) {
    e.preventDefault();

    this.props.subscribeUI.sendMessage({
      type: 'subscribe',
      table: this.state.tableValue,
      filter: this.state.filterValue,
    });

    return false;
  }

  public onClickConnect() {
    this.props.subscribeUI.connect();
  }

  public onClickDisconnect() {
    this.props.subscribeUI.disconnect();
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

  public unsubscribe<T>(subscription: Subscription<T>) {
    this.props.subscribeUI.sendMessage({
      type: 'unsubscribe',
      subscriptionId: subscription.id,
    });

    const ss = this.props.subscribeUI.subscriptions;

    ss.splice(ss.indexOf(subscription), 1);
  }

  public onDeleteItem<T extends {id: string}>(table: string, item: T) {
    this.props.subscribeUI.sendMessage({
      type: 'delete',
      table: table,
      id: item.id,
    });
  }

  public render() {
    return (
      <div className='container'>
        <div className='form-group row'>
          <div className='col-2'>
            {
              this.props.subscribeUI.connected || this.props.subscribeUI.connecting ?
                <button className='btn btn-danger' onClick={this.onClickDisconnect.bind(this)}>Disconnect</button> :
                <button className='btn btn-success' onClick={this.onClickConnect.bind(this)}>Connect</button>
            }
          </div>
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
          <p className='alert alert-danger'>{this.props.subscribeUI.error}</p> :
          ''
        }
        {this.props.subscribeUI.waitingForResponse ?
          <p className='alert alert-info'>'Waiting for response...'</p> :
          ''
        }
        {this.props.subscribeUI.response ?
          <p className='alert alert-success'>{this.props.subscribeUI.response}</p> :
          ''
        }

        <div className='row'>
          <div className='col-6'>
            <p>Subscriptions</p>
            <SubscriptionList
              subscriptions={this.props.subscribeUI.subscriptions}
              unsubscribe={this.unsubscribe.bind(this)}
            />
          </div>
          <div className='col-6'>
            <p>Users</p>
            <UserTable
              table={this.props.subscribeUI.tables.user}
              generateItem={item => <User user={item} />}
              onDelete={this.onDeleteItem.bind(this, 'user')}
            />
          </div>
        </div>
      </div>
    );
  }
}
