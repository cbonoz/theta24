import { CREATOR_CONTRACT } from "./metadata";
import { formatDate } from "../utils";
import { ethers } from "ethers";

export async function deployContract(signer: any, network: string) {
	// Deploy contract with ethers
	const factory = new ethers.ContractFactory(
		CREATOR_CONTRACT.abi,
		CREATOR_CONTRACT.bytecode,
		signer,
	);

	let contract: any = await factory.deploy(network);
	// log
	console.log("Deploying contract...", network);

	contract = await contract.waitForDeployment();
	console.log("deployed contract...", JSON.stringify(contract));
	return { address: contract.target };
}
