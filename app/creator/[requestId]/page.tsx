'use client'

import { config } from '@/app/config'
import BasicCard from '@/components/basic-card'
import RenderObject from '@/components/render-object'
import { Button } from '@/components/ui/button'
import { CREATOR_CONTRACT } from '@/lib/contract/metadata'
import { useEthersSigner } from '@/lib/get-signer'
import { ContractMetadata } from '@/lib/types'
import { siteConfig } from '@/util/site-config'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

import { ReloadIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Address, Chain, createPublicClient, http } from 'viem'
import { writeContract } from '@wagmi/core'

import {
    useAccount,
    useChainId,
    useChains,
    useSwitchChain,
    useWriteContract,
} from 'wagmi'
import { DEMO_METADATA } from '@/lib/constants'
import { formatDate, isEmpty } from '@/lib/utils'

interface Params {
    requestId: string
}

export default function CreatorPage({ params }: { params: Params }) {
    const [loading, setLoading] = useState(true)
    const [sendLoading, setSendLoading] = useState(false)
    const [data, setData] = useState<ContractMetadata | undefined>()
    const [result, setResult] = useState<any>(null)
    const [message, setMessage] = useState('')
    const [error, setError] = useState<any>(null)
    const ref = useRef(null)
    const { chains, switchChain } = useSwitchChain()
    const { address } = useAccount()

    const router = useRouter()

    const { requestId: handle } = params

    const chainId = useChainId()
    const currentChain: Chain | undefined = (chains || []).find(
        (c) => c.id === chainId
    )

    const signer = useEthersSigner({ chainId })
    const isOwner = data?.creatorAddress === address

    async function fetchData() {
        setLoading(true)
        try {
            const publicClient = createPublicClient({
                chain: currentChain,
                transport: http(),
            })
            let contractData: ContractMetadata = (
                (await publicClient.readContract({
                    abi: CREATOR_CONTRACT.abi,
                    address: siteConfig.masterAddress as Address,
                    functionName: 'getMetadataForHandle',
                    args: [handle],
                })) as ContractMetadata
            )
            // convert video and validatedAt to number from bigint
            console.log('contractData', contractData)
            setData(contractData)

            // if (contractData.attestationId && SCHEMA_ID) {
            //     const res = await getAttestation(contractData.attestationId)
            //     console.log('getAttestation', res)
            // }
        } catch (error) {
            console.error('error reading contract', error)
            // setError(error)
            setData(DEMO_METADATA)
        } finally {
            setLoading(false)
        }
    }

    async function makeVideoRequest() {
        try {
            const res = await writeContract(config, {
                abi: CREATOR_CONTRACT.abi,
                address: siteConfig.masterAddress as Address,
                functionName: 'makeRequest',
                args: [handle, message],
            })

            console.log('makeVideoRequest', res, handle, message)
            await fetchData()
            alert(
                'Thanks for making a request! The creator can now see your message.'
            )
        } catch (error) {
            console.log('error signing request', error)
            setError(error)
        }
        setSendLoading(false)
    }

    useEffect(() => {
        if (address) {
            fetchData()
        } else {
            setLoading(false)
        }
    }, [address])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center mt-8">
                Loading...
            </div>
        )
    }

    if (!address) {
        return (
            <div className="flex flex-col items-center justify-center mt-8">
                Please connect your wallet to view contracts
            </div>
        )
    }

    const invalid = !loading && !data

    const getTitle = () => {
        if (data?.creatorName) {
            return data?.creatorName || 'Creator page'
        } else if (error) {
            return 'Error accessing Creator page'
        }
        return 'Creator page'
    }

    const hasData = !!data?.creatorName

    return (
        // center align
        <div className="flex flex-col items-center justify-center mt-8">
            <BasicCard
                title={getTitle()}
                // description="Find and find a creator page using your wallet."
                className="max-w-[1000px] p-4"
            >
                {invalid && (
                    <div className="font-bold">
                        <p>
                            This contract may not exist or may be on another
                            network, double check your currently connected
                            network
                        </p>
                    </div>
                )}


                {hasData && (<div>

                    {data?.creatorName && (
                        <div>
                            <h2 className="text-2xl font-bold">{data.creatorName}</h2>
                            <p>{data?.creatorDescription}</p>
                            </div>)}

                            {/* https://ui.shadcn.com/docs/components/carousel */}
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        >
                        <CarouselContent>
                            <CarouselItem>...</CarouselItem>
                            <CarouselItem>...</CarouselItem>
                            <CarouselItem>...</CarouselItem>
                        </CarouselContent>
                    </Carousel>

                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Requests</h3>
                        {isEmpty(data.requests) && (
                            <div>No requests yet</div>
                        )}
                        <div>
                            {data.requests.map((request, index) => (
                                <div key={index} className="mt-2">
                                    <div className="font-bold">{request.message} - {request.donation} ETH</div>
                                    <div>{request.requester}</div>
                                    {/* time */}
                                    <div>{formatDate(request.createdAt)}</div>
                                </div>
                            ))}
                        </div>
                    </div>


                {!isOwner && (
                    <div>
                        <div>Make video request</div>


                        <textarea
                            className="w-full h-24 mt-2"
                            placeholder="Enter your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />

                        <Button
                            className="mt-4"
                            onClick={() => {
                                setSendLoading(true)
                                makeVideoRequest()
                            }}
                            disabled={sendLoading}
                        >
                            {sendLoading && (
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Send request
                        </Button>


                    </div>)}

                    </div>)}


                {isOwner && (
                    <div>
                        <div>Creator actions</div>
                        <div>Upload video (Coming soon)</div>
                        </div>)}

                {result && (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Result</h3>
                        <p>{result}</p>
                    </div>
                )}

                {error && (
                    <div className="mt-2 text-red-500">{error.message}</div>
                )}
            </BasicCard>
        </div>
    )
}
