import React from 'react';
import ButtonAppBar from './ButtonAppBar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import _ from 'lodash';
import { removeSavedToken } from '../utils/loginHelper.js';
import { Link } from 'react-router-dom';

const FEED_QUERY = gql`
	query feed {
		feed {
			id
			message
			createdAt
			isPublic
			author {
				email
				name
			}
			children {
				createdAt
				isPublic
				author {
					email
					name
				}
			}
		}
	}
`;

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

const styles = (theme) => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3,
		overflowX: 'auto'
	},
	table: {
		minWidth: 700
	}
});

function LoggedIn(props) {
	const user = {
		authenticated: true,
		name: props.match.params.name
	};
	let viewChildren = false;
	let parentId = '';
	if (props.location && props.location.state) {
		viewChildren = props.location.state.viewChildren;
		parentId = props.location.state.parentId;
	}

	function onLogout() {
		removeSavedToken();
		props.history.push(`/`);
	}

	function createComment() {
		props.history.push(`/comment`);
	}

	const { classes } = props;
	const rowDisplayHeaders = [ 'Message', 'Is Public', 'Author Name', 'Author Email', 'Replies' ];
	const displayHeaderToField = {
		Message: 'message',
		'Is Public': 'isPublic',
		'Author Name': 'author.name',
		'Author Email': 'author.email',
		Replies: 'children'
	};

	console.log('viewChildren', viewChildren);
	console.log('parentId', parentId);

	return (
		<Paper className={classes.root}>
			<ButtonAppBar onCreateComment={createComment} onLogout={onLogout} user={user} />
			<Query query={viewChildren ? COMMENT_QUERY : FEED_QUERY} variables={viewChildren ? { id: parentId } : {}}>
				{({ loading, error, data }) => {
					console.log('Feeds', data);
					let feeds = [];
					if (data) {
						if (viewChildren && data.comment) {
							feeds = data.comment.children || [];
						} else {
							if (data && data.feed) {
								feeds = data.feed;
							}
						}
					}

					feeds = feeds.map((feed) => {
						feed.isPublic = (feed.isPublic || false).toString();
						feed.children = (feed.children || []).length ? 'View' : 'Add';
						return feed;
					});

					return (
						<Table className={classes.table}>
							<TableHead>
								<TableRow>
									{rowDisplayHeaders.map((headerName) => (
										<TableCell key={displayHeaderToField[headerName]}>{headerName}</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{feeds.map((feed) => (
									<TableRow key={feed.id}>
										{rowDisplayHeaders.map((headerName, index) => {
											let cellTemplate = null;
											if (headerName === 'Replies') {
												if (_.get(feed, displayHeaderToField[headerName]) === 'Add') {
													cellTemplate = (
														<Link
															to={{
																pathname: '/comment/' + feed.id,
																state: {
																	toCreateReply: true
																}
															}}
															className="ml1 no-underline black"
														>
															{_.get(feed, displayHeaderToField[headerName])}
														</Link>
													);
												} else {
													cellTemplate = (
														<Link
															to={{
																pathname: '/user/' + user.name,
																state: {
																	viewChildren: true,
																	parentId: feed.id
																}
															}}
															className="ml1 no-underline black"
														>
															{_.get(feed, displayHeaderToField[headerName])}
														</Link>
													);
												}
											} else if (index === 0) {
												cellTemplate = (
													<Link to={'/comment/' + feed.id} className="ml1 no-underline black">
														{_.get(feed, displayHeaderToField[headerName])}
													</Link>
												);
											} else {
												cellTemplate = (
													<TableCell key={displayHeaderToField[headerName]}>
														{_.get(feed, displayHeaderToField[headerName])}
													</TableCell>
												);
											}
											return cellTemplate;
										})}
									</TableRow>
								))}
							</TableBody>
						</Table>
					);
				}}
			</Query>
		</Paper>
	);
}

LoggedIn.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoggedIn);
