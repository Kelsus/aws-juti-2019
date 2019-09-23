import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import Routes from './Routes';
import './App.css';

class App extends Component {
  render() {

    return (
      <div className="App container">
        <Navbar className="justify-content-between" bg="dark" collapseOnSelect>
          <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
        </Navbar>
        <Routes />
      </div>
    );
  }
}

export default withRouter(App);
