import { useContext } from "react";


export interface TestResult {
	accName: string;
}

export interface TestMutateResult {
	accName: string;
}

var tempValue = 1;

export class TestClient {
	accessoryV1List(branchIdFilter?: string | undefined): Promise<TestResult[]> {
		const promise = new Promise<TestResult[]>((resolve, reject) => {

			setTimeout(() => {
				// Fake delay
				console.log("Api query " + tempValue);

				if (tempValue % 4 === 0) {
					reject("Api client error");
				} else {

					resolve([{
						accName: "Api result, accessory: " + tempValue
					}])
				}

				tempValue = tempValue + 1;
			}, 500);
		});

		return promise;
	}

	accessoryV1Update(newName: string, newNum: number): Promise<TestMutateResult> {
		const promise = new Promise<TestMutateResult>((resolve, reject) => {

			setTimeout(() => {
				// Fake delay
				console.log("Api query " + tempValue);

				if (tempValue % 4 === 0) {
					reject("Api client error");
				} else {

					resolve({
						accName: "Api result, accessory, newName: "+newName + ' newNum: '+newNum
					})
				}

				tempValue = tempValue + 1;
			}, 500);
		});

		return promise;
	}
}
