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
import { formatDate, getExplorerUrl, getReadableError, isEmpty } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { generateVideoRequestScript } from "@/lib/generate-script";
import { processMetadata, processMetadataObject } from "@/lib/contract/interact";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form";
import Link from "next/link";

interface Params {
	requestId: string;
}

export default function CreatorPage({ params }: { params: Params }) {
	const [sendLoading, setSendLoading] = useState(false);
	const [donation, setDonation] = useState(0);
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
		isPending: loading,
		error: readError,
	} = useReadContract({
		abi: CREATOR_CONTRACT.abi,
		address: siteConfig.masterAddress as Address,
		functionName: "getMetadataUnchecked",
		args: [handle],
	});

	const data: ContractMetadata | undefined =
		handle !== "demo"
			? processMetadataObject(readData as ContractMetadata)
			: (DEMO_METADATA as ContractMetadata);

	const chainId = useChainId();
	const currentChain: Chain | undefined = (chains || []).find((c) => c.id === chainId);

	const signer = useEthersSigner({ chainId });
	const isOwner = data?.creatorAddress === address;

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
			window?.location?.reload();
			alert("Thanks for making a request! The creator can now see your message.");
		} catch (error) {
			console.log("error making request", error);
			setError(getReadableError(error));
		} finally {
			setSendLoading(false);
		}
	}

	if (loading) {
		return <div className="flex flex-col items-center justify-center mt-8">Loading...</div>;
	}

	if (!address) {
		return (
			<div className="flex flex-col items-center justify-center mt-8">
				Please connect your wallet to view creator pages.
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
	const currency = currentChain?.nativeCurrency?.symbol || "ETH";

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

						{/* Creator address */}
						<div className="mt-4">
							<div className="text-sm text-gray-500">Creator address</div>
							<div>Donations will go to this address. Only donate to trusted creators.</div>
							<Link
								target="_blank"
								className="text-sm hover:underline text-blue-500"
								href={getExplorerUrl(data.creatorAddress)}
							>
								{data.creatorAddress}
							</Link>
						</div>

						{/* https://ui.shadcn.com/docs/components/carousel */}
						<Carousel
							opts={{
								align: "start",
								loop: true,
							}}
						>
							<CarouselContent>
								{(data?.initialVideoUrls || []).map((url: string, index: number) => (
									<CarouselItem key={index}>
										<video src={url} controls></video>
									</CarouselItem>
								))}
							</CarouselContent>
						</Carousel>

						<div className="mt-4">
							<h3 className="text-2xl font-bold">Video Requests</h3>
							{isEmpty(data.requests) && <div>No requests yet</div>}
							<div>
								{data.requests.map((request, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm mt-2"
									>
										<div className="flex flex-col">
											<div className="font-bold text-lg">
												{request.message} - {request.donation} {currency}
											</div>
											<Link
												target="_blank"
												className="text-sm hover:underline text-blue-500"
												href={getExplorerUrl(request.requester, currentChain)}
											>
												Donated by: {request.requester}
											</Link>
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

						<hr className="my-4" />
						<Separator />

						{!isOwner && (
							<div>
								<div className="text-2xl font-bold">Make a video request</div>

								<Textarea
									className="w-full mt-2"
									placeholder="Enter your message"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
								/>

								{/* Donation */}
								<Input
									type="number"
									placeholder="Donation in ETH"
									value={donation}
									onChange={(e) => setDonation(Number(e.target.value))}
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

				{/* {isOwner && (
					<div>
						<div>Creator actions</div>
						<div>Upload video (Coming soon)</div>
					</div>
				)} */}

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
