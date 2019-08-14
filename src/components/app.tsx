import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';

import { AppState } from '../state/app';

import { GenericComponent } from './generic';

import { LoginUI } from './login/ui';
import { Navbar } from './navbar';
import { SubscribeUI } from './subscribe/ui';
import { User } from './subscribe/user';
import { TasksUI } from './tasks/ui';
import { TeamUI } from './team/ui';

export interface IAppComponentProps extends IUpdateOnNavigationComponentProps {
  state: AppState;
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
              subscribeUI={this.props.state.subscribeUI}
              resources={this.props.state.resources}
              {...props}
            />
          }/>
          <Route path='/login' render={props =>
            <LoginUI
              state={this.props.state.loginUI}
              {...props}
            />
          }/>
          <Route path='/team' render={props =>
            <TeamUI
              state={this.props.state.teamUI}
              {...props}
            />
          }/>
          <Route path='/tasks' render={props =>
            <TasksUI
              state={this.props.state.tasksUI}
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

  public componentDidMount() {
    GenericComponent.prototype.componentDidMount.call(this);
  }

  public componentWillUnmount() {
    GenericComponent.prototype.componentWillUnmount.call(this);
  }
}
