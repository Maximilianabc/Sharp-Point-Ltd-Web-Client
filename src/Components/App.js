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
import { ClientWS } from './WebSocket';

function App() {
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
