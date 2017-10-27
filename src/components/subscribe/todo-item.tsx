import * as React from 'react';

import { observer } from 'mobx-react';

import { TodoItemState } from '../../state/todo-item';

export interface ITodoItemComponentProps {
  todo: TodoItemState;
}

@observer export class TodoItem extends React.Component<ITodoItemComponentProps> {
  public render() {
    return (
      <ul className='list-group'>
        <li className='list-group-item'>
          <p className='col-3'>Name:</p>
          <p className='col'>{this.props.todo.name}</p>
        </li>
        <li className='list-group-item'>
          <p className='col-3'>Description:</p>
          <p className='col'>{this.props.todo.description}</p>
        </li>
        <li className='list-group-item'>
          <p className='col-3'>Done:</p>
          <p className='col'>{this.props.todo.done}</p>
        </li>
      </ul>
    );
  }
}
