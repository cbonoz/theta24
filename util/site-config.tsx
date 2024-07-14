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
				"Creators can post their project ideas and sponsors can browse through these projects to find ones they want to support. Smart contracts manage the agreements and video transfers, ensuring all parties meet their obligations. When a request is received, the creator immediately receives the donation, and an event is emitted from the smart contract detailing the request.",
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
