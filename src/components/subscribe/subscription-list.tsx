import * as React from 'react';

import { observer } from 'mobx-react';

import { Subscription } from '../../state/subscription';

export interface ISubscriptionListComponentProps {
  subscriptions: Subscription<any>[];
  unsubscribe<T>(subscription: Subscription<T>): void;
}

@observer export class SubscriptionList extends React.Component<
  ISubscriptionListComponentProps
> {
  public onClickUnsubscribe<T>(subscription: Subscription<T>) {
    this.props.unsubscribe(subscription);
  }

  public render() {
    return (
      <ul className='list-group'>
        {
          this.props.subscriptions.map((subscription, i) =>
            <li className='list-group-item' key={i}><ul className='list-group'>
              <li className='list-group-item'>Id: {subscription.id}</li>
              <li className='list-group-item'>Table: {subscription.table}</li>
              {
                subscription.filter ?
                  <li className='list-group-item'>Filter: {subscription.filter}</li> :
                  ''
              }
              <li className='list-group-item'>
                <button
                  className='btn btn-danger'
                  onClick={this.onClickUnsubscribe.bind(this, subscription)}
                >Unsubscribe</button>
              </li>
            </ul></li>
          )
        }
      </ul>
    );
  }
}
