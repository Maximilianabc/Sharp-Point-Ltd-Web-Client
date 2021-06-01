import React, { useState } from 'react';
import { DefaultInputField, useStyle } from './InputField';
import { Button, makeStyles } from '@material-ui/core';

const serverIP = "http://192.168.123.136";
const port = "99";

const useStyleForm = makeStyles((theme) => ({
  root: {
    alignItems: 'center'
  }
}));

const LoginForm = (props) => {
	const classes = useStyle();
	
	const handleLoginButtonClicked = () => {
		// TODO: input checking?

	};

	const handleSumbit = (id, pw) => (event) => {
		event.preventDefault();
		console.log(id + pw);
		const reqOpt = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'password': pw,
				'userId': id
			})
		};
		fetch(`${serverIP}:${port}/apiCustomer/accessRight/userLogin`, reqOpt)
			.then(response => response.json())
			.then(data => console.log(data));
	};

	return (
		<div style={{useStyleForm}}>
			<form 
				onSubmit={handleSumbit(document.getElementById('user-name').value, document.getElementById('password').value)}
				autoComplete="off"
			>
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
				<input type="submit" value="Login" />  
		</form>
	</div>	
	);
}

export {
	LoginForm
}