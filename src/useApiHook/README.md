# Getting started with useApi hook

## Step 1

Create a api + hook provider using your specific api client, i.e.

```
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

```

## Note:
set strictModeSkipDebugMountRequest to true during dev time to stop React 18 from calling your api 2x per component creation
when using ```useApiBase```

AppTestClient is an instance of your Api client

OnSuccess and OnError are callbacks allowing you to hook into a Global notifier, in this case we are using Notistack

OnError will pass exceptions thrown by your api client

## Step 2, wrap your app with the ApiClientContext provider

```
<ApiClientContext.Provider value={apiContextValue}>
	<App/>
</ApiClientContext.Provider>
```

## Step 3

Extend the provided base hooks and fetch obj by supplying your api clients type, this removes the need to have your ApiClient type passed as a generic type each time you use a hook


```
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
```

## Step 4, use the hooks

Now you can use the hooks in your components

```
const api = useApiFetch();
const res = useApi(x => x.accessoryV1List("test"), "Loaded");
const mutateAccessory = useApiMutate(x => x.accessoryV1Update, "Updated accessory");
```

- useApiFetch use this to perform your own operations, loading + try + catch
- useApi use this to load data on component mount, the success message is optional, you can also call res.refresh() to reload data.
- mutateAccessory use this to perform api updates. i.e. await mutateAccessory.execute("new name", 123) will pass those two new values to the accessoryV1Update method (parameter intellisense supported)

