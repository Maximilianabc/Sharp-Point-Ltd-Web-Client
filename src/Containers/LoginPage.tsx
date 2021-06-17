import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
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
	setAccountNumAction,
	Response,
	UserInfo,
	store,
	UserState
} from '../Util';
import {
	useDispatch,
	useSelector
} from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { FormControlProps } from '@material-ui/core';

interface LoginPageProps extends FormControlProps {

}

interface TwoFAFormProps extends FormControlProps {

}

interface AccNameFormProps extends FormControlProps {
	
}

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

const LoginForm = (props: LoginPageProps) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const location = useLocation<string>();

	const [data, setData] = useState<UserInfo>({
		password: '',
		userId: '',
	});
	const [show, setShow] = useState(true);
	const [inputErrorText, setInputErrorText] = useState('');
	const [loginErrorText, setLoginErrorText] = useState('');

	useEffect(() => {
		if (location) {
			setLoginErrorText(location.state);
		}
	}, []);

	const handleClick = (event: React.MouseEvent) => {
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

	const handleResponse = (resdata: Response) => {
		if (resdata.result_msg !== undefined) {
			if (resdata.result_code === '0') {
				if (resdata.data !== undefined) {
					dispatch(loginAction(data));
					const info = resdata.data;
					if (info.sessionToken !== undefined) {
						dispatch(setTokenAction(info.sessionToken));
						if (info.isAdmin) {
							isAE = true;
							setShow(false);
						} else {
							dispatch(setAccountNumAction(data.userId));
							display2FAForm = false;
							isAE = false;
							history.push('/dashboard');
						}											
					} else if (info.twofaMethod !== undefined && info.twofaMethod === 3) {
						// need 2FA
						display2FAForm = true;
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
							<FormControl id="login-form">
								<NoBulletsList>
									<DefaultLI>
										<DefaultInputField
											error={inputErrorText !== ''}
											id="user-name"
											label="User Name"
											variant="filled"
											onChange={(event: React.ChangeEvent) => setData({ password: data.password, userId: (event?.target as HTMLInputElement)?.value })}
											helperText={inputErrorText}
										/>
									</DefaultLI>
									<DefaultLI>
										<DefaultInputField
											id="password"
											label="Password"
											type="password"
											variant="filled"
											onChange={(event: React.ChangeEvent) => setData({ password: (event?.target as HTMLInputElement)?.value, userId: data.userId })}
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
					: <AccNumForm/>
			: <TwoFAForm/>
	);
}

const TwoFAForm = (props: TwoFAFormProps) => {
	const [twoFACode, setTwoFACode] = useState('');
	const [inputErrorText, setInputErrorText] = useState('');
	const [loginErrorText, setLoginErrorText] = useState('');
	const [show, setShow] = useState(true);
	
	const userId = useSelector((state: UserState) => state.userId);
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => console.log(userId), []);

	const handleClick = (event: React.MouseEvent) => {
		event.preventDefault();
		setLoginErrorText('');

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

	const handleResponse = (resdata: Response) => {
		if (resdata.result_code === '0') {
			const info = resdata.data;
			dispatch(setTokenAction(info.sessionToken));
			if (info.isAdmin) {
				isAE = true;
				setShow(false);
			} else {
				setShow(false);
				display2FAForm = false;
				isAE = false;
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
					<FormControl id="2fa-form">
						<NoBulletsList>
							<DefaultLI>
								<DefaultInputField
									error={inputErrorText !== ''}
									id="2fa-code"
									label="Code"
									variant="filled"
									onChange={(event: React.ChangeEvent) => setTwoFACode((event?.target as HTMLInputElement)?.value)}
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
			: <AccNumForm/>
	);
};

const AccNumForm = (props: AccNameFormProps) => {
	const [show, setShow] = useState(true);
	const [accNum, setAccNum] = useState('');
	const dispatch = useDispatch();
	const history = useHistory();

	const handleClick = (event: React.MouseEvent) => {
		dispatch(setAccountNumAction(accNum));
		setShow(false);
		display2FAForm = false;
		isAE = false;
		history.push('/dashboard');
	};

	return (
		<Zoom in={show} style={{ transitionDelay: '100ms' }} unmountOnExit>
			<FormControl id="accnum-form">
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
