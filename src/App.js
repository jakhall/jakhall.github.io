import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import NavBar from './components/NavBar'
import './App.css';


class App extends Component {
  render() {
    return (
      <div>
        <NavBar/>
        <div position="center">
        <p> Hello World! </p>
        </div>
      </div>
    );
  }
}

export default App;
