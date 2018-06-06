import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import store, { history } from 'store';
import { Route, Switch } from 'react-router-dom';
import { Home } from 'pages';
import { Main } from 'style';
import 'style/global';

const MainRoute = props => {
  return (
    <Main>
      <Route {...props} />
    </Main>
  );
};

const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <MainRoute exact path="/" component={Home} />
      </Switch>
    </Router>
  </Provider>
);

export default Root;