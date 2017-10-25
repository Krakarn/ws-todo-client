import * as React from 'react';

import { observer } from 'mobx-react';

import { AppState } from '../state/app';

import { SubscribeUI } from './subscribe/ui';

export interface IAppComponentProps {
  app: AppState;
}

@observer export class App extends React.Component<IAppComponentProps> {
  public render() {
    return (
      <div>
        <SubscribeUI subscribeUI={this.props.app.subscribeUI} />
      </div>
    );
  }
}
