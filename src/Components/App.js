import './App.css';
import { Dashboard, LoginForm, Profile, Orders } from '../Containers';
import { BrowserRouter, Link, Route, Router, Switch } from 'react-router-dom';

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
        <Route exact path="/orders">
          <Orders />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
