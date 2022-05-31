import React, { useState } from 'react';
import { useApi, useApiFetch, useApiMutate } from './configureUseApi';

export function ApiExampleComponent() {
	const [count, setCount] = useState(0);
	const [apiFetchObjResponse, setApiFetchObjResponse] = useState('');
	const [apiFetchObjLoading, setApiFetchObjLoading] = useState(false);

	const api = useApiFetch();
	const res = useApi(x => x.accessoryV1List("test"), "useApi result loaded");
	const mutateAccessory = useApiMutate(x => x.accessoryV1Update, "Updated acc " + count);

	return (
		<div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr' }}>
			<table width={800} style={{ gridColumn: 2 }}>
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
						<td>useMutate hook</td>
						<td>
							<button onClick={async () => {
								await mutateAccessory.execute("n_" + count, count)
								setCount(c => {
									return c + 1;
								});
							}}>Mutate</button>
						</td>
						<td>
							{mutateAccessory.isLoading && <div>Loading</div>}
						</td>
						<td>
							{mutateAccessory.error && <div>Error: {mutateAccessory.error}</div>}
							{mutateAccessory.isSuccess && <div>{mutateAccessory.result!.accName}</div>}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
