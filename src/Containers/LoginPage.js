import styled from 'styled-components';
import React, { useState } from 'react';
import { DefaultInputField } from '../Components/InputField';
import {
	Button,
	FormControl,
	FormHelperText,
	Slide,
	withStyles,
	Zoom
} from '@material-ui/core';
import {
	postRequest,
	loginAction,
	setTokenAction,
	setAccountNumAction
} from '../Util';
import {
	useDispatch,
	useSelector
} from 'react-redux';
import { useHistory } from 'react-router-dom';

const NoBulletsList = styled.ul`
	padding: 0;
	list-style-type: none;
`;

const DefaultLI = styled.li`
	margin: 0 0 2rem 0;
	self-align: center
`;

const StyledFormHelperText = withStyles({
	root: {
		textAlign: 'inherit'
	}
})(FormHelperText);

let display2FAForm = false;
let isAE = false;

const LoginForm = (props) => {
	const history = useHistory();
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

		const userId = data.userId.toUpperCase();
		if (/^[A-Z0-9]{1,16}$/.test(userId)) {		
			postRequest('/accessRight/userLogin', data)
				.then(result => handleResponse(result));
		} else {
			setInputErrorText('Invalid user name');
		}
	};

	const handleResponse = (resdata) => {
		if (resdata.result_msg !== undefined) {
			if (resdata.result_code === '0') {
				if (resdata.data !== undefined) {
					const info = resdata.data;
					console.log(info);
					if (info.sessionToken !== undefined) {
						dispatch(setTokenAction(info.sessionToken));
						if (info.isAdmin) {
							isAE = true;
							setShow(false);
						} else {
							dispatch(setAccountNumAction(data.userId));
							history.push('/dashboard');
						}											
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
			? 
				!isAE
					?
						<Slide in={show} direction="left" unmountOnExit>
							<FormControl autoComplete="off" id="login-form">
								<NoBulletsList>
									<DefaultLI>
										<DefaultInputField
											error={inputErrorText !== ''}
											id="user-name"
											label="User Name"
											variant="filled"
											onChange={(event) => setData({ password: data.password, userId: event.target.value })}
											helperText={inputErrorText}
										/>
									</DefaultLI>
									<DefaultLI>
										<DefaultInputField
											id="password"
											label="Password"
											type="password"
											variant="filled"
											onChange={(event) => setData({ password: event.target.value, userId: data.userId })}
										/>
									</DefaultLI>  
									<DefaultLI>
										<Button
											id="login-button"
											variant="contained"
											onClick={handleClick}
										>LOGIN</Button>
									</DefaultLI>
									<DefaultLI>
										<StyledFormHelperText
											error={loginErrorText !== ''}
											id="error-text"
										>{loginErrorText}
										</StyledFormHelperText>
									</DefaultLI>					
								</NoBulletsList> 
							</FormControl>
						</Slide>
					: <AccNumForm unmountOnExit/>
			: <TwoFAForm unmountOnExit/>
	);
}

const TwoFAForm = () => {
	const [twoFACode, setTwoFACode] = useState('');
	const [inputErrorText, setInputErrorText] = useState('');
	const [loginErrorText, setLoginErrorText] = useState('');
	const [show, setShow] = useState(true);
	
	const userId = useSelector(state => state.userId);
	const dispatch = useDispatch();
	const history = useHistory();

	const handleClick = (event) => {
		event.preventDefault();
		setLoginErrorText('');

		if (/^[0-9]{6}$/.test(twoFACode)) {
			const payload = {
				code: twoFACode,
				mode: 3,
				userId: userId
			};
			console.log(payload.userId);
			postRequest('/accessRight/userLogin2FA', payload)
				.then(result => handleResponse(result));
		} else {
			setInputErrorText('Invalid 2FA code');
		}
	};

	const handleResponse = (resdata) => {
		if (resdata.result_code === '0') {
			const info = resdata.data;
			dispatch(setTokenAction(info.sessionToken));
			if (info.isAdmin) {
				isAE = true;
				setShow(false);
			} else {
				history.push('/dashboard');
			}
		} else {
			setLoginErrorText(resdata.result_msg);
		}
	};

	return (
		!isAE
			?
				<Zoom in={show} style={{ transitionDelay: '100ms' }} unmountOnExit>
					<FormControl autoComplete="off" id="2fa-form">
						<NoBulletsList>
							<DefaultLI>
								<DefaultInputField
									error={inputErrorText !== ''}
									id="2fa-code"
									label="Code"
									variant="filled"
									onChange={(event) => setTwoFACode(event.target.value)}
									helperText={inputErrorText}
								/>
							</DefaultLI>
							<DefaultLI>
								<Button
									id="submit-button"
									variant="contained"
									onClick={handleClick}
								>SUBMIT</Button>
							</DefaultLI>			
							<DefaultLI>
								<StyledFormHelperText
									error={loginErrorText !== ''}
									id="error-text"
								>{loginErrorText}
								</StyledFormHelperText>
							</DefaultLI>
						</NoBulletsList>
					</FormControl>
				</Zoom>
			: <AccNumForm unmountOnExit/>
	);
};

const AccNumForm = (props) => {
	const [show, setShow] = useState(true);
	const [accNum, setAccNum] = useState('');
	const dispatch = useDispatch();
	const history = useHistory();

	const handleClick = (event) => {
		dispatch(setAccountNumAction(accNum));
		setShow(false);
		history.push('/dashboard');
	};

	return (
		<Zoom in={show} style={{ transitionDelay: '100ms' }} unmountOnExit>
			<FormControl autoComplete="off" id="accnum-form">
				<NoBulletsList>
					<DefaultLI>
						<DefaultInputField
							id="acc-num"
							label="Account Number"
							variant="filled"
							onChange={(event) => setAccNum(event.target.value)}
						/>
					</DefaultLI>
					<DefaultLI>
						<Button
							id="submit-button"
							variant="contained"
							onClick={handleClick}
						>OK</Button>
					</DefaultLI>
				</NoBulletsList>
			</FormControl>
		</Zoom>
	);
};

export {
	LoginForm,
	TwoFAForm
}
