import styled from 'styled-components';
import React, { useState } from 'react';
import { DefaultInputField } from './InputField';
import {
	Button,
	FormControl,
	FormHelperText,
	withStyles,
	Zoom
} from '@material-ui/core';
import {
	postRequest,
	loginAction,
	setTokenAction
} from '../Util';
import {
	useDispatch,
	useSelector
} from 'react-redux';

const FormList = styled.ul`
	padding: 0;
	list-style-type: none;
`;

const FormItems = styled.li`
	margin: 0 0 2rem 0;
	self-align: center
`;

const StyledFormHelperText = withStyles({
	root: {
		textAlign: 'inherit'
	}
})(FormHelperText);

let display2FAForm = false;

const LoginForm = (props) => {
	const [data, setData] = useState({
		password: '',
		userId: '',
	});
	const [show, setShow] = useState(true);
	const [inputErrorText, setInputErrorText] = useState('');
	const [loginErrorText, setLoginErrorText] = useState('');

	const dispatch = useDispatch();

	const handleClick = (event) => {
		event.preventDefault();
		setInputErrorText('');
		if (/^[a-zA-Z0-9]{1,16}$/.test(data.userId)) {
			postRequest('/accessRight/userLogin', data)
				.then(result => handleResponse(result));
		} else {
			setInputErrorText('Invalid user name');
		}
	};

	const handleResponse = (resdata) => {
		if (resdata.result_msg !== undefined) {
			if (resdata.result_msg === 'No Error') {
				if (resdata.data !== undefined) {
					const info = resdata.data;
					if (info.sessionToken !== undefined) {
						dispatch(setTokenAction(info.sessionToken));
						// redirect to main page							
					} else if (info.twofaMethod !== undefined && info.twofaMethod === 3) {
						// need 2FA
						display2FAForm = true;
						dispatch(loginAction(data));
						setShow(false);
					}
				}
			} else {
				setLoginErrorText(resdata.result_msg);
			}
		}
	};

	return (
		!display2FAForm 
			? <Zoom in={show}>
					<FormControl autoComplete="off">
						<FormList>
							<FormItems>
								<DefaultInputField
									error={inputErrorText !== ''}
									id="user-name"
									label="User Name"
									variant="filled"
									onChange={(event) => setData({ password: data.password, userId: event.target.value })}
									helperText={inputErrorText}
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
							<FormItems>
								<Button variant="contained" onClick={handleClick}>LOGIN</Button>
							</FormItems>
							<FormItems>
								<StyledFormHelperText
									error={loginErrorText !== ''}
									id="error-text"
								>{loginErrorText}
								</StyledFormHelperText>
							</FormItems>					
						</FormList> 
					</FormControl>
				</Zoom>
			: <TwoFAForm/>
	);
}

const TwoFAForm = () => {
	const [twoFACode, setTwoFACode] = useState('');
	const [inputErrorText, setInputErrorText] = useState('');
	const [loginErrorText, setLoginErrorText] = useState('');
	
	const userId = useSelector(state => state.userId);
	console.log(userId);
	const dispatch = useDispatch();

	const handleClick = (event) => {
		event.preventDefault();
		if (/^[0-9]{6}$/.test(twoFACode)) {
			const payload = {
				code: twoFACode,
				mode: 3,
				userId: userId
			};
			postRequest('/accessRight/userLogin2FA', payload)
				.then(result => handleResponse(result));
		} else {
			setInputErrorText('Invalid 2FA code');
		}
	};

	const handleResponse = (resdata) => {
		if (resdata.result_msg === 'SUCCESS') {
			dispatch(setTokenAction(resdata.data.sessionToken));
			// redirect to main page
		} else {
			setLoginErrorText(resdata.result_msg);
		}
	};

	return (
		<Zoom in={true} style={{ transitionDelay: '250ms' }}>
			<FormControl autoComplete="off">
				<FormList>
					<FormItems>
						<DefaultInputField
							error={inputErrorText !== ''}
							id="2fa-code"
							label="Code"
							variant="filled"
							onChange={(event) => setTwoFACode(event.target.value)}
							helperText={inputErrorText}
						/>
					</FormItems>
					<FormItems>
						<Button variant="contained" onClick={handleClick}>SUBMIT</Button>
					</FormItems>			
					<FormItems>
						<StyledFormHelperText
							error={loginErrorText !== ''}
							id="error-text"
						>{loginErrorText}
						</StyledFormHelperText>
					</FormItems>
				</FormList>
			</FormControl>
		</Zoom>
	);
};

export {
	LoginForm,
	TwoFAForm
}
