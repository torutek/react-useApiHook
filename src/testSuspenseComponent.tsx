import React from "react";
import { useApi } from "./configureUseApi";
import { TestResult } from "./fakeClient";

interface TSCProps {
	data: TestResult[];
}

export function TestSuspenseComponent(props: TSCProps) {
	const suspenseRes = useApi(x => x.accessoryV1List("test"), "Loaded2", true);
	return (<div>TestSuspenseComponent Done: {suspenseRes.result && suspenseRes.result[0].accName}</div>);
}
