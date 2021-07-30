import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { InputLabelProps, TextField, withStyles } from '@material-ui/core';
import { BaseTextFieldProps } from '@material-ui/core';
import { LABEL_CLASSES, WHITE40, WHITE60, WHITE80 } from '../Util';

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
		color: `${WHITE80} !important`,
		margin: '0 0.5rem 0.25rem 0.5rem'
	},
	underline: {
		'&::before': {
			borderBottom: `1px solid ${WHITE40} !important`,
		},
		'&::after': {
			borderBottom: `1px solid ${WHITE80}`
		},
		'&:hover': {
			borderBottom: `1px solid ${WHITE60}`,
		},
		'&:focus': {
			borderBottom: `1px solid ${WHITE80}`
		}
	},
	input: {
		'&::before': {
			color: WHITE40
		},
		'&::after': {
			color: WHITE80
		}
	}
}));

const WhiteTextField = withStyles({
  root: {
    '& .MuiInputBase-input': {
      color: WHITE80,
    },
    '& .MuiInput-underline:before': {
      borderBottom: `1px solid ${WHITE40}`,
    },
    '& .MuiInput-underline:hover:before': {
      borderBottom: `1px solid ${WHITE60}`,
    },
    '& .MuiInput-underline:after': {
      borderBottom: `1px solid ${WHITE80}`,
    },
		'& .MuiFormLabel-root': { 
			...LABEL_CLASSES,
			color: WHITE60,
			fontSize: '1rem'
		},
		'& .MuiFormLabel-root.Mui-focused': { 
			...LABEL_CLASSES,
			color: WHITE80,
			fontSize: '1rem'
		},
  },
})(TextField);

const FormInputField = (props: FormInputFieldProps) => {
	const { variant, label, type, labelProps } = props;
	const classes = useStyleForm();
	return (
		<WhiteTextField
			className={classes.root}
			variant="standard"
			label={label}
			type={type}
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
