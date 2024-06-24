'use client'

import { config } from '@/app/config'
import BasicCard from '@/components/basic-card'
import RenderObject from '@/components/render-object'
import { Button } from '@/components/ui/button'
import { FUND_CONTRACT } from '@/lib/contract/metadata'
import { useEthersSigner } from '@/lib/get-signer'
import { ContractMetadata, SchemaEntry } from '@/lib/types'
import {
    abbreviate,
    formatCurrency,
    formatDate,
    getAttestationUrl,
    getExplorerUrl,
    getIpfsUrl,
    transformMetadata,
} from '@/lib/utils'
import { ReloadIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Address, Chain, createPublicClient, http } from 'viem'
import { writeContract } from '@wagmi/core'
import crypto, { sign } from 'crypto'

import {
    useAccount,
    useChainId,
    useChains,
    useSwitchChain,
    useWriteContract,
} from 'wagmi'
import { SCHEMA_ID, createAttestation, getAttestation } from '@/lib/ethsign'

const RESULT_KEYS = [
    'name',
    'description',
    'recipientName',
    'recipientAddress',
    'owner',
    'network',
    'attestationId',
]

interface Params {
    requestId: Address
}

export default function FundRequest({ params }: { params: Params }) {
    const [loading, setLoading] = useState(true)
    const [signLoading, setSignLoading] = useState(false)
    const [data, setData] = useState<ContractMetadata | undefined>()
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<any>(null)
    const ref = useRef(null)
    const { chains, switchChain } = useSwitchChain()
    const { address } = useAccount()

    const router = useRouter()

    const { requestId } = params

    const chainId = useChainId()
    const currentChain: Chain | undefined = (chains || []).find(
        (c) => c.id === chainId
    )

    const signer = useEthersSigner({ chainId })

    async function fetchData() {
        setLoading(true)
        try {
            const publicClient = createPublicClient({
                chain: currentChain,
                transport: http(),
            })
            let contractData: ContractMetadata = transformMetadata(
                (await publicClient.readContract({
                    abi: FUND_CONTRACT.abi,
                    address: requestId,
                    functionName: 'getMetadata',
                })) as ContractMetadata
            )
            // convert balance and validatedAt to number from bigint
            console.log('contractData', contractData)
            setData(contractData)

            // if (contractData.attestationId && SCHEMA_ID) {
            //     const res = await getAttestation(contractData.attestationId)
            //     console.log('getAttestation', res)
            // }
        } catch (error) {
            console.log('error reading contract', error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    // https://wagmi.sh/react/guides/read-from-contract
    // const { data: balance } = useReadContract({
    //     ...wagmiContractConfig,
    //     functionName: 'balanceOf',
    //     args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
    //   })

    async function signRequest() {
        if (!data) {
            alert('No data to sign - try another url')
            return
        }

        let signature = ''
        if (ref?.current) {
            signature = (ref.current as any).toDataURL() || ''
            console.log('signatureData', signature)
        }

        if (!signature) {
            alert('Signature is required')
            return
        }

        setSignLoading(true)
        const d: ContractMetadata = data
        // generate hash of privateKey
        signature = crypto
            .createHash('sha256')
            .update(d.recipientAddress)
            .digest('hex')
            .toString()

        try {
            const res = await writeContract(config, {
                abi: FUND_CONTRACT.abi,
                address: requestId,
                functionName: 'validate',
                args: [signature],
            })

            console.log('signRequest validate', res, signature)
            await fetchData()
            alert(
                'Request validated! Please wait a few moments for the blockchain to update and refresh the page.'
            )
        } catch (error) {
            console.log('error signing request', error)
            setError(error)
        }
        setSignLoading(false)
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

    const authorized = data && address === data.recipientAddress
    const invalid = !loading && !data
    const isValidated = Boolean(data?.validatedAt)
    const showSignRequest = Boolean(authorized && !isValidated)
    const showResult = Boolean(authorized && isValidated)

    const getTitle = () => {
        if (showResult) {
            return (
                <span className="text-green-500">
                    This request has been validated!
                </span>
            )
        } else if (showSignRequest) {
            return data?.name || 'Fund Request'
        } else if (error) {
            return 'Error accessing Fund Request'
        }
        return 'Fund Request'
    }

    return (
        // center align
        <div className="flex flex-col items-center justify-center mt-8">
            <BasicCard
                title={getTitle()}
                // description="Find and verify a fund request using your wallet."
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

                {!authorized && (
                    <div className="font-bold">
                        <p>Not authorized to sign this request</p>
                    </div>
                )}

                {showResult && (
                    <div>
                        <div className="text-sm text-bold">
                            <Link
                                className="text-blue-500 hover:underline"
                                rel="noopener noreferrer"
                                target="_blank"
                                href={
                                    getExplorerUrl(requestId, currentChain) ||
                                    ''
                                }
                            >
                                View on {data?.network || 'explorer'}
                            </Link>
                        </div>

                        {/* <div className="text-black-500"> */}
                        <div>
                            This request was validated by{' '}
                            <Link
                                className="text-blue-500 hover:underline"
                                rel="noopener noreferrer"
                                target="_blank"
                                href={getExplorerUrl(
                                    data?.recipientAddress,
                                    currentChain
                                )}
                            >
                                {abbreviate(data?.recipientAddress)}
                            </Link>{' '}
                            at {formatDate(data?.validatedAt)}
                        </div>

                        {data && (
                            <div className="mt-4">
                                <RenderObject
                                    title="Data"
                                    obj={data}
                                    keys={RESULT_KEYS}
                                />
                            </div>
                        )}
                        {/* attentation explorer link */}
                        {data?.signature && (
                            <div className="my-2">
                                {/* Copy signature */}
                                <div className="my-2">
                                    <div className="text-sm font-bold">
                                        Signature
                                    </div>
                                    <div className="text-sm">
                                        {data.signature}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {showSignRequest && (
                    <div>
                        <div className="text-sm text-bold">
                            <Link
                                className="text-blue-500 hover:underline"
                                rel="noopener noreferrer"
                                target="_blank"
                                href={
                                    getExplorerUrl(requestId, currentChain) ||
                                    ''
                                }
                            >
                                View on {data?.network || 'explorer'}
                            </Link>
                        </div>

                        {data && (
                            <div className="mt-4">
                                <div className="my-2">
                                    <div className="font-bold text-2xl mb-4 text-black-500">
                                        Hey {data?.recipientName || 'there'},
                                    </div>
                                    <div className="mb-2">
                                        You have a new proof of funds request!
                                    </div>
                                    <hr />
                                    <div className="my-4">
                                        {data.description}
                                    </div>
                                    {data.createdAt && (
                                        <div className="italic">
                                            This was requested at:{' '}
                                            {new Date(
                                                data.createdAt
                                            ).toLocaleString()}
                                        </div>
                                    )}
                                    {data.cid && (
                                        <div className="my-2">
                                            <Link
                                                className="text-blue-500 hover:underline"
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                href={getIpfsUrl(data.cid)}
                                            >
                                                View request attachment
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <div className="text-xl font-bold mt-8">
                                    Details
                                </div>
                                <div>
                                    Balance to verify:&nbsp;
                                    {formatCurrency(data.balance, currentChain)}
                                </div>
                                <div>
                                    Request owner:&nbsp;
                                    <Link
                                        className="text-blue-500 hover:underline"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        href={getExplorerUrl(
                                            data.owner,
                                            currentChain
                                        )}
                                    >
                                        {abbreviate(data.owner)}
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="my-4 border w-[325px] p-1">
                            <div className="text-med font-bold">Sign here</div>
                            <SignatureCanvas ref={ref} />
                        </div>

                        <Button
                            onClick={() => {
                                signRequest()
                            }}
                        >
                            {signLoading && (
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Verify request
                        </Button>
                    </div>
                )}

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
