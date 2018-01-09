import * as React from 'react';

import { observer } from 'mobx-react';

import { UserState } from '../../state/resource/user';

import { Task } from './task';

export interface ITableItemComponentProps {
  user: UserState;
  onChange(user: UserState): void;
}

@observer export class User extends React.Component<ITableItemComponentProps> {
  public onNameChange(event: Event) {
    this.props.user.name = (event.target as HTMLInputElement).value;
    this.props.onChange(this.props.user);
  }

  public render() {
    return (
      <ul className='list-group'>
        <li className='list-group-item'>
          <p className='col-3'>Id:</p>
          <p className='col'>{this.props.user.id}</p>
        </li>
        <li className='list-group-item'>
          <p className='col-3'>Name:</p>
          <input
            className='col'
            value={this.props.user.name}
            onChange={this.onNameChange.bind(this)}
          />
        </li>
        {
          this.props.user.tasks.map(task =>
            <li className='list-group-item' key={task.id}>
              <Task task={task} />
            </li>
          )
        }
      </ul>
    );
  }
}
