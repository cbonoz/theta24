import { CREATOR_CONTRACT } from "./metadata";
import { ethToWei, formatDate } from "../utils";
import { ethers } from "ethers";
import { ContractMetadata, VideoRequest } from "../types";
import { siteConfig } from "@/util/site-config";

const processMetadata = (result: any[]): ContractMetadata => {
	return {
		handle: result[0],
		creatorName: result[1],
		creatorDescription: result[2],
		initialVideoUrls: result[3],
		creatorAddress: result[4],
		requests: result[5],
		active: result[6],
		createdAt: formatDate(result[7].toNumber() * 1000),
		isValue: result[8],
	};
};

export const getMetadataForHandle = async (
	signer: any,
	handle: string,
): Promise<ContractMetadata> => {
	const address = siteConfig.masterAddress;
	console.log("getMetadataForHandle", handle, address);
	const contract = new ethers.Contract(address, CREATOR_CONTRACT.abi, signer);
	// call  with args
	const result = await contract.getMetadataForHandle(handle);
	console.log("result", result);
	return processMetadata(result);
};

export const registerHandle = async (
	signer: any,
	handle: string,
	name: string,
	description: string,
	videoUrls: string,
): Promise<any> => {
	const contract = new ethers.Contract(siteConfig.masterAddress, CREATOR_CONTRACT.abi, signer);
	const tx = await contract.registerHandle(handle, name, description, videoUrls);

	// await
	const result = await tx.wait();
	console.log("result", result);
	return { result, tx };
};

export const requestVideo = async (
	signer: any,
	handle: string,
	message: string,
	donation: number,
): Promise<any> => {
	const contract = new ethers.Contract(siteConfig.masterAddress, CREATOR_CONTRACT.abi, signer);
	const body = { value: ethToWei(donation) };
	console.log("makeRequest", body);
	const tx = await contract.makeRequest(handle, message, body);

	// await
	const result = await tx.wait();
	console.log("result", result);

	return result;
};
