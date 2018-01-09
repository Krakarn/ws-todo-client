import * as React from 'react';

import { observer } from 'mobx-react';

import { GenericComponent } from '../generic';

import { TaskState } from '../../state/resource/task';
import { TasksUIState } from '../../state/ui/tasks';

export interface ITaskComponentProps {
  task: TaskState;
}

export interface ITaskComponent extends React.Component<ITaskComponentProps> {
}

export interface ITasksUIComponentProps {
  state: TasksUIState;
  generateTaskComponent?(task: TaskState): JSX.Element;
}

export interface ITasksUIComponentState {
  inputValue: string;
}

@observer export class TasksUI extends GenericComponent<
  ITasksUIComponentProps,
  ITasksUIComponentState
> {
  public static defaultProps: Partial<ITasksUIComponentProps> = {
    generateTaskComponent: task => (
      <ul key={task.id} className='list-group'>
        <li className='list-group-item'>
          <p className='col-3'>Name:</p>
          <p className='col'>{task.name}</p>
        </li>
        <li className='list-group-item'>
          <p className='col-3'>Description:</p>
          <p className='col'>{task.description}</p>
        </li>
        <li className='list-group-item'>
          <p className='col-3'>Done:</p>
          <p className='col'>{task.done ? 'Yes' : 'No'}</p>
        </li>
      </ul>
    ),
  };

  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
    };
  }

  public onSubmit(e: Event) {
    try {
      e.preventDefault();

      this.props.state.resources.create('task', {
        name: this.state.inputValue,
      });
    } catch(e) {
    }

    return false;
  }

  public onInputChange(event: Event) {
    this.setState({
      inputValue: (event.target as HTMLInputElement).value,
    });
  }

  public render() {
    return (
      <div>
        <h1>Tasks</h1>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className='form-group'>
            <input
              className='form-control'
              type='text'
              value={this.state.inputValue}
              onChange={this.onInputChange.bind(this)}
            />
          </div>
          <button
            className='btn btn-secondary'
            type='submit'
          >
            Send
          </button>
        </form>
        <ul className='list-group'>
          {
            this.props.state.tasks.map(
              task => this.props.generateTaskComponent(task)
            )
          }
        </ul>
      </div>
    );
  }
}
