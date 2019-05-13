import { AUTH_TOKEN } from '../constants';
import _ from 'lodash';

export function saveToken(token) {
	localStorage.setItem(AUTH_TOKEN, token);
}
export function getSavedToken() {
	return localStorage.removeItem(AUTH_TOKEN);
}

export function removeSavedToken() {
	return localStorage.getItem(AUTH_TOKEN);
}

export function validateEmail(email) {
	const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const isInvalidEmail = emailRegex.test(email);
	return {
		isError: !isInvalidEmail,
		errorMsg: isInvalidEmail ? '' : 'Invalid email address'
	};
}

export function validatePassword(password) {
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	const isValidPassword = passwordRegex.test(password);

	return {
		isError: !isValidPassword,
		errorMsg: isValidPassword
			? ''
			: 'The password must contain minimum eight characters, at least one letter and one number.'
	};
}

export function newStateOnInput(event) {
	let newState = {};
	newState[event.target.name] = {
		value: event.target.value
	};
	newState[event.target.name].isDirty = true;
	return newState;
}

/*
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
				isRequired: true
			}
		};
*/
export function validateForm(currentState, meta) {
	console.log('validate form current state', currentState);
	console.log('validate meta', meta);

	let errorMsg = [];
	let isError = false;
	let missingRequired = false;
	_.forEach(currentState, (currentStateProp, key) => {
		let currentMetaProp = meta[key];
		if (_.isPlainObject(currentStateProp)) {
			if (_.isNil(currentStateProp.value) || currentStateProp.value === '') {
				if (currentMetaProp && currentMetaProp.isRequired) {
					missingRequired = true;
					isError = true;
				}
			} else {
				//currentStateProp contain a value
				if (currentMetaProp && currentMetaProp.validate) {
					let error = currentMetaProp.validate(currentStateProp.value);
					if (error.isError) {
						isError = true;
						errorMsg.push(error.errorMsg);
					}
				}
			}
		}
	});
	return {
		isError: isError || missingRequired,
		errorMsg: errorMsg.join('')
	};
}

export function isDirty(currentState) {
	return _.some(currentState, (currentStateProp) => {
		if (_.isPlainObject(currentStateProp)) {
			return currentStateProp.isDirty;
		}
	});
}

export const LOGIN_MODE = {
	SIGNUP: 'signup', // user sign up,
	LOGIN: 'login', // user login in from upper left
	LOGIN_RETRY: 'login retry' //user failed login and is trying again
};
