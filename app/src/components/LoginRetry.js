import React, { Fragment } from 'react';
import ButtonAppBar from './ButtonAppBar';
import LoginForm from './LoginForm';
import { LOGIN_MODE } from '../utils/loginHelper.js';

function LoginRetry() {
	return (
		<LoginForm mode={LOGIN_MODE.LOGIN_RETRY} onSuccessLogin={goToLoginSuccess} onFailureLogin={gotoFailureRetry} />
	);
}

export default LoginRetry;
