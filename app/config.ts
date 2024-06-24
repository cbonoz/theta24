import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { mainnet, liskSepolia } from 'wagmi/chains'

export const config = createConfig({
    chains: [liskSepolia, mainnet],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        [liskSepolia.id]: http(),
        [mainnet.id]: http(),
    },
})
