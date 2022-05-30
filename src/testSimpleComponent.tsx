
var renders = 0;

export function TestSimpleComp() {
	renders++;
	console.log("TestSimpleComp");

	return (
		<>
			<div>Simple comp, {renders}</div>
			
		</>
	);
}
