import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { LOGIN_MODE, isDirty, validateEmail, validatePassword, validateForm } from '../utils/loginHelper.js';
import UserInfo from './UserInfo';
import _ from 'lodash';

const SIGNUP_MUTATION = gql`
	mutation SignupMutation($email: String!, $password: String!, $name: String!) {
		signup(email: $email, password: $password, name: $name) {
			token
			user {
				name
			}
		}
	}
`;

const LOGIN_MUTATION = gql`
	mutation LoginMutation($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				name
			}
		}
	}
`;

const styles = (theme) => ({
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	},
	paper: {
		marginTop: theme.spacing.unit * 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit
	},
	loginForm: {
		marginLeft: -12,
		marginRight: 20
	},
	submitSignup: {
		marginTop: theme.spacing.unit * 3
	},
	submitLogin: {
		marginTop: theme.spacing.unit
	}
});

class LoginForm extends Component {
	state = {
		mode: LOGIN_MODE.SIGNUP,
		serverData: {
			isLoading: false
		},
		userData: {
			email: {
				value: '',
				isDirty: false
			},
			password: {
				value: '',
				isDirty: false
			},
			name: {
				value: '',
				isDirty: false
			}
		}
	};

	onUserDataChange = (newUserData) => {
		let clonedNewUserData = _.cloneDeep(newUserData);
		this.setState({
			userData: _.assign(this.state.userData, clonedNewUserData)
		});
	};

	_onLogin = (event, mutation) => {
		event.preventDefault();
		this.setState({
			dserverDataata: {
				isLoading: true,
				error: {}
			}
		});
		mutation();
	};

	_loginError = (data) => {
		this.setState({
			serverData: {
				isLoading: false,
				data: data
			}
		});

		if (this.props.onFailureLogin) {
			this.props.onFailureLogin(data);
		}
	};

	_loginSuccess = async (data) => {
		this.setState({
			serverData: {
				isLoading: false,
				data: data
			}
		});

		if (this.props.onSuccessLogin) {
			this.props.onSuccessLogin(data);
		}
	};

	render() {
		const { email, password, name } = this.state.userData;
		const { serverData } = this.state;
		console.log('LOG IN FORM STATE', this.state);
		console.log('LOG IN PROPS', this.props);

		const { classes, mode, id } = this.props;

		let formClass = classes.form;
		let submitClass = classes.submitSignup;
		let loginLabel = 'Sign Up';
		let formName = 'signupForm';
		let requireName = true;
		let fullWidth = true;
		if (mode === LOGIN_MODE.LOGIN) {
			formName = 'loginForm';
			requireName = false;
			fullWidth = false;
			loginLabel = 'Log In';
			formClass = classes.loginForm;
			submitClass = classes.submitLogin;
		}
		if (mode === LOGIN_MODE.LOGIN_RETRY) {
			formName = 'loginRetryForm';
			requireName = false;
			loginLabel = 'Log In';
			formClass = classes.loginForm;
		}
		let formId = id ? id + '_' + formName : formName;
		let userInfoId = formId + 'userInfo';
		let submitButtonId = formId + 'submitButton';

		const meta = {
			email: {
				validate: validateEmail,
				isRequired: true
			},
			password: {
				validate: validatePassword,
				isRequired: true
			},
			name: {
				isRequired: requireName
			}
		};
		const validateFormInfo = validateForm(this.state.userData, meta);
		const formIsDirty = isDirty(this.state.userData);
		console.log('validateFormInfo', validateFormInfo);

		const loginTemplate = (
			<form id={formId} name="formName" className={formClass}>
				<UserInfo
					id={userInfoId}
					requireName={requireName}
					fullWidth={fullWidth}
					onUpdate={this.onUserDataChange}
				/>
				<Mutation
					mutation={mode === LOGIN_MODE.SIGNUP ? SIGNUP_MUTATION : LOGIN_MUTATION}
					variables={{ email: email.value, password: password.value, name: name.value }}
					onError={(data) => this._loginError(data)}
					onCompleted={(data) => this._loginSuccess(data)}
				>
					{(mutation) => {
						return (
							<Button
								id={submitButtonId}
								type="submit"
								disabled={validateFormInfo.isError || serverData.isLoading || !formIsDirty}
								onClick={(e) => this._onLogin(e, mutation)}
								fullWidth={fullWidth}
								variant="contained"
								color="primary"
								className={submitClass}
							>
								{loginLabel}
							</Button>
						);
					}}
				</Mutation>
			</form>
		);

		const sigupOrLoginRetryTemplate = (
			<main className={classes.main}>
				<Paper className={classes.paper}>
					{validateFormInfo.errorMsg ? (
						<Avatar className={classes.avatar}>
							<ErrorIcon />
						</Avatar>
					) : null}
					<Typography component="h1" variant="h5">
						Sign Up
					</Typography>
					<Typography component="h1" variant="h6">
						{validateFormInfo.errorMsg}
					</Typography>
					{loginTemplate}
				</Paper>
			</main>
		);

		return mode === LOGIN_MODE.LOGIN ? loginTemplate : sigupOrLoginRetryTemplate;
	}
}

LoginForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginForm);
