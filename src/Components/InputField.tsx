import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

interface DefaultInputFieldProps {

}

const useStyleDefault = makeStyles((theme) => ({
	root: {
		border: "1px solid white",
		borderRadius: 3,
		backgroundColor: '#282c34',
		'&:hover': {
			color: '#0000ff',
			backgroundColor: '#00ffff',
		},
		'&$focused': {
			backgroundColor: '#00ffff',
		},	
	},
	focused: {},
	inputHiddenLabel: {
		color: '#ffffff',
		'&:hover': {
			color: '#000000'
		}
	},
	input: {
		color: '#ffffff',
		'&:hover': {
			color: '#0000ff',
		},
		'&:focus': {
			color: '#0000ff',
		}
	},
	error: {
		border: "1px solid red",
	}
}));

const DefaultInputField = (props: DefaultInputFieldProps) => {
	const classes = useStyleDefault();

	return (
		<TextField
			autoComplete="off"
			InputProps={{ classes, disableUnderline: true }} {...props}
			InputLabelProps={{ className: classes.inputHiddenLabel }}
		/>
	)
}

export {
	DefaultInputField
}
