import { validateForm, isDirty } from './loginHelper';

it('validateForm creates error because required is missing', () => {
	const meta = {
		email: {
			isRequired: true
		},
		password: {
			isRequired: true
		}
	};

	const state = {
		email: {
			value: 'test@gmail.com',
			isDirty: false
		},
		password: {
			value: '',
			isDirty: false
		}
	};

	const validateResult = validateForm(state, meta);
	expect(validateResult.isError).toEqual(true);
	expect(validateResult.errorMsg.length === 0).toEqual(true);
});

it('validateForm creates error because email validation failed', () => {
	const validateEmail = (email) => {
		return {
			isError: true,
			errorMsg: 'bad email'
		};
	};

	const meta = {
		email: {
			validate: validateEmail,
			isRequired: true
		},
		password: {
			isRequired: true
		}
	};

	const state = {
		email: {
			value: 'test@gmail',
			isDirty: false
		},
		password: {
			value: 'password',
			isDirty: false
		}
	};

	const validateResult = validateForm(state, meta);
	expect(validateResult.isError).toEqual(true);
	expect(validateResult.errorMsg).toEqual('bad email');
});

it('isDirty should return if one dirty is set true', () => {
	const state = {
		email: {
			value: '',
			isDirty: false
		},
		name: {
			isDirty: true,
			value: 'D'
		}
	};
	const isDirtyResult = isDirty(state);
	expect(isDirtyResult).toEqual(true);
});
