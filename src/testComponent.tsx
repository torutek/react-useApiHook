import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useApi, useApiFetch, useApiMutate } from './configureUseApi';

export function ApiExampleComponent() {
	const [count, setCount] = useState(0);
	const [apiFetchObjResponse, setApiFetchObjResponse] = useState('');
	const [apiFetchObjLoading, setApiFetchObjLoading] = useState(false);

	const api = useApiFetch();
	const res = useApi(x => x.accessoryV1List("test"), "useApi result loaded");
	const mutateWithResponse = useApiMutate(x => x.testV1UpdateWithResponse, "Updated acc " + count);
	const mutateNoResponse = useApiMutate(x => x.testV1UpdateNoResponse, "Updated acc " + count);

	const sb = useSnackbar();

	return (
		<div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr' }}>
			<table width={900} style={{ gridColumn: 2 }}>
				<thead>
					<tr>
						<th>Description</th>
						<th>Action</th>
						<th>Loading</th>
						<th style={{ width: '450px' }}>Result</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>useApi Hook</td>
						<td>
							<button onClick={() => {
								res.refresh();
							}}>Refresh</button>
						</td>
						<td>
							{res.isLoading && <div>Loading</div>}
						</td>
						<td>
							{res.result && <div>{res.result[0].accName}</div>}
							{res.error && <div>Error</div>}
						</td>
					</tr>
					<tr>
						<td>Api fetch obj</td>
						<td>
							<button onClick={async () => {
								setApiFetchObjLoading(true);
								const res = await api.fetch(x => x.accessoryV1List("tt"));
								if (res.result) {
									setApiFetchObjResponse(res.result[0].accName);
									console.log("ApiFetch res " + res.result[0].accName);
								} else {
									setApiFetchObjResponse('Error');
									console.log("Error");
								}
								setApiFetchObjLoading(false);
							}}>Fetch</button>
						</td>
						<td>
							<div>{apiFetchObjLoading && 'Loading'}</div>
						</td>
						<td>
							<div>{apiFetchObjResponse}</div>
						</td>
					</tr>

					<tr>
						<td>useMutate hook no response</td>
						<td>
							<button onClick={async () => {
								await mutateNoResponse.execute("n_" + count, count)
								setCount(c => {
									return c + 1;
								});
							}}>Mutate</button>
						</td>
						<td>
							{mutateNoResponse.isLoading && <div>Loading</div>}
						</td>
						<td>
							{mutateNoResponse.error && <div>Error: {mutateNoResponse.error}</div>}
							{mutateNoResponse.isSuccess && <div>Success</div>}
						</td>
					</tr>

					<tr>
						<td>useMutate hook with response</td>
						<td>
							<button onClick={async () => {
								var res = await mutateWithResponse.execute("n_" + count, count)
								if (res)
									sb.enqueueSnackbar("Mutate applied, res: "+res.accName);
								else {
									sb.enqueueSnackbar("Mutate failed");
								}
								setCount(c => {
									return c + 1;
								});
							}}>Mutate</button>
						</td>
						<td>
							{mutateWithResponse.isLoading && <div>Loading</div>}
						</td>
						<td>
							{mutateWithResponse.error && <div>Error: {mutateWithResponse.error}</div>}
							{mutateWithResponse.isSuccess && <div>{mutateWithResponse.result!.accName}</div>}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
