import * as React from 'react';

import { IComponentHooks } from '../state/componentHooks';

export interface IGenericComponentProps<T> {
  state: T;
}

export class GenericComponent<
  T extends IGenericComponentProps<Partial<IComponentHooks>>,
  U = any
> extends React.Component<T, U> {
  public componentDidMount() {
    this.props.state.mount();
  }

  public componentWillUnmount() {
    this.props.state.unmount();
  }
}
