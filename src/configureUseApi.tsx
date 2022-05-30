import { useContext } from "react";
import { TestClient } from "./fakeClient";
import { ApiClientContext, ApiContextType, FetchClient, MutateResult, useApiBase, useApiMutateBase, UseApiResult } from "./useApiHook";

export const AppTestClient = new TestClient();

export function useApi<T>(clientMethod: (client: TestClient) => Promise<T> | undefined, successMessage: string = '', useSuspense: boolean = false): UseApiResult<T> {
	return useApiBase<TestClient, T>(clientMethod, successMessage, useSuspense);
}

export function useApiMutate<InputFunc extends (...args: any[]) => any>(
		clientMethod: (client: TestClient) => (InputFunc), // Method that returns the Client method to run. InputFunc is the method signature if the client method to run.
		successMessage: string = 'Updated')
	: MutateResult<InputFunc> {
		return useApiMutateBase(clientMethod, successMessage);
}

export function useApiFetch(): FetchClient<TestClient> {
	const apiContext = useContext(ApiClientContext);
	return new FetchClient(apiContext as ApiContextType<TestClient>);
};