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
  generateTaskComponent?(tasksUI: TasksUI, task: TaskState): JSX.Element;
}

export interface ITasksUIComponentState {
  nameInputValue: string;
  descriptionInputValue: string;
}

@observer export class TasksUI extends GenericComponent<
  ITasksUIComponentProps,
  ITasksUIComponentState
> {
  public static defaultProps: Partial<ITasksUIComponentProps> = {
    generateTaskComponent: (tasksUI: TasksUI, task: TaskState) => (
      <ul key={task.id} className='list-group'>
        <li className='list-group-item'>
          <p className='col-3'>Name:</p>
          <p className='col'>{task.name}</p>
        </li>
        { !task.description ? '' :
        <li className='list-group-item'>
          <p className='col-3'>Description:</p>
          <p className='col'>{task.description}</p>
        </li>
        }
        <li className='list-group-item'>
          <p className='col-3'>Done:</p>
          <input
            type='checkbox'
            checked={task.done}
            onChange={tasksUI.onDoneChanged.bind(tasksUI, task)}
          />
        </li>
      </ul>
    ),
  };

  constructor(props) {
    super(props);

    this.state = {
      nameInputValue: '',
      descriptionInputValue: '',
    };
  }

  public onSubmit(e: Event) {
    try {
      e.preventDefault();

      this.props.state.resources.create<TaskState>('task', {
        name: this.state.nameInputValue,
        description: this.state.descriptionInputValue,
      });
    } catch(e) {
    }

    return false;
  }

  public onNameInputChange(event: Event) {
    this.setState({
      nameInputValue: (event.target as HTMLInputElement).value,
    });
  }

  public onDescriptionInputChange(event: Event) {
    this.setState({
      descriptionInputValue: (event.target as HTMLInputElement).value,
    });
  }

  public onDoneChanged(task: TaskState, event: Event) {
    task.done = (event.target as HTMLInputElement).checked;
    this.props.state.resources.update('task', task);
  }

  public render() {
    return (
      <div>
        <h1>Tasks</h1>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className='row'>
            <label className='col'>Name:</label>
            <label className='col'>Description:</label>
          </div>
          <div className='row form-group'>
            <input
              className='col form-control'
              type='text'
              value={this.state.nameInputValue}
              onChange={this.onNameInputChange.bind(this)}
            />
            <input
              className='col form-control'
              type='text'
              value={this.state.descriptionInputValue}
              onChange={this.onDescriptionInputChange.bind(this)}
            />
          </div>
          <button
            className='btn btn-primary'
            type='submit'
          >
            Add task
          </button>
        </form>
        <ul className='list-group'>
          {
            this.props.state.tasks.map(
              task => this.props.generateTaskComponent(this, task)
            )
          }
        </ul>
      </div>
    );
  }
}
