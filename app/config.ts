import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { mainnet, thetaSepolia } from 'wagmi/chains'

export const config = createConfig({
    chains: [thetaSepolia, mainnet],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        [thetaSepolia.id]: http(),
        [mainnet.id]: http(),
    },
})
