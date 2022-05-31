import React, { useState } from 'react';
import logo from './logo.svg';
import { SnackbarProvider, useSnackbar, ProviderContext as SnackBarProviderContext } from 'notistack';
import { ApiExampleComponent } from './testComponent';

import './App.css';
import { AppTestClient } from './configureUseApi';
import { TestClient } from './fakeClient';
import { ApiClientContext, ApiContextType } from 'react-use-api-hook';

export let SnackbarRef: SnackBarProviderContext;
const SnackbarUtilsConfigurator: React.FunctionComponent = () => {
	SnackbarRef = useSnackbar();
	return null;
};

var isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

var apiContextValue = {
	strictModeSkipDebugMountRequest: isDev, // Optional
	apiClient: AppTestClient,
	onSuccess: (message) => {
		SnackbarRef.enqueueSnackbar(message, { variant: 'success' })
	},
	onError: (error) => {
		SnackbarRef.enqueueSnackbar('Request failed: ' + (error), { variant: 'error' })
	}
} as ApiContextType<TestClient>


function App() {
	return (
		<SnackbarProvider>
			<SnackbarUtilsConfigurator />
			<ApiClientContext.Provider value={apiContextValue}>
				<div className="App">
					<header className="App-header">
						<img src={logo} className="App-logo" alt="logo" />
					</header>
					<br/>
					<ApiExampleComponent />
					<br/>
					<button onClick={() => {
						SnackbarRef.enqueueSnackbar("test app", { variant: 'success' })
					}}>Show snack bar</button>
			
				</div>
			</ApiClientContext.Provider>
		</SnackbarProvider>
	);
}

export default App;
