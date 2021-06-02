import React, { useState } from 'react';
import { DefaultInputField } from './InputField';
import { Button, FormControl, makeStyles, Zoom } from '@material-ui/core';
import styled from 'styled-components';

const serverIP = "http://192.168.123.136";
const port = "99";

const FormList = styled.ul`
	padding: 0;
	list-style-type: none;
`;

const FormItems = styled.li`
	margin: 0 0 2rem 0;
`;

let display2FAForm = false;
let isInit = true;

const LoginForm = (props) => {
	const [data, setData] = useState({
		password: "",
		userId: "",
	});
	const [token, setToken] = useState("");
	const [show, setShow] = useState(true);
	const [show2FA, setShow2FA] = useState(false);

	const handleLoginButtonClicked = () => {
		// TODO: input checking?

	};

	const handleClick = (event) => {
		event.preventDefault();
		const reqOpt = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		};
		fetch(`${serverIP}:${port}/apiCustomer/accessRight/userLogin`, reqOpt)
			.then(response => response.json())
			.then(data => handleResponse(data));
	};

	const handleResponse = (data) => {
		if (data.result_msg !== undefined) {
			if (data.result_msg === 'No Error') {
				if (data.data !== undefined) {
					const info = data.data;
					if (info.sessionToken !== undefined) {
						setToken(info.sessionToken);
						// redirect to main page							
					} else if (info.twofaMethod !== undefined && info.twofaMethod === 3) {
						// need 2FA
						display2FAForm = true;
						isInit = false;
						setShow(false);
						setShow2FA(true);
					}
				}
			} else {
				alert(data.result_msg);
			}
		}
	};

	return (
	isInit
		?	<Zoom in={show}>
				<FormControl autoComplete="off">
					<FormList>
						<FormItems>
							<DefaultInputField
								id="user-name"
								label="User Name"
								variant="filled"
								onChange={(event) => setData({ password: data.password, userId: event.target.value })}
							/>
						</FormItems>
						<FormItems>
							<DefaultInputField
								id="password"
								label="Password"
								type="password"
								variant="filled"
								onChange={(event) => setData({ password: event.target.value, userId: data.userId })}
							/>
						</FormItems>  
						<Button variant="contained" onClick={handleClick}>LOGIN</Button>          
					</FormList>    
				</FormControl>
			</Zoom>
		: display2FAForm
			? <TwoFAForm userId={data.userId}/>
			: null
	);
}

const TwoFAForm = ({ userId }) => {
	const [twoFACode, setTwoFACode] = useState("");

	const handleClick = (event) => {
		event.preventDefault();
		const payload = {
			code: twoFACode,
			mode: 3,
			userId: userId
		};
		const reqOpt = {
			method: 'POST',
			header: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		};
		fetch(`${serverIP}:${port}/apiCustomer/accessRight/userLogin2FA`, reqOpt)
			.then(response => response.json())
			.then(data => console.log(data));
	};

	return (
		<Zoom in={true} style={{ transitionDelay: '500ms' }}>
		<FormControl autoComplete="off">
			<FormList>
				<FormItems>
					<DefaultInputField
						id="2fa-code"
						label="Code"
						variant="filled"
						onChange={(event) => setTwoFACode(event.target.value)}
					/>
				</FormItems>
				<Button variant="contained" onClick={handleClick}>SUBMIT</Button>
			</FormList>
		</FormControl>
		</Zoom>
	);
};

export {
	LoginForm,
	TwoFAForm
}
