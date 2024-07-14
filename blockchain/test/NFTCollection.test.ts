import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("NFTCollection", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
    const nftMarket = await NFTMarket.deploy()
    const marketAddress = await nftMarket.getAddress()
    const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
    const nftCollection = await NFTCollection.deploy(marketAddress)

    return { nftCollection, owner, otherAccount, marketAddress};
  }

  it('Should mint a token', async () => {
    // ARRANGE
    const { nftCollection } = await loadFixture(deployFixture);

    // ACT
    await nftCollection.mint("https://ipfs.something");
    const response = await nftCollection.tokenURI(1);

    // ASSERT
    expect(response).to.equal("https://ipfs.something")
  })
});
