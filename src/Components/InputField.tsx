import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { InputLabelProps, TextField } from '@material-ui/core';
import { BaseTextFieldProps } from '@material-ui/core';

interface DefaultInputFieldProps extends BaseTextFieldProps {
	variant?: any,
	onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

interface FormInputFieldProps {
	variant: 'standard' | 'outlined' | 'filled',
	label: string,
	type?: string,
	labelProps?: InputLabelProps
}

interface FormNumericUpDownProps {
	label: string
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

const useStyleForm = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(1)
	}
}));

const FormInputField = (props: FormInputFieldProps) => {
	const { variant, label, type, labelProps } = props;
	const classes = useStyleForm();
	return (
		<TextField
			className={classes.root}
			label={label}
			variant={variant}
			type={type}
			InputLabelProps={labelProps}
		/>
	)
};

const FormNumericUpDown = (props: FormNumericUpDownProps) => {
	const classes = useStyleForm();
	const { label } = props;
	return (
		<TextField className={classes.root} label={label} type="number"/>
	);
};

export {
	DefaultInputField,
	FormInputField,
	FormNumericUpDown
}
