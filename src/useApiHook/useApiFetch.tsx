import { ApiContextType } from "./apiContext";

interface FetchObjSuccess<T> {
	error: undefined;
	result: T;
}

interface FetchObjError {
	error: any;
	result: undefined;
}

export type FetchObj<T> = FetchObjSuccess<T> | FetchObjError;

export class FetchClient<C> {
	private _apiContext: ApiContextType<C>;
	public constructor(apiContext: ApiContextType<C>) {
		this._apiContext = apiContext;
	}

	fetch<T>(clientMethod: (client: C) => Promise<T> | undefined, successMessage: string = ''): Promise<FetchObj<T>> {
		const promise = new Promise<FetchObj<T>>(async (resolve, reject) => {
			try {
				var result = await clientMethod(this._apiContext.apiClient) as T;
				resolve({
					error: undefined,
					result: result
				})

				if (successMessage) {
					this._apiContext.onSuccess(successMessage);
				}
			} catch (error) {
				resolve({
					error: error,
					result: undefined
				})

				this._apiContext.onError(error);
			}
		});

		return promise;
	}
}


