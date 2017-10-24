import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { observer } from 'mobx-react';

import { AppState } from '../state/app';

@observer export class App extends React.Component {
  public state: {value: string};
  public props: {app: AppState};

  constructor(props) {
    super(props);

    this.state = {value: ''};
  }

  public onSubmit(e: Event) {
    try {
      e.preventDefault();

      this.props.app.sendMessage(JSON.parse(this.state.value));
    } catch(e) {
      this.props.app.setError(e.message);
    }

    return false;
  }

  public onClickConnect() {
    this.props.app.connect();
  }

  public onClickDisconnect() {
    this.props.app.disconnect();
  }

  public onInputChange(event: Event) {
    this.setState({value: (event.target as HTMLInputElement).value});
  }

  public render() {
    return (
      <div>
        <div>
          <p>Status: <span
            style={{
              borderRadius: '100%',
              border: '1px solid black',
              backgroundColor: this.props.app.connectionStatusColor,
              width: '16px',
              height: '16px',
              display: 'inline-block',
            }}
            title={this.props.app.connectionStatus}
          ></span></p>
        </div>
        <div>
          <form onSubmit={this.onSubmit.bind(this)}>
            <input
              type='text'
              disabled={!this.props.app.connected}
              value={this.state.value}
              onChange={this.onInputChange.bind(this)}
            />
            <button
              type="submit"
              disabled={!this.props.app.connected}
            >
              Send
            </button>
          </form>
        </div>
        <div>
          {
            this.props.app.connected || this.props.app.connecting ?
              <button onClick={this.onClickDisconnect.bind(this)}>Disconnect</button> :
              <button onClick={this.onClickConnect.bind(this)}>Connect</button>
          }
        </div>
        <p>{
          this.props.app.error ?
            this.props.app.error :
            this.props.app.waitingForResponse ?
              'Waiting for response...' :
              ''
          }
        </p>
        <p>{this.props.app.response}</p>
      </div>
    );
  }
}
