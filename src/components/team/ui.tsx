import * as React from 'react';

import { AppState } from '../../state/app';
import { UserState } from '../../state/user';

export interface IUserComponentProps {
  user: UserState;
}

export interface IUserComponent extends React.Component<IUserComponentProps> {
}

export interface IUserComponentStatic {
  new(): IUserComponent;
}

export interface ITeamUIComponentProps {
  users: UserState[];
  UserComponent: IUserComponentStatic;
}

export class TeamUI extends React.Component<ITeamUIComponentProps> {
  public render() {
    const UserComponent = this.props.UserComponent;

    return (
      <div>
        <h1>Team</h1>
        <ul className='list-group'>
          {
            this.props.users.map(
              user => <UserComponent user={user}></UserComponent>
            )
          }
        </ul>
      </div>
    );
  }
}
