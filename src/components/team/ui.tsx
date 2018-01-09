import * as React from 'react';

import { observer } from 'mobx-react';

import { GenericComponent } from '../generic';

import { UserState } from '../../state/resource/user';
import { TeamUIState } from '../../state/ui/team';

export interface IUserComponentProps {
  user: UserState;
}

export interface IUserComponent extends React.Component<IUserComponentProps> {
}

export interface ITeamUIComponentProps {
  state: TeamUIState;
  generateUserComponent?(user: UserState): JSX.Element;
}

@observer export class TeamUI extends GenericComponent<ITeamUIComponentProps> {
  public static defaultProps: Partial<ITeamUIComponentProps> = {
    generateUserComponent: user => (
      <ul key={user.id} className='list-group'>
        <li className='list-group-item'>
          <p className='col-3'>Name:</p>
          <p className='col'>{user.name}</p>
        </li>
      </ul>
    ),
  };

  public render() {
    return (
      <div>
        <h1>Team</h1>
        <ul className='list-group'>
          {
            this.props.state.users.map(
              user => this.props.generateUserComponent(user)
            )
          }
        </ul>
      </div>
    );
  }
}
