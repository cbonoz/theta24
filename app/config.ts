import { thetaTestnet } from '@/util/theta-chain'
import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { mainnet, } from 'wagmi/chains'

export const config = createConfig({
    chains: [thetaTestnet],//, mainnet],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        [thetaTestnet.id]: http(),
        [mainnet.id]: http(),
    },
})
