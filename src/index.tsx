import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { QueueingSubject } from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';

const input = new QueueingSubject<string>();

const { messages, connectionStatus } = websocketConnect('ws://localhost:8090', input);

input.next('hello server!');

const connectionStatusSubscription = connectionStatus.subscribe(numberConnected => {
  console.log('Number of connected websockets:', numberConnected);
});

const messagesSubscription = messages.subscribe(message => console.log('Server message:', message));

class App extends React.Component {
  public render() {
    return <p>Hello, world!</p>;
  }
}

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(<App />, container);
