import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { InputBase, TextField } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
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
	return (
		<TextField
			InputProps={{ classes, disableUnderline: true }} {...props}
		/>
	)
}

export {
	useStyle,
	DefaultInputField
}
