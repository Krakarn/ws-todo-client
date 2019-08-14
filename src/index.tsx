import * as React from 'react';
import * as ReactDOM from 'react-dom';

import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router-dom';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { App } from './components/app';
import { AppState } from './state/app';

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();

const state = new AppState();
const history = syncHistoryWithStore(browserHistory, routingStore);

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(
  (
    <Provider routing={routingStore}>
      <Router history={history}>
        <App state={state} />
      </Router>
    </Provider>
  ),
  container,
);
