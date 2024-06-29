import { defineChain } from "viem";

export const thetaTestnet = /*#__PURE__*/ defineChain({
    id: 365,
    name: 'Theta Testnet',
    nativeCurrency: { name: 'TFuel', symbol: 'TFUEL', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://eth-rpc-api-testnet.thetatoken.org/rpc'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Theta Explorer',
        url: 'https://testnet-explorer.thetatoken.org',
        apiUrl: 'https://api-testnet.thetatoken.org/api',
      },
    },
    contracts: {
      // Add contract addresses and block creation details if available
      exampleContract: {
        address: '0xYourContractAddressHere',
        blockCreated: 1234567, // Replace with actual block number
      },
    },
  })
