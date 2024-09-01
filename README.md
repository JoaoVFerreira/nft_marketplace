# OpenC NFT Marketplace
A simplified version of the OpenSea website, designed to explore and implement concepts related to Non-Fungible Tokens (NFTs) and the ERC721 standard.

## Objective

- Deepen understanding of Non-Fungible Tokens (NFTs)
- Implement and explore the ERC721 standard for NFTs

## Features
- Mint new NFTs
- List NFTs for sale

## Tech Stack

### Blockchain
- Hardhat
- Solidity
- Ethers
- Chai & Mocha
- Polygon blockchain

### Frontend
- React
- Typescript
- Ethers

## How to use

frontend **.env** suggestion

``` bash
MARKETPLACE_ADDRESS=0x9CFdb1D5117ECF0d7329880681b02D20b866fe5F
COLLECTION_ADDRESS=0xB80501DC65a9D22c47BFE24bEbf91c103CcEd302
``` 

blockchain **.env** suggestion

``` bash
SECRET=yourSecret
API_KEY=yourApiKey
RPC_URL=https://rpc-amoy.polygon.technology/
CHAIN_ID=80002
``` 

- Clone the repo
``` bash
git clone https://github.com/JoaoVFerreira/nft_marketplace.git
```

- Requires an account on a wallet client like Metamask or others...
- Adding **MATIC(POL)** through a faucet. [POL Faucet](https://faucet.polygon.technology/)
- Need to create an account and switch to Polygon test net, as it's the testnet blockchain where the smart contract is deployed.
- Use suggested **env.**
- Run npm install and npm run start for the frontend.

## License
This project is available under the **MIT License**