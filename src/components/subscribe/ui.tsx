import * as React from 'react';

import { observer } from 'mobx-react';

import { SubscribeUIState } from '../../state/subscribe-ui';
import { Subscription } from '../../state/subscription';

import { SubscriptionList } from './subscription-list';

export interface ISubscribeUIComponentProps {
  subscribeUI: SubscribeUIState;
}

export interface ISubscribeUIComponentState {
  customInputValue: string;
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

  public unsubscribe(subscription: Subscription) {
    this.props.subscribeUI.sendMessage({
      type: 'unsubscribe',
      subscriptionId: subscription.id,
    });

    const ss = this.props.subscribeUI.subscriptions;

    ss.splice(ss.indexOf(subscription), 1);
  }

  public render() {
    return (
      <div>
        <div>
          <p>Status: <span
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
        <div>
          <form onSubmit={this.onSubmitCustom.bind(this)}>
            <input
              type='text'
              disabled={!this.props.subscribeUI.connected}
              value={this.state.customInputValue}
              onChange={this.onCustomInputChange.bind(this)}
            />
            <button
              type='submit'
              disabled={!this.props.subscribeUI.connected}
            >
              Send
            </button>
          </form>
          <form onSubmit={this.onSubmitSubscribe.bind(this)}>
            <div>
              <label>Table:</label>
              <input
                type='text'
                disabled={!this.props.subscribeUI.connected}
                value={this.state.tableValue}
                onChange={this.onTableInputChange.bind(this)}
              />
            </div>
            <div>
              <label>Filter:</label>
              <input
                type='text'
                disabled={!this.props.subscribeUI.connected}
                value={this.state.filterValue}
                onChange={this.onFilterInputChange.bind(this)}
              />
            </div>
            <button
              type='submit'
              disabled={!this.props.subscribeUI.connected}
            >Subscribe</button>
          </form>
        </div>
        <div>
          {
            this.props.subscribeUI.connected || this.props.subscribeUI.connecting ?
              <button onClick={this.onClickDisconnect.bind(this)}>Disconnect</button> :
              <button onClick={this.onClickConnect.bind(this)}>Connect</button>
          }
        </div>
        <p>{
          this.props.subscribeUI.error ?
            this.props.subscribeUI.error :
            this.props.subscribeUI.waitingForResponse ?
              'Waiting for response...' :
              ''
          }
        </p>
        <p>{this.props.subscribeUI.response}</p>

        <SubscriptionList
          subscriptions={this.props.subscribeUI.subscriptions}
          unsubscribe={this.unsubscribe.bind(this)}
        />
      </div>
    );
  }
}
