import React, { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import { newStateOnInput } from '../utils/loginHelper.js';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit
	}
});

class LoginForm extends Component {
	state = {
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
	};

	onInputChange = (event, onUpdate) => {
		let newState = newStateOnInput(event, this.meta);
		this.setState(newState, () => onUpdate(this.state));
	};

	render() {
		console.log('User info props', this.props);
		const { id, classes, requireName, fullWidth, onUpdate } = this.props;
		if (!fullWidth) {
			classes.width = 200;
		}
		return (
			<Fragment>
				{requireName ? (
					<TextField
						fullWidth
						className={classes.textField}
						required
						id={id ? id + 'email' : ''}
						name="name"
						label="Name"
						onChange={(e) => this.onInputChange(e, onUpdate)}
					/>
				) : null}
				<TextField
					fullWidth={fullWidth}
					className={classes.textField}
					required
					id={id ? id + 'email' : ''}
					name="email"
					label="Email Address"
					onChange={(e) => this.onInputChange(e, onUpdate)}
				/>
				<TextField
					fullWidth={fullWidth}
					className={classes.textField}
					required
					id={id ? id + 'email' : ''}
					name="password"
					label="Password"
					onChange={(e) => this.onInputChange(e, onUpdate)}
				/>
			</Fragment>
		);
	}
}

export default withStyles(styles)(LoginForm);
