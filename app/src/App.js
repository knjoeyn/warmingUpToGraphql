import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';
import DataProvider from './providers/DataProvider';
import ThemeProvider from './providers/ThemeProvider';
import Home from './components/Home';
import LoggedIn from './components/LoggedIn';

import { Switch, Route, BrowserRouter } from 'react-router-dom';
import ViewComment from './components/ViewComment';

const App = () => (
	<CssBaseline>
		<ThemeProvider>
			<SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
				<DataProvider>
					<BrowserRouter>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route path="/user/:name" component={LoggedIn} />
							<Route path="/comment/:id" component={ViewComment} />
							<Route path="/comment" component={ViewComment} />
						</Switch>
					</BrowserRouter>
				</DataProvider>
			</SnackbarProvider>
		</ThemeProvider>
	</CssBaseline>
);

export default App;
