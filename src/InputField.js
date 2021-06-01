import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { InputBase, TextField } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  }
}));

const useStyleDefault = makeStyles((theme) => ({
	root: {
		border: "2px solid white",
		borderRadius: 3,
		backgroundColor: '#ffffff',
		'&:hover': {
			backgroundColor: '#00ffff',
		},
		'&$focused': {
			backgroundColor: '#00ffff',
			borderColor: '#00ffff',
		},
	},
	focused: {},
}));

const DefaultInputField = (props) => {
	const classes = useStyleDefault();
	const [state, setState] = useState({ text: "" });
	const setText = (event) => {
		setState({text: event.target.value});
	};

	return (
		<TextField
			onChange={setText}
			value={state.text}
			InputProps={{ classes, disableUnderline: true }} {...props}
		/>
	)
}

export {
	useStyle,
	DefaultInputField
}
