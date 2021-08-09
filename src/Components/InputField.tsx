import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	FormControlLabel,
	InputLabelProps,
	TextField,
	withStyles
} from '@material-ui/core';
import { BaseTextFieldProps } from '@material-ui/core';
import { LABEL_CLASSES, WHITE40, WHITE5, WHITE60, WHITE80 } from '../Util';

interface DefaultInputFieldProps extends BaseTextFieldProps {
	variant?: any,
	onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

interface FormInputFieldProps {
	variant: 'standard' | 'outlined' | 'filled',
	label: string,
	type?: string,
	labelProps?: InputLabelProps,
	onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

interface FormNumericUpDownProps {
	label: string,
	disable?: boolean,
	onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
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
		color: `${WHITE80}`,
		margin: '0 0.5rem 0.25rem 0.5rem'
	}
}));

const WhiteTextField = withStyles({
  root: {
    '& .MuiInputBase-input': {
      color: WHITE80,
    },
		'& .MuiInput-underline.Mui-disabled': {
      borderBottom: `1px solid ${WHITE40}`,
    },
    '& .MuiInput-underline:not(.Mui-disabled):before': {
      borderBottom: `1px solid ${WHITE60}`,
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: `1px solid ${WHITE80}`,
    },
    '& .MuiInput-underline:not(.Mui-disabled):after': {
      borderBottom: `1px solid white`,
    },
		'& .MuiFormLabel-root': { 
			...LABEL_CLASSES,
			color: WHITE80,
			fontSize: '1rem'
		},
		'& .MuiFormLabel-root.Mui-focused': { 
			...LABEL_CLASSES,
			color: 'white',
			fontSize: '1rem'
		},
		'& .MuiFormLabel-root.Mui-disabled': {
			...LABEL_CLASSES,
			color: WHITE40,
			fontSize: '1rem'
		}
  },
})(TextField);

const FormInputField = (props: FormInputFieldProps) => {
	const { variant, label, type, labelProps, onChange} = props;
	const classes = useStyleForm();
	return (
		<WhiteTextField
			className={classes.root}
			variant="standard"
			label={label}
			type={type}
			onChange={onChange}
		/>
	)
};

const FormNumericUpDown = (props: FormNumericUpDownProps) => {
	const classes = useStyleForm();
	const { label, disable, onChange } = props;
	return (
		<WhiteTextField
			className={classes.root}
			label={label} type="number"
			disabled={disable}
			onChange={onChange}
		/>
	);
};

const CheckBoxField = withStyles({
	root: {
		'& .MuiFormControlLabel-label': {
			...LABEL_CLASSES,
			color: WHITE80,
			fontSize: '1rem'
		},
		'& .MuiFormControlLabel-label.Mui-disabled': {
			...LABEL_CLASSES,
			color: WHITE40,
			fontSize: '1rem'
		}
	}
})(FormControlLabel);

export {
	DefaultInputField,
	FormInputField,
	FormNumericUpDown,
	CheckBoxField
}
