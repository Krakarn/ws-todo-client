import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';

import { AppState } from '../state/app';

import { Navbar } from './navbar';
import { SubscribeUI } from './subscribe/ui';
import { User } from './subscribe/user';
import { TasksUI } from './tasks/ui';
import { TeamUI } from './team/ui';

export interface IAppComponentProps extends IUpdateOnNavigationComponentProps {
  app: AppState;
}

export interface IUpdateOnNavigationComponentProps {
  routing?: RouterStore;
}

export class UpdateOnNavigation<T extends IUpdateOnNavigationComponentProps> extends React.Component<T> {
  public shouldComponentUpdate(
    props: any,
    state: any,
    context: any,
  ) {
    return (
      props.routing.location !== this.props.routing.location ||
      !super.shouldComponentUpdate ||
      super.shouldComponentUpdate(props, state, context)
    );
  }
}

@inject('routing')
@observer export class App extends UpdateOnNavigation<IAppComponentProps> {
  public render() {
    return (
      <div className='container'>

        <Navbar />

        <Switch>
          <Route exact path='/' render={props =>
            <SubscribeUI
              subscribeUI={this.props.app.subscribeUI}
              resources={this.props.app.resources}
              {...props}
            />
          }/>
          <Route path='/team' render={props =>
            <TeamUI
              state={this.props.app.teamUI}
              {...props}
            />
          }/>
          <Route path='/tasks' render={props =>
            <TasksUI
              state={this.props.app.tasksUI}
              {...props}
            />
          }/>
          <Route render={props =>
            <h1>404 Not Found</h1>
          }/>
        </Switch>
      </div>
    );
  }
}
