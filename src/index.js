import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Create from './components/Create';
import Login from './components/Login';
import Suggestions from './components/Suggestions';




ReactDOM.render(
  <Router>
  <div>
  <Route exact path='/' component={App} />
  <Route path='/create' component={Create} />
  <Route path='/login' component={Login} />
  <Route path='/company' component={Suggestions} />
  </div>
  </Router>,
  document.getElementById('root')
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();