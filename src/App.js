import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Chat from './pages/Chat/Chat';

import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/register" render={() => <p>Hello</p>} />
        <Route path="/chat" component={Chat} />
        <Redirect to="/register"/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
