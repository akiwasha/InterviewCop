import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import username from './reducers/username.reducer';
import job from './reducers/job.reducer';
import county from './reducers/county.reducer';
import icop from './reducers/icop.reducer';
import score from './reducers/score.reducer';
import detailedscore from './reducers/detailedscore.reducer';

import LoginPage from './LoginPage';
import PasswordRecoveryPage from './PasswordRecoveryPage';
import HomePage from './HomePage';
import InterviewHomePage from './InterviewHomePage';
import InterviewPage from './InterviewPage';
import ResultPage from './ResultPage';
import AccountPage from './AccountPage';
import ShopPage from './ShopPage';
import AdvicePage from './AdvicePage';
import ChatPage from './ChatPage';

const store = createStore(
  combineReducers({ score, detailedscore, username, job, county, icop })
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route component={LoginPage} path="/" exact />
          <Route
            component={PasswordRecoveryPage}
            path="/password-recovery"
            exact
          />
          <Route component={HomePage} path="/homepage" exact />
          <Route
            component={InterviewHomePage}
            path="/interviewhomepage"
            exact
          />
          <Route component={InterviewPage} path="/interviewpage" exact />
          <Route component={ResultPage} path="/resultpage" exact />
          <Route component={AccountPage} path="/account" exact />
          <Route component={ShopPage} path="/shop" exact />
          <Route component={AdvicePage} path="/advices" exact />
          <Route component={ChatPage} path="/chat" exact />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
