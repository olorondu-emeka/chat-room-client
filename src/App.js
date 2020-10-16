import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/register" render={() => <p>Hello</p>} />
        <Redirect to="/register"/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
