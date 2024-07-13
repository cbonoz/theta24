import { ContractMetadata, CreatorPageData } from './types';

export const DEMO_REQUEST: CreatorPageData  = {
    handle: 'cb-videos',
    name: 'CB productions',
    description: 'This is a creator page',
}


export const DEMO_METADATA: ContractMetadata = {
    handle: 'cb-videos',
    creatorName: 'CB productions',
    creatorDescription: 'This is a creator page',
    initialVideoUrls: ['https://www.youtube.com/watch?v=6ZfuNTqbHE8'],
    creatorAddress: '0xCREATORADDRESS',
    requests: [
        {
            handle: 'cb-videos',
            donation: '100',
            message: 'I want a video on dogs',
            requester: '0x1234567890'
        }
    ],
    active: true,
    createdAt: '2022-01-01',
    isValue: true,
}
