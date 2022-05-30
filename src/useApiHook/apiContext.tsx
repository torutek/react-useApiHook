import React from "react";

export type UseApiStatus = 'loading' | 'error' | 'success';

export interface ApiContextType<ApiClientType> {
	strictModeSkipDebugMountRequest: boolean;
	apiClient: ApiClientType,
	onSuccess: (message: string) => void;
	onError: (error: any) => void;
}

export const ApiClientContext = React.createContext({
	strictModeSkipDebugMountRequest: false,
	apiClient: {},
	onSuccess: (_: string) => { },
	onError: (_: any) => { }
});