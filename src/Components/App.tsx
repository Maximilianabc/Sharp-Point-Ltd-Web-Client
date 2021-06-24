import './App.css';
import {
  Dashboard,
  LoginForm,
  Profile,
  Positions,
  Orders,
  LogOut
} from '../Containers';
import {
  Route,
  Switch
} from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer';
import { useSelector } from 'react-redux';
import { stayAlive, UserState } from '../Util';

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
          <LoginForm />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/positions">
          <Positions />
        </Route>
        <Route exact path="/orders">
          <Orders />
        </Route>
        <Route exact path="/logout">
          <LogOut/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
