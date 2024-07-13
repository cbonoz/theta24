import { CREATOR_CONTRACT } from './metadata'
import { formatDate } from '../utils'
import { ethers } from 'ethers'
import { ContractMetadata, VideoRequest } from '../types'
import { siteConfig } from '@/util/site-config'


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
}
}


export const getMetadataForHandle = async (signer: any, handle: string): Promise<ContractMetadata> => {
  const contract = new ethers.Contract(siteConfig.masterAddress, CREATOR_CONTRACT.abi, signer)
  const result = await (contract.getMetadata as any).call()
  console.log('result', result)
  return processMetadata(result)

}

export const registerHandle = async (signer: any, handle: string, name: string, description: string, videoUrls: string): Promise<ContractMetadata> => {
  const contract = new ethers.Contract(siteConfig.masterAddress, CREATOR_CONTRACT.abi, signer)
  const result = await contract.registerHandle(handle, name, description, videoUrls)
  console.log('result', result)

  return processMetadata(result)
}

export const requestVideo = async (signer: any, message: string, donation: number): Promise<ContractMetadata> => {
  const contract = new ethers.Contract(siteConfig.masterAddress, CREATOR_CONTRACT.abi, signer)
  const result = await contract.makeRequest(message, 0 , { value: ethToWei(donation) })
  console.log('result', result)

  return processMetadata(result)
}
