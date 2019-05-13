import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { LOGIN_MODE } from '../utils/loginHelper.js';
import LoginForm from './LoginForm';

const styles = (theme) => ({
	root: {
		flexGrow: 1
	},
	grow: {
		flexGrow: 1
	}
});

function ButtonAppBar(props) {
	const { classes, user } = props;
	let authenticatedToolBarContent = (
		<Fragment>
			<Typography variant="h6" color="inherit" className={classes.grow}>
				Welcome {user.name}
			</Typography>
			<Button color="inherit" onClick={props.onCreateComment}>
				Create Comment
			</Button>
			<Button color="inherit" onClick={props.onLogout}>
				Log Out
			</Button>
		</Fragment>
	);
	let nonAuthenitcatedToolBarConent = (
		<Fragment>
			<Typography variant="h6" color="inherit" className={classes.grow}>
				<Button color="inherit">View Comments</Button>
			</Typography>
			<LoginForm
				mode={LOGIN_MODE.LOGIN}
				onSuccessLogin={props.onSuccessLogin}
				onFailureLogin={props.onFailureLogin}
			/>
		</Fragment>
	);
	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>{user.authenticated ? authenticatedToolBarContent : nonAuthenitcatedToolBarConent}</Toolbar>
			</AppBar>
		</div>
	);
}

ButtonAppBar.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);
