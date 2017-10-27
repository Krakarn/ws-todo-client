import * as React from 'react';

import { observer } from 'mobx-react';

import { UserState } from '../../state/user';

import { TodoItem } from './todo-item';

export interface ITableItemComponentProps {
  user: UserState;
}

@observer export class User extends React.Component<ITableItemComponentProps> {
  public render() {
    return (
      <ul className='list-group'>
        <li className='list-group-item'>
          <p className='col-3'>Id:</p>
          <p className='col'>{this.props.user.id}</p>
        </li>
        <li className='list-group-item'>
          <p className='col-3'>Name:</p>
          <p className='col'>{this.props.user.name}</p>
        </li>
        {
          this.props.user.todos.map(todo =>
            <li className='list-group-item' key={todo.id}>
              <TodoItem todo={todo} />
            </li>
          )
        }
      </ul>
    );
  }
}
