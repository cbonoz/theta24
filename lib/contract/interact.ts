import { CREATOR_CONTRACT } from './metadata'
import { formatDate } from '../utils'
import { ethers } from 'ethers'
import { ContractMetadata } from '../types'

export const getMetadata = async (signer: any, address: string): Promise<ContractMetadata> => {
  const contract = new ethers.Contract(address, CREATOR_CONTRACT.abi, signer)
  const result = await (contract.getMetadata as any).call()
  console.log('result', result)
  return {
      name: result[0],
      description: result[1],
      versionCount: result[2].toNumber(),
      createdAt: formatDate(result[3].toNumber() * 1000),
      owner: result[4],
  }
}

export const validate = async (signer: any, address: string, signature: string) => {
  const contract = new ethers.Contract(address, CREATOR_CONTRACT.abi, signer)
  const result = await contract.validate(signature)
  console.log('result', result)
  return {
      creator: result[0],
      dataHash: result[1],
      timestamp: formatDate(result[2].toNumber() * 1000),
      version: result[3].toNumber(),
      cid: result[4],
      notes: result[5],
  }
}
