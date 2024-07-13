import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Chain } from 'viem'
import { Config } from 'wagmi'
import { ContractMetadata } from './types'
import { ethers } from 'ethers'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const isEmpty = (obj: any) => !obj || obj.length === 0

export const abbreviate = (s: string | undefined, chars?: number) =>
    s ? `${s.substr(0, chars || 6)}**` : ''

export const assertTrue = (condition: boolean, message: string) => {
    if (!condition) {
        throw new Error(message)
    }
}

export const formatCurrency = (amount: number, chain?: Chain) => {
    if (!chain) {
        return `${amount} ETH`
    }
    // decimals
    const decimals = chain.nativeCurrency.decimals
    const symbol = chain.nativeCurrency.symbol
    return `${amount / 10 ** decimals} ${symbol}`
}

export const getExplorerUrl = (
    address?: string,
    chain?: Chain,
    isTx?: boolean
) => {
    const prefix = isTx ? 'tx' : 'address'
    const baseUrl = chain?.blockExplorers?.default?.url
    if (!baseUrl || !address) {
        return ''
    }
    return `${baseUrl}/${prefix}/${address}`
}

export const getPlaceholderDescription = () => {
    return `I make funny videos for a living. I'm a creator on ${window.location.origin}.`
}

export const transformMetadata = (contractData: ContractMetadata) => {
    contractData.video = Number(contractData.video)
    contractData.validatedAt = Number(contractData.validatedAt) * 1000
    contractData.createdAt = Number(contractData.createdAt) * 1000
    return contractData
}

export const formatDate = (
    d: Date | string | number | undefined,
    onlyDate?: boolean
) => {
    if (!(d instanceof Date)) {
        d = d ? new Date(d) : new Date()
    }

    if (onlyDate) {
        return d.toLocaleDateString()
    }
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

export const isValidEmail = (email: string) => {
    return email && email.indexOf('@') !== -1
}

export const getNameFromUser = (user: any) => {
    return `${user.firstName} ${user.lastName}`
}

export const creatorPageUrl = (address: string) =>
    `${window.location.origin}/creator/${address}`

export const termsUrl = () => `${window.location.origin}/terms`

export const convertCamelToHuman = (str: string) => {
    // Check if likely datetime timestamp ms
    if (str.length === 13) {
        // Check if parseable as a date
        const date = new Date(parseInt(str))
        if (!isNaN(date.getTime())) {
            return formatDate(date)
        }
    }

    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function (s) {
            return s.toUpperCase()
        })
        .replace(/_/g, ' ')
}

export function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const getIpfsUrl = (cid: string) => {
    return `https://gateway.lighthouse.storage/ipfs/${cid}`
}


export const ethToWei = (amount: any) => {
    return ethers.parseEther(amount + '')
}
