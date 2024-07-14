import { ContractMetadata, CreatorPageData } from "./types";

export const DEMO_REQUEST: CreatorPageData = {
	handle: "cb-videos",
	name: "CB productions",
	description: "This is a creator page",
};

export const DEMO_METADATA: ContractMetadata = {
	handle: "cb-videos",
	creatorName: "CB productions",
	creatorDescription: "This is a creator page",
	initialVideoUrls: [
		"https://www.youtube.com/watch?v=TcMBFSGVi1c",
		"https://www.youtube.com/watch?v=6ZfuNTqbHE8",
	],
	creatorAddress: "0xf4982D4aC99d25d89Cc8993a88Dc643832B1515b",
	requests: [
		{
			handle: "cb-videos",
			donation: "100",
			message: "I want a video on dogs",
			requester: "0xaab58c7fD4246C8F5cA950f25De5Cd6Df5F56624",
		},
	],
	active: true,
	createdAt: "2022-01-01",
	isValue: true,
};
