import { getExplorerUrl } from "@/lib/utils";
import Link from "next/link";

export const siteConfig = {
	title: "CreatorPage",
	description: "A smart contract mediated portfolio platform connecting creators with supporters",
	isLocal: process.env.NEXT_PUBLIC_ENV === "development",
	masterAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
	admin: {
		information:
			"The admin page contains information for managing creator and sponsor interactions.",
	},
	valueSentences: [
		"Smart contract backed portfolio pages for content creators and their fans",
		"Automatically generate and manage video scripts using Theta LLMs",
		"No vendor agreements required",
	],
	about: [
		{
			title: "What is CreatorPage?",
			description:
				"CreatorPage connects content creators with supporters using Theta blockchain technology, providing a secure and transparent platform for collaborations. It allows creators to showcase their projects and collect donations facilitated entirely by smart contracts.",
		},
		{
			title: "How does it work?",
			description:
				"Creators can create a portfolio page with project ideas and past videos. Supporters can browse projects and connect with creators to fund project ideas. Any requests with donations can be connected to a Theta LLM to auto-generate scripts.",
		},
		{
			title: `Where is the CreatorPage contract deployed?`,
			description: (
				<span>
					The CreatorPage contract is deployed at address:&nbsp;
					{process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}
				</span>
			),
		},
		{
			title: "Disclaimer",
			description:
				"CreatorPage is currently a proof of concept prototype and is provided as-is without any guarantees. Use at your own discretion.",
		},
	],
	githubUrl: "https://github.com/cbonoz/theta24",
	steps: [
		{
			title: "Create",
			description: "Creators post their past projects to create a shareable portfolio page.",
		},
		{
			title: "Connect",
			description:
				"Sponsors browse projects and connect with creators whose ideas they want to support. Smart contracts manage the agreements, ensuring secure and transparent transactions.",
		},
		{
			title: "Collaborate",
			description:
				"Creators and supporters collaborate to bring the project to life. Creators can auto-generate scripts for sent requests using Theta LLM.",
		},
	],
};
