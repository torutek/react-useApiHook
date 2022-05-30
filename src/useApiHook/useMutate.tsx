import { useCallback, useContext, useState } from 'react';
import { ApiClientContext, UseApiStatus } from './apiContext';

export interface MutateResult<ClientFunc extends (...args: any[]) => any> {
	execute: (...args: any[]) => Promise<void>;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	status: UseApiStatus;
	result: Awaited<ReturnType<ClientFunc>> | undefined;
	error: any | undefined;
}

export function useApiMutateBase<Client, InputFunc extends (...args: any[]) => any>
	(
		clientMethodGetter: (client: Client) => (InputFunc), // Method that returns the Client method to run. InputFunc is the method signature of the client method to run.
		successMessage: string = 'Updated'
	): MutateResult<InputFunc> {
	const apiClientContext = useContext(ApiClientContext);
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<Awaited<ReturnType<InputFunc>>>();
	const [error, setError] = useState<any | undefined>();

	const exec = useCallback(async (...args: any[]) => {
		setLoading(true);
		try {
			var clientMethod = clientMethodGetter(apiClientContext.apiClient as Client) as InputFunc;
			var result = await clientMethod(...args);
			setResult(result);
			setError(undefined);
			apiClientContext.onSuccess(successMessage);
		} catch (ex) {
			setResult(undefined);
			setError(ex);
			apiClientContext.onError(ex);
		} finally {
			setLoading(false);
		}
	}, [apiClientContext, clientMethodGetter, successMessage]);

	let isSuccess = !!result && !error;

	return {
		isLoading: loading,
		isError: error !== undefined,
		isSuccess: isSuccess,
		status:  loading ? 'loading' : isSuccess ? 'success' : 'error',
		result: result,
		error: error,
		execute: exec
	};
}

