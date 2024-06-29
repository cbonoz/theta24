<p align='center'>
    <img src='https://i.ibb.co/yqZzy48/logo.png' width=400 />
</p>

## CreatorMatch

A smart contract mediated marketplace connecting creators with sponsors, managed by Theta blockchain technology.

Going for the Real world applications and finance category of https://theta.devpost.com/

Live Demo URL (deployed with Theta Testnet): https://creatormatch.vercel.app

Demo video (YouTube ~3 minutes): https://youtu.be/G-mRl-ZpjXE

### Inspiration

Connecting creators with sponsors can be challenging due to trust issues and the need for transparent, secure transactions. 

With CreatorMatch, creators can showcase their projects and connect with sponsors without revealing sensitive financial information. Smart contracts ensure that funds are securely managed, and milestones are met before payments are released.

### Example smart contract interaction

Contract: https://testnet-blockscout.theta.com/address/0x9189c7722C0B815cd3752d559aD10980E20e59B4

Signature page: https://creatormatch.vercel.app/sign/0x9189c7722C0B815cd3752d559aD10980E20e59B4 (only viewable with designated recipient address).

### Example use case

* **Creators:**
    * Post project ideas and connect wallets to receive sponsorships.
    * Generate smart contract agreements that outline project milestones and payment schedules.
    * Securely share progress and updates with sponsors, ensuring transparency and trust.

* **Sponsors:**
    * Browse through various creative projects and select ones to sponsor.
    * Verify creator authenticity and project feasibility through smart contract interactions.
    * Monitor project progress and release funds only when agreed milestones are met.

When a sponsorship request is created, a smart contract is deployed to manage the transaction. The address of the smart contract serves as a unique URL that can be shared with the sponsor. Only the intended recipient can validate and interact with the contract.

When the sponsorship is completed, a blockchain event is emitted with information about the transaction. This event can be listened to on other networks or blockchain platforms (or for indexing on `the Graph`).

### Technologies used

**Filecoin**: Used for secure file storage for additional project-related materials. When the other party visits the authenticated link, they can access the uploaded material securely. This is managed with Saturn and uses the Lighthouse web3 SDK for both upload and download based on the CID. Created CIDs are saved to the smart contracts and are retrieved when the verification page is accessed. The CID is only revealed to authorized parties (creator and sponsor).

<a href="https://gateway.lighthouse.storage/ipfs/QmeSUzMZSmUnj56WkriWwHjWqtJyarFX41EkPdscrQusuy">Example uploaded document</a>

This app was deployed and supports Theta Testnet and Ethereum mainnet. Depending on the use case, the event fired from the contract when verification is completed can be used to trigger separate blockchain-specific workflows.

### How to run

1. Fill in values in `.env.sample`, copy to a new file `.env`.

2. `yarn; yarn dev`

The app should now be running on port 3000.

### Updating the smart contract

1. Update `CreatorContract.sol` in `/creatorcontract/contracts`.

2. Install dependencies via yarn in the root folder. Run `npx hardhat compile` from `/creatorcontract`.

3. Copy contents (includes ABI) to `metadata.tsx#FUND_CONTRACT`.

4. Rebuild the web project. The app should now be using the updated contract code.

### Potential future work

1. Enhanced Smart Contract Functionality: Implementing advanced smart contract functionalities to further automate and streamline the sponsorship process, reducing manual evaluation and communication.

2. Expanded Blockchain Support: Adding support for additional blockchain networks and protocols to broaden CreatorMatch's reach and accessibility, catering to users across different blockchain ecosystems.

3. Integration of Advanced Security Features: Integrating advanced security features such as zero-knowledge proofs to further validate the viewer of a contract.

### Useful links

# Image gallery

<p align='center'>
    <img src='https://i.ibb.co/6m1MxJz/logo.png' width=400 />
</p>

## CreatorMatch

A smart contract mediated marketplace connecting creators with sponsors, managed by Theta blockchain technology.

