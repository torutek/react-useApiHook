import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { ApiClientContext, UseApiStatus } from './apiContext';

interface ApiData<T> {
	loading: boolean;
	error: string | undefined,
	result: T | undefined,
}

interface UseApiResultWithSuccess<T> {
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	status: UseApiStatus;
	result: T;
	error: undefined;
	refresh: () => void;
}

interface UseApiResultLoading {
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	status: UseApiStatus;
	result: undefined;
	error: undefined;
	refresh: () => void;
}

interface UseApiResultWithError {
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	status: UseApiStatus;
	result: undefined;
	error: string;
	refresh: () => void;
}

export type UseApiResult<T> = UseApiResultLoading | UseApiResultWithSuccess<T> | UseApiResultWithError;

export function useApiBase<C, T>(clientMethod: (client: C) => Promise<T> | undefined, successMessage: string = '', useSuspense: boolean = false): UseApiResult<T> {
	const cancelRequest = useRef<boolean>(false); // true if parent component unmounted
	const apiClient = useContext(ApiClientContext);

	const [dataObj, setData] = React.useState<ApiData<T>>({
		loading: true,
		error: undefined,
		result: undefined
	});

	const load = useCallback(async () => {
		setData(currentDataObj => {
			return {
				...currentDataObj,
				loading: true,
			}
		});

		try {
			cancelRequest.current = false
			let dataRes = await clientMethod(apiClient.apiClient as C);

			if (cancelRequest.current) {
				return;
			}

			setData({
				loading: false,
				error: undefined,
				result: dataRes,
			});

			if (successMessage) {
				apiClient.onSuccess(successMessage);
			}
		} catch (error: any) {
			console.error(error);
			if (cancelRequest.current) {
				return;
			}

			setData({
				loading: false,
				error: 'fetch failed',
				result: undefined
			});

			apiClient.onError(error);
		}
	}, [apiClient, clientMethod, successMessage]);

	useEffect(() => {
		if (apiClient.strictModeSkipDebugMountRequest) {
			// https://github.com/reactwg/react-18/discussions/19
			// https://github.com/reactwg/react-18/discussions/18#discussioncomment-795661
			//	console.log("useApi mount: " + window.performance.now() + "ms");
			const firstRunLoad = setTimeout(() => load(), 10);
			return () => {
				//		console.log("useApi unmount: " + window.performance.now() + "ms");
				clearTimeout(firstRunLoad);
				cancelRequest.current = true
			}
		} else {
			load();
		}
		return () => {
			cancelRequest.current = true
		}
	}, []);

	if (dataObj.error) {
		return {
			isLoading: dataObj.loading, // Refreshing, can have old error while loading
			isError: true,
			isSuccess: false,
			status: 'error',
			result: undefined,
			error: dataObj.error,
			refresh: load
		};
	} else if (dataObj.result) {
		return {
			isLoading: dataObj.loading, // Refreshing, can have old data while loading
			isError: false,
			isSuccess: true,
			status: 'success',
			result: dataObj.result,
			error: undefined,
			refresh: load
		};
	} else {
		return {
			isLoading: true,
			isError: false,
			isSuccess: false,
			status: 'loading',
			result: undefined,
			error: undefined,
			refresh: load
		} as UseApiResultLoading
	}
};
