import * as React from 'react';

import { observer } from 'mobx-react';

import { TaskState } from '../../state/resource/task';

export interface ITaskComponentProps {
  task: TaskState;
}

@observer export class Task extends React.Component<ITaskComponentProps> {
  public render() {
    return (
      <ul className='list-group'>
        <li className='list-group-item'>
          <p className='col-3'>Name:</p>
          <p className='col'>{this.props.task.name}</p>
        </li>
        <li className='list-group-item'>
          <p className='col-3'>Description:</p>
          <p className='col'>{this.props.task.description}</p>
        </li>
        <li className='list-group-item'>
          <p className='col-3'>Done:</p>
          <p className='col'>{this.props.task.done ? 'Yes' : 'No'}</p>
        </li>
      </ul>
    );
  }
}
