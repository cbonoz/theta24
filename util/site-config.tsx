import { getExplorerUrl } from "@/lib/utils";
import Link from "next/link";

export const siteConfig = {
	title: "CreatorPage",
	description: "A smart contract mediated marketplace connecting creators with sponsors",
	isLocal: process.env.NEXT_PUBLIC_ENV === "development",
	masterAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
	admin: {
		information:
			"The admin page contains information for managing creator and sponsor interactions.",
	},
	about: [
		{
			title: "What is CreatorPage?",
			description:
				"CreatorPage connects content creators with sponsors using Theta blockchain technology, providing a secure and transparent platform for collaborations. It allows creators to showcase their projects and collect donations facilitated entirely by smart contracts.",
		},
		{
			title: "How does it work?",
			description:
				"Creators can create a portfolio page with project ideas and required sponsorships. Sponsors can browse projects and connect with creators to fund project ideas. Any requests with donations can be connected to a Theta LLM to auto-generate scripts.",
		},
		{
			title: `Where is the CreatorPage contract deployed?`,
			description: (
				<span>
					The CreatorPage contract is deployed on the Theta testnet at address:&nbsp;
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
	steps: [
		{
			title: "Create",
			description:
				"Creators post their project ideas, specifying the type of content and required sponsorship. They can auto-generate scripts for incoming requests using Theta LLM.",
		},
		{
			title: "Connect",
			description:
				"Sponsors browse projects and connect with creators whose ideas they want to support. Smart contracts manage the agreements, ensuring secure and transparent transactions.",
		},
		{
			title: "Collaborate",
			description: "Creators and sponsors collaborate to bring the project to life.",
		},
	],
};
