import React, { useState } from 'react';
import { DefaultInputField, useStyle } from './InputField';
import { Button, makeStyles } from '@material-ui/core';

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

	const handleSumbit = (event) => {
		event.preventDefault();
		const reqOpt = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'password': 'MAX01',
				'userId': 'sp'
			})
		};
		fetch("http://192.168.123.136:12000/apiCustomer/accessRight/userLogin", reqOpt);
	};

	return (
		<div style={{useStyleForm}}>
			<form 
				onSubmit={handleSumbit}
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
				<input type="submit" value="Submit" />  
		</form>
	</div>	
	);
}

export {
	LoginForm
}