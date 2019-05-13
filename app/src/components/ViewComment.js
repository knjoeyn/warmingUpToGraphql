import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import { Query } from 'react-apollo';
import TextField from '@material-ui/core/TextField';
import { newStateOnInput } from '../utils/loginHelper.js';

const COMMENT_QUERY = gql`
	query CommentQuery($id: ID!) {
		comment(id: $id) {
			id
			message
			createdAt
			isPublic
			author {
				email
				name
			}
			children {
				message
			}
		}
	}
`;

const COMMENT_UPDATE = gql`
	mutation EditCommentMutation($id: ID!, $message: String, $isPublic: Boolean) {
		editComment(id: $id, message: $message, isPublic: $isPublic) {
			id
			message
			createdAt
			isPublic
			author {
				email
				name
			}
			children {
				message
			}
		}
	}
`;

const COMMENT_CREATE = gql`
	mutation EditCommentMutation($message: String!, $isPublic: Boolean!, $parentCommentId: ID) {
		createComment(message: $message, isPublic: $isPublic, parentCommentId: $parentCommentId) {
			id
			message
			createdAt
			isPublic
			author {
				email
				name
			}
			children {
				message
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
	}
});

class ViewComment extends Component {
	state = {
		theComment: null,
		isPublic: {
			value: false,
			isDirty: true
		},
		message: {
			value: '',
			isDirty: true
		}
	};

	_onUpdateComment = (event, mutation) => {
		event.preventDefault();
		this.setState({
			serverDataata: {
				isLoading: true
			}
		});
		mutation();
	};

	_onUpdateCommentError = (data) => {
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

	_onUpdateCommentSuccess = async (data) => {
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

	onInputChange = (event, theComment) => {
		let newState = newStateOnInput(event);
		if (theComment === null) {
			newState.theComment = theComment;
		}
		theComment[event.target.name] = event.target.value;
		newState.theComment = theComment;
		console.log('Comment state', newState);
		this.setState(newState);
	};

	onInputChangeNew = (event, theComment) => {
		let newState = newStateOnInput(event);
		this.setState(newState);
	};

	render() {
		let { theComment } = this.state;
		const { classes } = this.props;
		const toCreateReply = this.props.location.state;

		console.log('View Comment Prop', this.props);
		const commentId = this.props.match.params.id;

		const rowDisplayHeaders = [ 'Message', 'Is Public', 'Author Name', 'Author Email' ];
		const patchableFields = [ 'Message', 'Is Public' ];
		const displayHeaderToField = {
			Message: 'message',
			'Is Public': 'isPublic',
			'Author Name': 'author.name',
			'Author Email': 'author.email'
		};

		const newCommentTemplate = (
			<form name="newCommentForm">
				{rowDisplayHeaders.map((headerName) => (
					<TextField
						key={_.get(displayHeaderToField, headerName)}
						onChange={(e) => this.onInputChangeNew(e)}
						fullWidth
						disabled={!patchableFields.includes(headerName)}
						name={_.get(displayHeaderToField, headerName)}
						label={headerName}
						value={_.get(theComment, _.get(displayHeaderToField, headerName))}
					/>
				))}
				<Mutation
					mutation={COMMENT_CREATE}
					variables={{
						isPublic: this.state.isPublic.value === 'true',
						message: this.state.message.value,
						parentCommentId: commentId
					}}
					onError={(data) => this._onUpdateCommentError(data)}
					onCompleted={(data) => this._onUpdateCommentSuccess(data)}
				>
					{(mutation) => {
						return (
							<Button
								type="submit"
								onClick={(e) => this._onUpdateComment(e, mutation)}
								fullWidth
								variant="contained"
								color="primary"
							>
								{toCreateReply ? 'Create Reply' : 'Create Comment'}
							</Button>
						);
					}}
				</Mutation>
			</form>
		);

		return (
			<main className={classes.main}>
				<Paper className={classes.paper}>
					{!commentId || toCreateReply ? (
						newCommentTemplate
					) : (
						<form name="viewCommentForm">
							{theComment !== null ? (
								rowDisplayHeaders.map((headerName) => (
									<TextField
										key={_.get(displayHeaderToField, headerName)}
										onChange={(e) => this.onInputChange(e, theComment)}
										fullWidth
										disabled={!patchableFields.includes(headerName)}
										name={_.get(displayHeaderToField, headerName)}
										label={headerName}
										value={_.get(theComment, _.get(displayHeaderToField, headerName))}
									/>
								))
							) : (
								<Query query={COMMENT_QUERY} variables={{ id: commentId }}>
									{({ loading, error, data }) => {
										console.log('COMMENT DATA', data);
										if (data && data.comment) {
											theComment = data.comment;
											theComment.isPublic = theComment.isPublic.toString();
										}
										if (theComment) {
											return (
												<Fragment>
													{rowDisplayHeaders.map((headerName) => {
														console.log(
															'COMMENT FIELD KEY',
															_.get(displayHeaderToField, headerName)
														);

														console.log(
															'COMMENT FIELD VALUE',
															_.get(theComment, _.get(displayHeaderToField, headerName))
														);

														return (
															<TextField
																key={_.get(displayHeaderToField, headerName)}
																onChange={(e) => this.onInputChange(e, theComment)}
																fullWidth
																disabled={!patchableFields.includes(headerName)}
																name={_.get(displayHeaderToField[headerName])}
																label={headerName}
																value={_.get(
																	theComment,
																	_.get(displayHeaderToField, headerName)
																)}
															/>
														);
													})}
												</Fragment>
											);
										} else {
											return null;
										}
									}}
								</Query>
							)}
							<Mutation
								mutation={COMMENT_UPDATE}
								variables={{
									isPublic: this.state.isPublic.value === 'true',
									message: this.state.message.value,
									id: (this.state.theComment || {}).id
								}}
								onError={(data) => this._onUpdateCommentError(data)}
								onCompleted={(data) => this._onUpdateCommentSuccess(data)}
							>
								{(mutation) => {
									return (
										<Button
											type="submit"
											onClick={(e) => this._onUpdateComment(e, mutation)}
											fullWidth
											variant="contained"
											color="primary"
										>
											Update
										</Button>
									);
								}}
							</Mutation>
						</form>
					)}
				</Paper>
			</main>
		);
	}
}

ViewComment.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ViewComment);
