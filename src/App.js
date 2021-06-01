import logo from './logo.svg';
import './App.css';
import { DefaultInputField, useStyle } from './InputField';
import { Button } from '@material-ui/core';

function App() {
  const classes = useStyle();
  return (
    <div className="App">
      <header className="App-header">
        <form autoComplete="off">
          <ul>
            <li>
              <DefaultInputField
                id="user-name"
                label="User Name"
                margin={classes.margin}
                variant="filled"
              />
            </li>
            <li>
              <DefaultInputField
                id="password"
                label="Password"
                margin={classes.margin}
                variant="filled"
              />
            </li>            
          </ul>    
          <Button variant="contained">Login</Button>  
        </form>
      </header>
    </div>
  );
}

export default App;
