import * as React from 'react';
import { NavLink } from 'react-router-dom';

export class Navbar extends React.Component {
  public render() {
    return (
      <nav className='navbar navbar-expand-lg navbar-light bg-light'>
        <ul className='navbar-nav'>
          <NavLink
            exact
            to='/'
            className='nav-item nav-link'
            activeClassName='active'
          >Home</NavLink>

          <NavLink
            to='/team'
            className='nav-item nav-link'
            activeClassName='active'
          >Team</NavLink>

          <NavLink
            to='/tasks'
            className='nav-item nav-link'
            activeClassName='active'
          >Tasks</NavLink>
        </ul>
      </nav>
    );
  }
}
