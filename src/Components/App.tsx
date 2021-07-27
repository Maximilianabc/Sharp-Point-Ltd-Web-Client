import './App.css';
import React from 'react';
import {
  Dashboard,
  LoginForm,
  LogOut
} from '../Containers';
import {
  Route,
  Switch
} from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer';
import { useSelector } from 'react-redux';
import { stayAlive, UserState } from '../Util';
import companyLogo from '../logo.svg';

function App() {
  const authed = useSelector((state: UserState) => state.authed);
  const token = useSelector((state: UserState) => state.token);

  const handleOnIdle = (event: any) => {
    //console.log('user is idle', event)
    //console.log('last active', getLastActiveTime())
  }

  const handleOnActive = (event: any) => {
    //console.log('user is active', event)
    //console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (event: any) => {
    if (authed && token) {
      stayAlive({
        sessionToken: token
      });
    }
  }

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 15,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500
  })
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={companyLogo} style={{ height: '256px', width: '256px' }}/>
            <LoginForm />
          </div>
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/logout">
          <LogOut/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