Going for the Real world applications and finance category of https://theta2024.devpost.com/

Live Demo URL (deployed with Theta Testnet): https://creatormatch.vercel.app

Demo video (YouTube ~3 minutes): https://youtu.be/G-mRl-ZpjXE

### Inspiration

Connecting creators with sponsors can be challenging due to trust issues and the need for transparent, secure transactions. 

With CreatorMatch, creators can showcase their projects and connect with sponsors without revealing sensitive financial information. Smart contracts ensure that funds are securely managed, and milestones are met before payments are released.

### Example smart contract interaction

Contract: https://testnet-blockscout.theta.com/address/0x9189c7722C0B815cd3752d559aD10980E20e59B4

Signature page: https://creatormatch.vercel.app/sign/0x9189c7722C0B815cd3752d559aD10980E20e59B4 (only viewable with designated recipient address).

### Example use case

* **Creators:**
    * Post project ideas and connect wallets to receive sponsorships.
    * Generate smart contract agreements that outline project milestones and payment schedules.
    * Securely share progress and updates with sponsors, ensuring transparency and trust.

* **Sponsors:**
    * Browse through various creative projects and select ones to sponsor.
    * Verify creator authenticity and project feasibility through smart contract interactions.
    * Monitor project progress and release funds only when agreed milestones are met.

When a sponsorship request is created, a smart contract is deployed to manage the transaction. The address of the smart contract serves as a unique URL that can be shared with the sponsor. Only the intended recipient can validate and interact with the contract.

When the sponsorship is completed, a blockchain event is emitted with information about the transaction. This event can be listened to on other networks or blockchain platforms (or for indexing on `the Graph`).

### Technologies used

**Filecoin**: Used for secure file storage for additional project-related materials. When the other party visits the authenticated link, they can access the uploaded material securely. This is managed with Saturn and uses the Lighthouse web3 SDK for both upload and download based on the CID. Created CIDs are saved to the smart contracts and are retrieved when the verification page is accessed. The CID is only revealed to authorized parties (creator and sponsor).

<a href="https://gateway.lighthouse.storage/ipfs/QmeSUzMZSmUnj56WkriWwHjWqtJyarFX41EkPdscrQusuy">Example uploaded document</a>

This app was deployed and supports Theta Testnet and Ethereum mainnet. Depending on the use case, the event fired from the contract when verification is completed can be used to trigger separate blockchain-specific workflows.

### How to run

1. Fill in values in `.env.sample`, copy to a new file `.env`.

2. `yarn; yarn dev`

The app should now be running on port 3000.

### Updating the smart contract

1. Update `CreatorContract.sol` in `/creatorcontract/contracts`.

2. Install dependencies via yarn in the root folder. Run `npx hardhat compile` from `/creatorcontract`.

3. Copy contents (includes ABI) to `metadata.tsx#FUND_CONTRACT`.

4. Rebuild the web project. The app should now be using the updated contract code.

### Potential future work

1. Enhanced Smart Contract Functionality: Implementing advanced smart contract functionalities to further automate and streamline the sponsorship process, reducing manual evaluation and communication.

2. Expanded Blockchain Support: Adding support for additional blockchain networks and protocols to broaden CreatorMatch's reach and accessibility, catering to users across different blockchain ecosystems.

3. Integration of Advanced Security Features: Integrating advanced security features such as zero-knowledge proofs to further validate the viewer of a contract.

### Useful links

# Image gallery

## Home

![Home](./img/home.png)

## About page

![About](./img/about.png)

## Creating a new sponsorship request

![Create](./img/create.png)

## Request created

![Created](./img/created.png)

## Insufficient balance error

![Error](./img/error.png)

## Access error (not designated recipient)

![Error](./img/access.png)

## Example Filecoin IPFS Upload

![Filecoin IPFS Upload](./img/filecoin_ipfs_upload.png)

## Verified

![Verified](./img/verified.png)

## Smart Contract code sample

![Contract](./img/contract.png)
## Home
