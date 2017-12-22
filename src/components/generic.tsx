import * as React from 'react';

import { IComponentHooks } from '../state/componentHooks';

export interface IGenericComponentProps<T> {
  state: T;
}

export class GenericComponent<T extends IGenericComponentProps<Partial<IComponentHooks>>> extends React.Component<T> {
  public componentDidMount() {
    this.props.state.mount();
  }

  public componentWillUnmount() {
    this.props.state.unmount();
  }
}
