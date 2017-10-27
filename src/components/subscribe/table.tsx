import * as React from 'react';

import { observer } from 'mobx-react';

import { TableState } from '../../state/table';

export interface ITableComponentProps<T> {
  table: TableState<T>;
  generateItem(itemState: T): JSX.Element;
  onDelete(itemState: T): void;
}

@observer export class Table<T extends {id:string}> extends React.Component<ITableComponentProps<T>> {
  public render() {
    return (
      <ul className='list-group'>
        {
          this.props.table.list.length > 0 ?
            this.props.table.list.map(item =>
              <li className='list-group-item' key={item.id}>
                {this.props.generateItem(item)}
                <button className='btn btn-danger' onClick={this.props.onDelete.bind(this, item)}>Delete</button>
              </li>
            ) :
            <li className='list-group-item alert alert-light'>Nothing here.</li>
        }
      </ul>
    );
  }
}
