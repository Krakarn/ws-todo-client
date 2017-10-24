import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './components/app';
import { AppState } from './state/app';

const app = new AppState();

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(<App app={app} />, container);
