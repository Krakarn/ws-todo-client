import * as React from 'react';

import { observer } from 'mobx-react';

import { LoginUIState } from '../../state/ui/login';

export interface ILoginUIComponentProps {
  state: LoginUIState;
}

export interface ILoginUIComponentState {
  nameInputValue: string;
  passwordInputValue: string;
}

@observer export class LoginUI extends React.Component<
  ILoginUIComponentProps,
  ILoginUIComponentState
> {
  constructor(props) {
    super(props);

    this.state = {
      nameInputValue: '',
      passwordInputValue: '',
    };
  }

  public onSubmit(e: Event) {
    try {
      e.preventDefault();

      this.props.state.resources.create<{name: string; password: string}>('session', {
        name: this.state.nameInputValue,
        password: this.state.passwordInputValue,
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

  public onPasswordInputChange(event: Event) {
    this.setState({
      passwordInputValue: (event.target as HTMLInputElement).value,
    });
  }

  public render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className='row'>
            <label className='col'>Name:</label>
            <label className='col'>Password:</label>
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
              value={this.state.passwordInputValue}
              onChange={this.onPasswordInputChange.bind(this)}
            />
          </div>
          <button
            className='btn btn-primary'
            type='submit'
          >
            Login
          </button>
        </form>
      </div>
    );
  }
}
