"use client";

import { config } from "@/app/config";
import BasicCard from "@/components/basic-card";
import RenderObject from "@/components/render-object";
import { Button } from "@/components/ui/button";
import { CREATOR_CONTRACT } from "@/lib/contract/metadata";
import { useEthersSigner } from "@/lib/get-signer";
import { ContractMetadata, VideoRequest } from "@/lib/types";
import { siteConfig } from "@/util/site-config";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Address, Chain, createPublicClient, http } from "viem";
import { writeContract } from "@wagmi/core";

import {
	useAccount,
	useChainId,
	useChains,
	useReadContract,
	useSwitchChain,
	useWriteContract,
} from "wagmi";
import { DEMO_METADATA } from "@/lib/constants";
import { formatDate, getReadableError, isEmpty } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { generateVideoRequestScript } from "@/lib/generate-script";

interface Params {
	requestId: string;
}

export default function CreatorPage({ params }: { params: Params }) {
	const [loading, setLoading] = useState(false);
	const [sendLoading, setSendLoading] = useState(false);
	const [scriptLoading, setScriptLoading] = useState(false);
	const [generatedScript, setGeneratedScript] = useState<any>({});
	// const [data, setData] = useState<ContractMetadata | undefined>();
	const [result, setResult] = useState<any>(null);
	const [message, setMessage] = useState("");
	const [error, setError] = useState<any>(null);
	const ref = useRef(null);
	const { chains, switchChain } = useSwitchChain();
	const { address } = useAccount();

	const router = useRouter();
	const setData = (d: any) => {};

	const { requestId: handle } = params;

	const {
		data: readData,
		isPending,
		error: readError,
	} = useReadContract({
		abi: CREATOR_CONTRACT.abi,
		address: siteConfig.masterAddress as Address,
		functionName: "getMetadataUnchecked",
		args: [handle],
	});

	const data: ContractMetadata = (readData as ContractMetadata)?.isValue
		? (readData as ContractMetadata)
		: (DEMO_METADATA as ContractMetadata);

	const chainId = useChainId();
	const currentChain: Chain | undefined = (chains || []).find((c) => c.id === chainId);

	const signer = useEthersSigner({ chainId });
	const isOwner = data?.creatorAddress === address;

	async function fetchData() {
		setLoading(true);
		try {
			const publicClient = createPublicClient({
				chain: currentChain,
				transport: http(),
			});
			let contractData: ContractMetadata = (await publicClient.readContract({
				abi: CREATOR_CONTRACT.abi,
				address: siteConfig.masterAddress as Address,
				functionName: "getMetadataForHandle",
				args: [handle],
			})) as ContractMetadata;
			// convert video and validatedAt to number from bigint
			console.log("contractData", contractData);
			setData(contractData);

			// if (contractData.attestationId && SCHEMA_ID) {
			//     const res = await getAttestation(contractData.attestationId)
			//     console.log('getAttestation', res)
			// }
		} catch (error) {
			console.error("error reading contract", error);
			// setError(error)
			setData(DEMO_METADATA);
		} finally {
			setLoading(false);
		}
	}

	async function getGeneratedScript(request: VideoRequest) {
		setScriptLoading(true);
		try {
			const prompt = request.message;
			const res = await generateVideoRequestScript(prompt);
			console.log("generateScript", res, handle, prompt);
			setGeneratedScript({ script: res, request });
		} catch (error) {
			console.log("error generating script", error);
			setError(getReadableError(error));
		} finally {
			setScriptLoading(false);
		}
	}

	async function makeVideoRequest() {
		try {
			const res = await writeContract(config, {
				abi: CREATOR_CONTRACT.abi,
				address: siteConfig.masterAddress as Address,
				functionName: "makeRequest",
				args: [handle, message],
			});

			console.log("makeVideoRequest", res, handle, message);
			await fetchData();
			alert("Thanks for making a request! The creator can now see your message.");
		} catch (error) {
			console.log("error making request", error);
			setError(getReadableError(error));
		} finally {
			setSendLoading(false);
		}
	}

	useEffect(() => {
		if (address) {
			// fetchData();
		} else {
			setLoading(false);
		}
	}, [address]);

	if (loading) {
		return <div className="flex flex-col items-center justify-center mt-8">Loading...</div>;
	}

	if (!address) {
		return (
			<div className="flex flex-col items-center justify-center mt-8">
				Please connect your wallet to view contracts
			</div>
		);
	}

	const invalid = !loading && !data;

	const getTitle = () => {
		if (data?.creatorName) {
			return data?.creatorName || "Creator page";
		} else if (error || invalid) {
			return "Error accessing page";
		}
		return "Creator page";
	};

	const hasData = !!data?.creatorName;

	return (
		// center align
		<div className="flex flex-col items-center justify-center mt-8">
			<BasicCard
				title={getTitle()}
				// description="Find and find a creator page using your wallet."
				className="max-w-[1000px] p-4"
			>
				{invalid && (
					<div className="font-bold text-red-500">
						<p>
							This page may not exist or may be on another network, double check your currently
							connected network.
						</p>
					</div>
				)}

				{hasData && (
					<div className="w-full mx-8">
						{data?.creatorName && (
							<div>
								<h2 className="text-2xl font-bold">{data.creatorName}</h2>
								<p>{data?.creatorDescription}</p>
							</div>
						)}

						{/* https://ui.shadcn.com/docs/components/carousel */}
						<Carousel
							opts={{
								align: "start",
								loop: true,
							}}
						>
							<CarouselContent>
								{data?.initialVideoUrls.map((url, index) => (
									<CarouselItem key={index}>
										<video src={url} controls></video>
									</CarouselItem>
								))}
							</CarouselContent>
						</Carousel>

						<div className="mt-4">
							<h3 className="text-lg font-bold">Requests</h3>
							{isEmpty(data.requests) && <div>No requests yet</div>}
							<div>
								{data.requests.map((request, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm mt-2"
									>
										<div className="flex flex-col">
											<div className="font-bold text-lg">
												{request.message} - {request.donation} ETH
											</div>
											<div className="text-sm text-gray-600">{request.requester}</div>
											{/* time */}
											<div className="text-xs text-gray-500">{formatDate(request.createdAt)}</div>
										</div>
										<div className="flex items-center space-x-4">
											<Button
												className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
												onClick={() => getGeneratedScript(request)}
											>
												Generate Script
											</Button>
											{/* <a href="#" className="text-blue-500 text-sm hover:underline">
												View transaction
											</a> */}
										</div>
									</div>
								))}
							</div>
						</div>

						{!isOwner && (
							<div>
								<div>Make video request</div>

								<textarea
									className="w-full mt-2"
									placeholder="Enter your message"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
								/>

								<Button
									className="mt-4"
									onClick={() => {
										setSendLoading(true);
										makeVideoRequest();
									}}
									disabled={sendLoading}
								>
									{sendLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
									Send request
								</Button>
							</div>
						)}
					</div>
				)}

				{isOwner && (
					<div>
						<div>Creator actions</div>
						<div>Upload video (Coming soon)</div>
					</div>
				)}

				{result && (
					<div className="mt-4">
						<h3 className="text-lg font-bold">Result</h3>
						<p>{result}</p>
					</div>
				)}

				{error && <div className="mt-2 text-red-500">{error}</div>}
			</BasicCard>
			<Dialog
				open={!!generatedScript?.request}
				onOpenChange={(open) => {
					if (!open) {
						setGeneratedScript({});
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Generated script for {generatedScript?.request?.message}</DialogTitle>
						<DialogDescription>{generatedScript?.script}</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
}
