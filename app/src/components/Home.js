import React, { Component, Fragment } from 'react';
import ButtonAppBar from './ButtonAppBar';
import LoginForm from './LoginForm';
import { LOGIN_MODE, saveToken } from '../utils/loginHelper.js';

class Home extends Component {
	goToLoginSuccess = (data) => {
		let loginData = data.signup || data.login;
		this.props.history.push('/user/' + loginData.user.name);
		const { token } = loginData;
		saveToken(token);
	};

	gotoFailureRetry = (data) => {
		let loginData = this.props.mode === LOGIN_MODE.SIGNUP ? data.signup : data.login;
		if (this.props.mode === LOGIN_MODE.LOGIN) {
			this.props.history.push('/loginRetry/errorMessage' + loginData.message);
		}
	};
	render() {
		//TODO: user should not need to login if their auth-token is still valid
		let user = {
			authenticated: false
		};
		return (
			<Fragment>
				<ButtonAppBar
					user={user}
					onSuccessLogin={this.goToLoginSuccess}
					onFailureLogin={this.gotoFailureRetry}
				/>
				{!user.authenticated ? (
					<LoginForm
						mode={LOGIN_MODE.SIGNUP}
						onSuccessLogin={this.goToLoginSuccess}
						onFailureLogin={this.gotoFailureRetry}
					/>
				) : null}
			</Fragment>
		);
	}
}

export default Home;
