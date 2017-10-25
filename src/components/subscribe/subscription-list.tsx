import * as React from 'react';

import { observer } from 'mobx-react';

import { Subscription } from '../../state/subscription';

export interface ISubscriptionListComponentProps {
  subscriptions: Subscription[];
  unsubscribe(subscription: Subscription): void;
}

@observer export class SubscriptionList extends React.Component<
  ISubscriptionListComponentProps
> {
  public onClickUnsubscribe(subscription: Subscription) {
    this.props.unsubscribe(subscription);
  }

  public render() {
    return (
      <ul>
        {
          this.props.subscriptions.map(subscription =>
            <li><ul>
              <li>Id: {subscription.id}</li>
              <li>Table: {subscription.table}</li>
              {
                subscription.filter ?
                  <li>Filter: {subscription.filter}</li> :
                  ''
              }
              <li>
                <button
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
